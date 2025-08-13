// BMAD: 2FA Setup API Route
// Path: /api/auth/2fa/setup
// Method: POST - Generate 2FA secret and QR code

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // Check if 2FA is already enabled
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true }
    });

    if (user?.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled for this account' },
        { status: 400 }
      );
    }

    // Generate new secret
    const secret = speakeasy.generateSecret({
      name: `AGI Staffers (${session.user.email})`,
      issuer: 'AGI Staffers',
      length: 32
    });

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store secret temporarily (not enabled yet)
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false // Will be enabled after verification
      }
    });

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secret.base32,
      message: 'Scan the QR code with your authenticator app'
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
}