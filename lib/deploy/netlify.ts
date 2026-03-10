import axios from 'axios';

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
const NETLIFY_API_URL = 'https://api.netlify.com/api/v1';

export async function deployToNetlify(projectName: string, githubRepoId: string) {
  try {
    const response = await axios.post(
      `${NETLIFY_API_URL}/sites`,
      {
        name: projectName,
        repo: {
          provider: 'github',
          id: githubRepoId,
          repo_branch: 'main',
          cmd: 'npm run build',
          dir: '.next',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const site = response.data;

    return {
      siteId: site.id,
      url: site.ssl_url || site.url,
      adminUrl: site.admin_url,
    };
  } catch (error: any) {
    console.error('Netlify API error:', error.response?.data || error.message);
    throw new Error('Failed to deploy to Netlify');
  }
}
