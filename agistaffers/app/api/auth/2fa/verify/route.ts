// BMAD: 2FA Verification API Route
// Path: /api/auth/2fa/verify
// Methods: POST - Verify TOTP token, DELETE - Disable 2FA

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/prisma';

// Verify TOTP token and enable 2FA
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { token } = await request.json();

    if (!token || token.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Get user's secret
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        twoFactorSecret: true,
        twoFactorEnabled: true
      }
    });

    if (!user?.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA not setup. Please setup 2FA first.' },
        { status: 400 }
      );
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps for clock skew
    });

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token. Please try again.' },
        { status: 400 }
      );
    }

    // Enable 2FA if not already enabled
    if (!user.twoFactorEnabled) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { twoFactorEnabled: true }
      });
    }

    // Generate backup codes (optional)
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    // Store backup codes (hashed in production)
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorBackupCodes: backupCodes.join(',')
      }
    });

    return NextResponse.json({
      success: true,
      message: '2FA successfully enabled',
      backupCodes: backupCodes
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

// Disable 2FA
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Disable 2FA
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null
      }
    });

    return NextResponse.json({
      success: true,
      message: '2FA has been disabled'
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    );
  }
}