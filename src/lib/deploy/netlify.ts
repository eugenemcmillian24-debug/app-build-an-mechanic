const NETLIFY_API_URL = 'https://api.netlify.com/api/v1';

interface NetlifyDeployOptions {
  siteName: string;
  files: Record<string, string>;
  envVars?: Record<string, string>;
}

interface NetlifyDeployResult {
  success: boolean;
  url: string;
  deployId: string;
  siteId: string;
  status: string;
  error?: string;
}

export async function createNetlifySite(name: string) {
  const response = await fetch(`${NETLIFY_API_URL}/sites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      custom_domain: null,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Netlify site: ${error}`);
  }

  return response.json();
}

export async function deployToNetlify(options: NetlifyDeployOptions): Promise<NetlifyDeployResult> {
  const { siteName, files, envVars } = options;

  try {
    // Create site first
    let site;
    try {
      site = await createNetlifySite(siteName);
    } catch {
      // Site may already exist - try to get it
      const sitesRes = await fetch(`${NETLIFY_API_URL}/sites?name=${siteName}`, {
        headers: { Authorization: `Bearer ${process.env.NETLIFY_TOKEN}` },
      });
      const sites = await sitesRes.json();
      site = Array.isArray(sites) ? sites[0] : null;
      if (!site) {
        return {
          success: false,
          url: '',
          deployId: '',
          siteId: '',
          status: 'failed',
          error: 'Could not create or find Netlify site',
        };
      }
    }

    // Create a deploy with file digest
    const fileHashes: Record<string, string> = {};
    for (const [path, content] of Object.entries(files)) {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      fileHashes[`/${path}`] = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    const deployRes = await fetch(`${NETLIFY_API_URL}/sites/${site.id}/deploys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: fileHashes,
      }),
    });

    if (!deployRes.ok) {
      const error = await deployRes.text();
      return {
        success: false,
        url: '',
        deployId: '',
        siteId: site.id,
        status: 'failed',
        error: `Netlify deploy failed: ${error}`,
      };
    }

    const deploy = await deployRes.json();

    // Upload required files
    for (const filePath of deploy.required || []) {
      const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const content = files[normalizedPath];
      if (content) {
        await fetch(`${NETLIFY_API_URL}/deploys/${deploy.id}/files${filePath}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
            'Content-Type': 'application/octet-stream',
          },
          body: content,
        });
      }
    }

    // Set env vars
    if (envVars && Object.keys(envVars).length > 0) {
      await setNetlifyEnvVars(site.id, envVars);
    }

    return {
      success: true,
      url: `https://${site.subdomain || siteName}.netlify.app`,
      deployId: deploy.id,
      siteId: site.id,
      status: deploy.state || 'uploading',
    };
  } catch (error) {
    return {
      success: false,
      url: '',
      deployId: '',
      siteId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function setNetlifyEnvVars(siteId: string, envVars: Record<string, string>) {
  for (const [key, value] of Object.entries(envVars)) {
    await fetch(`${NETLIFY_API_URL}/accounts/me/env/${key}?site_id=${siteId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: 'all',
        value,
      }),
    });
  }
}

export async function getNetlifyDeployStatus(deployId: string) {
  const response = await fetch(`${NETLIFY_API_URL}/deploys/${deployId}`, {
    headers: { Authorization: `Bearer ${process.env.NETLIFY_TOKEN}` },
  });
  return response.json();
}
