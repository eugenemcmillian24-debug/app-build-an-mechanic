const GITHUB_API_URL = 'https://api.github.com';

interface GitHubRepoOptions {
  name: string;
  description?: string;
  isPrivate?: boolean;
  autoInit?: boolean;
}

interface GitHubRepo {
  id: number;
  full_name: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  default_branch: string;
}

export async function createGitHubRepo(
  token: string,
  options: GitHubRepoOptions
): Promise<GitHubRepo> {
  const { name, description = '', isPrivate = false, autoInit = true } = options;

  const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: autoInit,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create GitHub repo: ${error}`);
  }

  return response.json();
}

export async function pushToGitHub(
  token: string,
  owner: string,
  repo: string,
  files: Array<{ path: string; content: string }>,
  message: string = 'Auto-commit from OPS AI DEV'
): Promise<{ success: boolean; sha: string }> {
  // Get the latest commit SHA
  const refRes = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/git/ref/heads/main`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!refRes.ok) {
    throw new Error('Failed to get repo ref');
  }

  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // Get the tree SHA
  const commitRes = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // Create blobs for each file
  const treeItems = await Promise.all(
    files.map(async (file) => {
      const blobRes = await fetch(
        `${GITHUB_API_URL}/repos/${owner}/${repo}/git/blobs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: file.content,
            encoding: 'utf-8',
          }),
        }
      );

      const blobData = await blobRes.json();
      return {
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blobData.sha,
      };
    })
  );

  // Create tree
  const treeRes = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/git/trees`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems,
      }),
    }
  );

  const treeData = await treeRes.json();

  // Create commit
  const newCommitRes = await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/git/commits`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    }
  );

  const newCommitData = await newCommitRes.json();

  // Update reference
  await fetch(
    `${GITHUB_API_URL}/repos/${owner}/${repo}/git/refs/heads/main`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sha: newCommitData.sha,
      }),
    }
  );

  return { success: true, sha: newCommitData.sha };
}

export async function getGitHubUser(token: string) {
  const response = await fetch(`${GITHUB_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return response.json();
}
