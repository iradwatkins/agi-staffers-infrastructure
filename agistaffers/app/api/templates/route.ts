import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/templates - List all site templates
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const active = searchParams.get('active');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        const skip = (page - 1) * limit;
        
        const where: any = {};
        if (category) where.category = category;
        if (active !== null) where.isActive = active === 'true';

        const [templates, total] = await Promise.all([
            prisma.siteTemplate.findMany({
                where,
                skip,
                take: limit,
                orderBy: { usageCount: 'desc' }
            }),
            prisma.siteTemplate.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                templates,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
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
        const { templateName, displayName, description, category, sourcePath } = body;
        
        if (!templateName || !displayName || !description || !category || !sourcePath) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: templateName, displayName, description, category, sourcePath' },
                { status: 400 }
            );
        }

        // Check if template name already exists
        const existingTemplate = await prisma.siteTemplate.findUnique({
            where: { templateName }
        });

        if (existingTemplate) {
            return NextResponse.json(
                { success: false, error: 'Template with this name already exists' },
                { status: 409 }
            );
        }

        const template = await prisma.siteTemplate.create({
            data: {
                templateName,
                displayName,
                description,
                category,
                sourcePath,
                thumbnailUrl: body.thumbnailUrl || null,
                previewUrl: body.previewUrl || null,
                dockerImage: body.dockerImage || null,
                defaultConfig: body.defaultConfig || {},
                features: body.features || [],
                requiredEnvVars: body.requiredEnvVars || [],
                version: body.version || '1.0.0',
                isActive: body.isActive !== undefined ? body.isActive : true
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
        const existingTemplate = await prisma.siteTemplate.findUnique({
            where: { id }
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { success: false, error: 'Template not found' },
                { status: 404 }
            );
        }

        const template = await prisma.siteTemplate.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
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

// DELETE /api/templates - Delete template
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Template ID is required' },
                { status: 400 }
            );
        }

        // Check if template exists
        const existingTemplate = await prisma.siteTemplate.findUnique({
            where: { id },
            include: {
                sites: { select: { id: true } }
            }
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { success: false, error: 'Template not found' },
                { status: 404 }
            );
        }

        // Check if template is in use
        if (existingTemplate.sites.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Cannot delete template. It is currently used by ${existingTemplate.sites.length} site(s)` 
                },
                { status: 409 }
            );
        }

        await prisma.siteTemplate.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Template deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete template' },
            { status: 500 }
        );
    }
}