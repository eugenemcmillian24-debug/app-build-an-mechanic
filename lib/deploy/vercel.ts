import axios from 'axios';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_API_URL = 'https://api.vercel.com';

export async function deployToVercel(projectName: string, githubRepoId: string) {
  try {
    const response = await axios.post(
      `${VERCEL_API_URL}/v9/projects`,
      {
        name: projectName,
        framework: 'nextjs',
        gitRepository: {
          type: 'github',
          repo: githubRepoId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const project = response.data;
    
    // Trigger first deployment
    const deployResponse = await axios.post(
      `${VERCEL_API_URL}/v13/deployments`,
      {
        name: projectName,
        project: project.id,
        gitSource: {
          type: 'github',
          repoId: githubRepoId,
          ref: 'main',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      projectId: project.id,
      deploymentId: deployResponse.data.id,
      url: deployResponse.data.url,
    };
  } catch (error: any) {
    console.error('Vercel API error:', error.response?.data || error.message);
    throw new Error('Failed to deploy to Vercel');
  }
}
