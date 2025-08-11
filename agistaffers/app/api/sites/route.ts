import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/sites - List all customer sites
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const customer_id = searchParams.get('customer_id');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        const skip = (page - 1) * limit;
        
        const where: any = {};
        if (customer_id) where.customer_id = customer_id;
        if (status) where.status = status;

        const [sites, total] = await Promise.all([
            prisma.customer_sites.findMany({
                where,
                skip,
                take: limit,
                include: {
                    customers: {
                        select: {
                            company_name: true,
                            contact_name: true,
                            contact_email: true
                        }
                    },
                    site_templates: {
                        select: {
                            template_name: true,
                            template_type: true
                        }
                    }
                },
                orderBy: { created_at: 'desc' }
            }),
            prisma.customer_sites.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                sites,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching sites:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch sites' },
            { status: 500 }
        );
    }
}

// POST /api/sites - Create new site
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const { customer_id, domain, template_id } = body;
        
        if (!customer_id || !domain || !template_id) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: customer_id, domain, template_id' },
                { status: 400 }
            );
        }

        // Check if customer exists
        const customer = await prisma.customers.findUnique({
            where: { id: customer_id }
        });

        if (!customer) {
            return NextResponse.json(
                { success: false, error: 'Customer not found' },
                { status: 404 }
            );
        }

        // Check if template exists
        const template = await prisma.site_templates.findUnique({
            where: { id: template_id }
        });

        if (!template) {
            return NextResponse.json(
                { success: false, error: 'Template not found' },
                { status: 404 }
            );
        }

        // Check if domain already exists
        const existingSite = await prisma.customer_sites.findFirst({
            where: { domain }
        });

        if (existingSite) {
            return NextResponse.json(
                { success: false, error: 'Domain already in use' },
                { status: 409 }
            );
        }

        // Create site record
        const site = await prisma.customer_sites.create({
            data: {
                customer_id,
                domain,
                template_id,
                status: 'deploying',
                deployment_config: body.deployment_config || {},
                ssl_enabled: true,
                auto_backup: body.auto_backup ?? true
            },
            include: {
                customers: true,
                site_templates: true
            }
        });

        // TODO: Trigger deployment process
        // This would integrate with Docker/Caddy to actually deploy the site
        console.log('Site deployment requested:', {
            site_id: site.id,
            domain: site.domain,
            template: template.template_name
        });

        return NextResponse.json({
            success: true,
            data: site,
            message: 'Site created and deployment started'
        });
    } catch (error) {
        console.error('Error creating site:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create site' },
            { status: 500 }
        );
    }
}