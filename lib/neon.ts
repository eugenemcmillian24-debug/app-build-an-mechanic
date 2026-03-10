import axios from 'axios';

const NEON_API_KEY = process.env.NEON_API_KEY;
const NEON_API_URL = 'https://console.neon.tech/api/v2';

export async function createNeonDatabase(projectName: string) {
  try {
    const response = await axios.post(
      `${NEON_API_URL}/projects`,
      {
        project: {
          name: projectName,
          region_id: 'aws-us-east-1',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NEON_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const project = response.data.project;
    const connectionString = `postgres://${project.database.owner_name}:${project.database.password}@${project.host}/${project.database.name}`;

    return {
      projectId: project.id,
      connectionString,
      host: project.host,
      database: project.database.name,
      user: project.database.owner_name,
      password: project.database.password,
    };
  } catch (error: any) {
    console.error('Neon API error:', error.response?.data || error.message);
    throw new Error('Failed to create Neon database');
  }
}
