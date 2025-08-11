import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/templates - List all available templates
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const active_only = searchParams.get('active_only') === 'true';
        
        const where: any = {};
        if (type) where.template_type = type;
        if (active_only) where.is_active = true;

        const templates = await prisma.site_templates.findMany({
            where,
            include: {
                customer_sites: {
                    select: {
                        id: true,
                        domain: true,
                        status: true
                    }
                },
                _count: {
                    select: {
                        customer_sites: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        // Add usage statistics
        const templatesWithStats = templates.map(template => ({
            ...template,
            usage_count: template._count.customer_sites,
            active_sites: template.customer_sites.filter(site => site.status === 'active').length
        }));

        return NextResponse.json({
            success: true,
            data: templatesWithStats
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch templates' },
            { status: 500 }
        );
    }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const { template_name, template_type, source_path } = body;
        
        if (!template_name || !template_type || !source_path) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: template_name, template_type, source_path' },
                { status: 400 }
            );
        }

        // Check if template name already exists
        const existingTemplate = await prisma.site_templates.findFirst({
            where: { template_name }
        });

        if (existingTemplate) {
            return NextResponse.json(
                { success: false, error: 'Template name already exists' },
                { status: 409 }
            );
        }

        const template = await prisma.site_templates.create({
            data: {
                template_name,
                template_type,
                description: body.description || null,
                source_path,
                default_config: body.default_config || {},
                features: body.features || [],
                preview_url: body.preview_url || null,
                is_active: body.is_active ?? true,
                version: body.version || '1.0.0'
            }
        });

        return NextResponse.json({
            success: true,
            data: template,
            message: 'Template created successfully'
        });
    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create template' },
            { status: 500 }
        );
    }
}

// PUT /api/templates - Update template
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Template ID is required' },
                { status: 400 }
            );
        }

        // Check if template exists
        const existingTemplate = await prisma.site_templates.findUnique({
            where: { id }
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { success: false, error: 'Template not found' },
                { status: 404 }
            );
        }

        const template = await prisma.site_templates.update({
            where: { id },
            data: {
                ...updateData,
                updated_at: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            data: template,
            message: 'Template updated successfully'
        });
    } catch (error) {
        console.error('Error updating template:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update template' },
            { status: 500 }
        );
    }
}