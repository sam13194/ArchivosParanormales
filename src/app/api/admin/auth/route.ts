import { NextRequest, NextResponse } from 'next/server';

// TEMPORAL: Sin Firebase Admin configurado, vamos a crear una API que ayude al usuario
// a registrarse manualmente usando el frontend

// POST - Información para crear usuario con contraseña
export async function POST(request: NextRequest) {
  try {
    const { action, email, password, displayName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Mientras Firebase Admin no esté configurado, devolvemos instrucciones claras
    switch (action) {
      case 'create_user_with_password':
        if (!password || password.length < 6) {
          return NextResponse.json(
            { error: 'La contraseña debe tener al menos 6 caracteres' },
            { status: 400 }
          );
        }

        // Devolver información de registro manual
        return NextResponse.json({
          success: false,
          needsManualRegistration: true,
          registrationInfo: {
            email,
            password,
            displayName: displayName || email.split('@')[0]
          },
          instructions: 'El usuario debe registrarse manualmente en /auth/register con estas credenciales',
          registerUrl: '/auth/register',
          message: 'Firebase Admin no configurado - se requiere registro manual del usuario'
        });

      case 'send_password_reset':
        // Simular generación de link
        return NextResponse.json({
          success: true,
          resetLink: `https://archivosparanormales-a24a5.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=temp_code_${Date.now()}`,
          message: 'Link de reset generado (TEMPORAL - Firebase Admin pendiente de configurar)'
        });

      case 'set_custom_password':
        if (!password || password.length < 6) {
          return NextResponse.json(
            { error: 'La contraseña debe tener al menos 6 caracteres' },
            { status: 400 }
          );
        }

        // Simular actualización exitosa
        return NextResponse.json({
          success: true,
          message: 'Contraseña actualizada exitosamente (TEMPORAL - Firebase Admin pendiente de configurar)'
        });

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin auth API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener información de autenticación de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const uid = searchParams.get('uid');

    if (!email && !uid) {
      return NextResponse.json(
        { error: 'Email o UID requerido' },
        { status: 400 }
      );
    }

    // TEMPORAL: Simular respuesta hasta que Firebase Admin esté configurado
    return NextResponse.json({
      success: true,
      user: {
        uid: uid || `temp_uid_for_${email}`,
        email: email,
        displayName: email?.split('@')[0] || 'Usuario',
        emailVerified: false,
        disabled: false,
        lastSignInTime: new Date().toISOString(),
        creationTime: new Date().toISOString(),
        providerData: []
      },
      note: 'TEMPORAL - Firebase Admin pendiente de configurar'
    });

  } catch (error) {
    console.error('Admin auth GET error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}