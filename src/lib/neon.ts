const NEON_API_URL = 'https://console.neon.tech/api/v2';

interface NeonProject {
  id: string;
  name: string;
  region_id: string;
  created_at: string;
}

interface NeonConnectionInfo {
  connection_string: string;
  host: string;
  database: string;
  user: string;
  password: string;
  project_id: string;
}

export async function createNeonProject(name: string): Promise<NeonProject> {
  const response = await fetch(`${NEON_API_URL}/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEON_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project: {
        name,
        region_id: 'aws-us-east-2',
        pg_version: 16,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Neon project: ${error}`);
  }

  const data = await response.json();
  return data.project;
}

export async function getNeonConnectionInfo(projectId: string): Promise<NeonConnectionInfo> {
  const response = await fetch(`${NEON_API_URL}/projects/${projectId}/connection_uri`, {
    headers: {
      Authorization: `Bearer ${process.env.NEON_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get connection info: ${error}`);
  }

  const data = await response.json();

  return {
    connection_string: data.uri,
    host: data.host || '',
    database: data.database || 'neondb',
    user: data.user || '',
    password: data.password || '',
    project_id: projectId,
  };
}

export async function createNeonDatabase(
  projectName: string
): Promise<NeonConnectionInfo> {
  // Create a new Neon project (each project gets a free database)
  const project = await createNeonProject(projectName);

  // Get connection info
  const connectionInfo = await getNeonConnectionInfo(project.id);

  return connectionInfo;
}

export async function listNeonProjects(): Promise<NeonProject[]> {
  const response = await fetch(`${NEON_API_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${process.env.NEON_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to list Neon projects');
  }

  const data = await response.json();
  return data.projects || [];
}

export async function deleteNeonProject(projectId: string): Promise<void> {
  const response = await fetch(`${NEON_API_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.NEON_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete Neon project');
  }
}
