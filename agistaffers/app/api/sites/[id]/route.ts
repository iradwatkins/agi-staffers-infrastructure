import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/sites/[id] - Get site by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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

        return NextResponse.json({
            success: true,
            data: site
        });
    } catch (error) {
        console.error('Error fetching site:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch site' },
            { status: 500 }
        );
    }
}

// PUT /api/sites/[id] - Update site
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        
        // Check if site exists
        const existingSite = await prisma.customer_sites.findUnique({
            where: { id: params.id }
        });

        if (!existingSite) {
            return NextResponse.json(
                { success: false, error: 'Site not found' },
                { status: 404 }
            );
        }

        const site = await prisma.customer_sites.update({
            where: { id: params.id },
            data: {
                ...body,
                updated_at: new Date()
            },
            include: {
                customers: true,
                site_templates: true
            }
        });

        return NextResponse.json({
            success: true,
            data: site,
            message: 'Site updated successfully'
        });
    } catch (error) {
        console.error('Error updating site:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update site' },
            { status: 500 }
        );
    }
}

// DELETE /api/sites/[id] - Delete site
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if site exists
        const site = await prisma.customer_sites.findUnique({
            where: { id: params.id },
            include: {
                customers: true
            }
        });

        if (!site) {
            return NextResponse.json(
                { success: false, error: 'Site not found' },
                { status: 404 }
            );
        }

        // Update status to deleting first
        await prisma.customer_sites.update({
            where: { id: params.id },
            data: { 
                status: 'deleting',
                updated_at: new Date()
            }
        });

        // TODO: Trigger site teardown process
        // This would remove Docker containers, Caddy configs, etc.
        console.log('Site deletion requested:', {
            site_id: site.id,
            domain: site.domain,
            customer: site.customers.company_name
        });

        // For now, just mark as deleted
        await prisma.customer_sites.update({
            where: { id: params.id },
            data: { 
                status: 'deleted',
                updated_at: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Site deletion completed'
        });
    } catch (error) {
        console.error('Error deleting site:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete site' },
            { status: 500 }
        );
    }
}