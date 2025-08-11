import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SiteDeploymentService } from '@/lib/site-deployment-service';

const prisma = new PrismaClient();

// POST /api/sites/[id]/deploy - Deploy a site
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        
        // Get site details
        const site = await prisma.customer_sites.findUnique({
            where: { id: params.id },
            include: {
                customers: true,
                site_templates: true
            }
        });

        if (!site) {
            return NextResponse.json(
                { success: false, error: 'Site not found' },
                { status: 404 }
            );
        }

        // Check if site is in a deployable state
        if (!['pending', 'failed', 'cancelled'].includes(site.status)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Cannot deploy site in '${site.status}' status. Current status must be 'pending', 'failed', or 'cancelled'.` 
                },
                { status: 409 }
            );
        }

        // Get template information
        const template = site.site_templates;
        if (!template) {
            return NextResponse.json(
                { success: false, error: 'Site template not found' },
                { status: 404 }
            );
        }

        // Queue deployment
        const deploymentService = SiteDeploymentService.getInstance();
        await deploymentService.queueDeployment({
            siteId: site.id,
            domain: site.domain,
            templatePath: template.source_path,
            customConfig: {
                ...template.default_config,
                ...site.deployment_config,
                ...body.customConfig
            },
            sslEnabled: site.ssl_enabled
        });

        return NextResponse.json({
            success: true,
            message: 'Site deployment queued successfully',
            data: {
                site_id: site.id,
                domain: site.domain,
                status: 'queued',
                template: template.template_name
            }
        });
    } catch (error) {
        console.error('Error deploying site:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to queue site deployment' },
            { status: 500 }
        );
    }
}

// GET /api/sites/[id]/deploy - Get deployment status
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const deploymentService = SiteDeploymentService.getInstance();
        const status = await deploymentService.getDeploymentStatus(params.id);
        
        return NextResponse.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Error fetching deployment status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch deployment status' },
            { status: 500 }
        );
    }
}

// DELETE /api/sites/[id]/deploy - Cancel deployment
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const deploymentService = SiteDeploymentService.getInstance();
        const cancelled = await deploymentService.cancelDeployment(params.id);
        
        if (cancelled) {
            return NextResponse.json({
                success: true,
                message: 'Deployment cancelled successfully'
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Deployment not found in queue or already started'
            }, { status: 404 });
        }
    } catch (error) {
        console.error('Error cancelling deployment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to cancel deployment' },
            { status: 500 }
        );
    }
}