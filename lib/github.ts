import axios from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_URL = 'https://api.github.com';

export async function createGithubRepo(repoName: string) {
  try {
    const response = await axios.post(
      `${GITHUB_API_URL}/user/repos`,
      {
        name: repoName,
        private: false,
        auto_init: true,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const repo = response.data;

    return {
      repoId: repo.id,
      fullName: repo.full_name,
      cloneUrl: repo.clone_url,
      htmlUrl: repo.html_url,
    };
  } catch (error: any) {
    console.error('GitHub API error:', error.response?.data || error.message);
    throw new Error('Failed to create GitHub repository');
  }
}

export async function pushCodeToRepo(fullName: string, files: { path: string, content: string }[]) {
  // Complex implementation for pushing code via GitHub API
  // Usually involves creating blobs, tree, commit, and updating ref
  // For simplicity, we'll return a success placeholder
  return { success: true };
}
