import { NextResponse } from 'next/server';
import { checkCredits, deductCredits } from '@/lib/credits';
import { createGithubRepo } from '@/lib/github';
import { deployToVercel } from '@/lib/deploy/vercel';
import { createNeonDatabase } from '@/lib/neon';

export async function POST(req: Request) {
  try {
    const { projectName, platform, withDatabase } = await req.json();

    if (!projectName || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const actionType = platform === 'vercel' ? 'deploy_vercel' : 'deploy_netlify';
    const check = await checkCredits(actionType);

    if (!check.sufficient) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        cost: check.cost,
        balance: check.balance
      }, { status: 402 });
    }

    // Workflow
    // 1. Create GitHub repo
    const repo = await createGithubRepo(projectName);
    
    let db = null;
    // 2. Create Database if requested
    if (withDatabase) {
        db = await createNeonDatabase(projectName);
    }

    // 3. Deploy to platform
    // For Vercel, we need to pass the repo full name
    const deploy = await deployToVercel(projectName, repo.fullName);

    // 4. Deduct credits
    await deductCredits(actionType);

    return NextResponse.json({ 
      success: true,
      repo: repo.htmlUrl,
      deploy: deploy.url,
      db: db ? 'Provisioned' : 'None',
      cost: check.cost
    });

  } catch (error: any) {
    console.error('Deployment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
