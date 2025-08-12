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
                { companyName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { contactName: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take: limit,
                include: {
                    sites: {
                        select: {
                            id: true,
                            domain: true,
                            status: true,
                            createdAt: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.customer.count({ where })
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
        const { companyName, contactName, email, plan } = body;
        
        if (!companyName || !contactName || !email) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: companyName, contactName, email' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { email }
        });

        if (existingCustomer) {
            return NextResponse.json(
                { success: false, error: 'Customer with this email already exists' },
                { status: 409 }
            );
        }

        const customer = await prisma.customer.create({
            data: {
                companyName,
                contactName,
                email,
                contactPhone: body.contactPhone || null,
                plan: plan || 'starter',
                status: 'active',
                billingEmail: body.billingEmail || email
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
        const existingCustomer = await prisma.customer.findUnique({
            where: { id }
        });

        if (!existingCustomer) {
            return NextResponse.json(
                { success: false, error: 'Customer not found' },
                { status: 404 }
            );
        }

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
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