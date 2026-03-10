import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createNeonDatabase } from '@/lib/neon';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectName, databaseName } = await req.json();

    if (!projectName) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const dbName = databaseName || `${projectName}-db`;
    const connectionInfo = await createNeonDatabase(dbName);

    return NextResponse.json({
      success: true,
      ...connectionInfo,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create database' },
      { status: 500 }
    );
  }
}
