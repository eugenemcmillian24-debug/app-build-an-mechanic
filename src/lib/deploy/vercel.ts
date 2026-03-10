const VERCEL_API_URL = 'https://api.vercel.com';

interface VercelDeployOptions {
  projectName: string;
  files: Array<{ file: string; data: string }>;
  framework?: string;
  envVars?: Record<string, string>;
}

interface VercelDeployResult {
  success: boolean;
  url: string;
  deploymentId: string;
  status: string;
  error?: string;
}

export async function createVercelProject(name: string, framework: string = 'nextjs') {
  const response = await fetch(`${VERCEL_API_URL}/v10/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      framework,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Vercel project: ${error}`);
  }

  return response.json();
}

export async function deployToVercel(options: VercelDeployOptions): Promise<VercelDeployResult> {
  const { projectName, files, framework = 'nextjs', envVars } = options;

  try {
    // Create deployment
    const response = await fetch(`${VERCEL_API_URL}/v13/deployments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName,
        files: files.map((f) => ({
          file: f.file,
          data: Buffer.from(f.data).toString('base64'),
          encoding: 'base64',
        })),
        projectSettings: {
          framework,
        },
        target: 'production',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        url: '',
        deploymentId: '',
        status: 'failed',
        error: `Vercel deployment failed: ${error}`,
      };
    }

    const deployment = await response.json();

    // Set environment variables if provided
    if (envVars && Object.keys(envVars).length > 0) {
      await setVercelEnvVars(deployment.projectId || projectName, envVars);
    }

    return {
      success: true,
      url: `https://${deployment.url}`,
      deploymentId: deployment.id,
      status: deployment.readyState || 'QUEUED',
    };
  } catch (error) {
    return {
      success: false,
      url: '',
      deploymentId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function setVercelEnvVars(projectId: string, envVars: Record<string, string>) {
  const envArray = Object.entries(envVars).map(([key, value]) => ({
    key,
    value,
    type: 'encrypted',
    target: ['production', 'preview', 'development'],
  }));

  const response = await fetch(`${VERCEL_API_URL}/v10/projects/${projectId}/env`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(envArray),
  });

  return response.json();
}

export async function getVercelDeploymentStatus(deploymentId: string) {
  const response = await fetch(`${VERCEL_API_URL}/v13/deployments/${deploymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    },
  });

  return response.json();
}
