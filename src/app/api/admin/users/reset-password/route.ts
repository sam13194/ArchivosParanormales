import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

// POST - Send password reset email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    try {
      // Generate password reset link
      const resetLink = await adminAuth.generatePasswordResetLink(email);
      
      // In a production environment, you would send this link via email
      // For now, we'll log it and return success
      console.log(`Password reset link generated for ${email}: ${resetLink}`);
      
      // TODO: Implement actual email sending service
      // await sendPasswordResetEmail(email, resetLink);

      return NextResponse.json({
        success: true,
        message: 'Email de restablecimiento enviado exitosamente',
        // In development, you might want to include the link
        ...(process.env.NODE_ENV === 'development' && { resetLink })
      });

    } catch (firebaseError: any) {
      console.error('Firebase Admin error:', firebaseError);
      
      if (firebaseError.code === 'auth/user-not-found') {
        // For security reasons, don't reveal if user exists or not
        return NextResponse.json({
          success: true,
          message: 'Si el email existe, se ha enviado un enlace de restablecimiento'
        });
      }
      
      return NextResponse.json(
        { error: 'Error al generar enlace de restablecimiento', details: firebaseError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}