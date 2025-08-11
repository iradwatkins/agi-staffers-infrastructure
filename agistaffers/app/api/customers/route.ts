import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/customers - List all customers
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        
        const skip = (page - 1) * limit;
        
        const where = search ? {
            OR: [
                { company_name: { contains: search, mode: 'insensitive' } },
                { contact_email: { contains: search, mode: 'insensitive' } },
                { contact_name: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const [customers, total] = await Promise.all([
            prisma.customers.findMany({
                where,
                skip,
                take: limit,
                include: {
                    customer_sites: {
                        select: {
                            id: true,
                            domain: true,
                            status: true,
                            created_at: true
                        }
                    }
                },
                orderBy: { created_at: 'desc' }
            }),
            prisma.customers.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                customers,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const { company_name, contact_name, contact_email, plan_tier } = body;
        
        if (!company_name || !contact_name || !contact_email) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: company_name, contact_name, contact_email' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingCustomer = await prisma.customers.findUnique({
            where: { contact_email }
        });

        if (existingCustomer) {
            return NextResponse.json(
                { success: false, error: 'Customer with this email already exists' },
                { status: 409 }
            );
        }

        // Generate customer subdomain
        const subdomain = company_name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20);

        const customer = await prisma.customers.create({
            data: {
                company_name,
                contact_name,
                contact_email,
                phone: body.phone || null,
                plan_tier: plan_tier || 'basic',
                status: 'active',
                subdomain,
                billing_email: body.billing_email || contact_email,
                notes: body.notes || null,
                metadata: body.metadata || {}
            }
        });

        return NextResponse.json({
            success: true,
            data: customer,
            message: 'Customer created successfully'
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}

// PUT /api/customers - Update customer
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        // Check if customer exists
        const existingCustomer = await prisma.customers.findUnique({
            where: { id }
        });

        if (!existingCustomer) {
            return NextResponse.json(
                { success: false, error: 'Customer not found' },
                { status: 404 }
            );
        }

        const customer = await prisma.customers.update({
            where: { id },
            data: {
                ...updateData,
                updated_at: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            data: customer,
            message: 'Customer updated successfully'
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update customer' },
            { status: 500 }
        );
    }
}