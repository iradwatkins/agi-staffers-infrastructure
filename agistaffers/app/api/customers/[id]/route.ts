import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/customers/[id] - Get customer by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const customer = await prisma.customers.findUnique({
            where: { id: params.id },
            include: {
                customer_sites: {
                    include: {
                        site_templates: true
                    }
                }
            }
        });

        if (!customer) {
            return NextResponse.json(
                { success: false, error: 'Customer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customer' },
            { status: 500 }
        );
    }
}

// DELETE /api/customers/[id] - Delete customer
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if customer exists
        const customer = await prisma.customers.findUnique({
            where: { id: params.id },
            include: {
                customer_sites: true
            }
        });

        if (!customer) {
            return NextResponse.json(
                { success: false, error: 'Customer not found' },
                { status: 404 }
            );
        }

        // Check if customer has active sites
        const activeSites = customer.customer_sites.filter(site => site.status === 'active');
        if (activeSites.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Cannot delete customer with ${activeSites.length} active sites. Deactivate sites first.` 
                },
                { status: 409 }
            );
        }

        // Delete customer (cascade will handle related records)
        await prisma.customers.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete customer' },
            { status: 500 }
        );
    }
}