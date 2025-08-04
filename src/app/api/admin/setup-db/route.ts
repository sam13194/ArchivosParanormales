import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Solo permitir esto en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Setup only allowed in development' },
        { status: 403 }
      );
    }

    const { action } = await request.json();

    if (action === 'create-users-table') {
      // Leer y ejecutar el script SQL para usuarios
      const sqlPath = join(process.cwd(), 'database', 'create-users-table.sql');
      const sql = readFileSync(sqlPath, 'utf-8');
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error('Error creating users table:', error);
        return NextResponse.json(
          { error: 'Failed to create users table', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Users table created successfully' 
      });
    }

    if (action === 'create-homepage-config-table') {
      // Leer y ejecutar el script SQL para configuración homepage
      const sqlPath = join(process.cwd(), 'database', 'create-homepage-config-table.sql');
      const sql = readFileSync(sqlPath, 'utf-8');
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error('Error creating homepage config table:', error);
        return NextResponse.json(
          { error: 'Failed to create homepage config table', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Homepage config table created successfully' 
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Setup DB error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}