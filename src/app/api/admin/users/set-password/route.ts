import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, canInitializeFirebaseAdmin } from '@/lib/firebase-admin';

// POST - Set custom password for user
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Check if Firebase Admin is configured
    if (!canInitializeFirebaseAdmin() || !adminAuth) {
      console.log('Firebase Admin not configured, password update not available');
      return NextResponse.json({
        success: false,
        error: 'Firebase Admin no configurado',
        message: 'Las variables de entorno FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY son requeridas para esta funcionalidad'
      }, { status: 503 });
    }

    try {
      // Get user by email
      const userRecord = await adminAuth.getUserByEmail(email);
      
      // Update password
      await adminAuth.updateUser(userRecord.uid, {
        password: password,
      });

      console.log(`Password updated successfully for user: ${email}`);

      return NextResponse.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });

    } catch (firebaseError: any) {
      console.error('Firebase Admin error:', firebaseError);
      
      if (firebaseError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'Usuario no encontrado en Firebase' },
          { status: 404 }
        );
      }
      
      if (firebaseError.code === 'auth/invalid-password') {
        return NextResponse.json(
          { error: 'La contraseña no cumple con los requisitos de seguridad' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error al actualizar contraseña en Firebase', details: firebaseError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Set password API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}