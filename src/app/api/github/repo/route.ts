import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createGitHubRepo, pushToGitHub, getGitHubUser } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get GitHub token from session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const githubToken = session?.provider_token;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not available. Please re-authenticate with GitHub.' },
        { status: 401 }
      );
    }

    const { action, name, description, isPrivate, files, owner, repo, message } =
      await req.json();

    if (action === 'create') {
      const result = await createGitHubRepo(githubToken, {
        name,
        description,
        isPrivate,
      });

      return NextResponse.json({
        success: true,
        repo_url: result.html_url,
        clone_url: result.clone_url,
        full_name: result.full_name,
      });
    }

    if (action === 'push') {
      const result = await pushToGitHub(
        githubToken,
        owner,
        repo,
        files,
        message
      );

      return NextResponse.json({
        success: true,
        sha: result.sha,
      });
    }

    if (action === 'user') {
      const ghUser = await getGitHubUser(githubToken);
      return NextResponse.json({ success: true, user: ghUser });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'GitHub operation failed' },
      { status: 500 }
    );
  }
}
