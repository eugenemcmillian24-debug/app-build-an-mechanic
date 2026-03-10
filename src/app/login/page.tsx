'use client';

import { Github, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        scopes: 'repo read:user user:email',
      },
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-violet-500" />
            <span className="font-bold text-2xl text-white tracking-tight">
              OPS AI <span className="text-violet-400">DEV</span>
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Welcome back</h1>
          <p className="text-sm text-zinc-400">
            Sign in to start building with AI agents
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <button
            onClick={handleGitHubLogin}
            className="flex items-center justify-center gap-3 w-full bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl py-3 px-4 text-sm font-semibold transition-colors"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </button>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              <span>Auto-create repos &amp; deploy to Vercel/Netlify</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Access to 50+ AI models via Groq &amp; OpenRouter</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Credit-based billing - pay only for what you use</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
