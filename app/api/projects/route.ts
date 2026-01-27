import { getAuthToken, API_BASE_URL, API_ENDPOINTS } from '@/libs/api-client';

export async function GET() {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.projects}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const token = getAuthToken();
  const body = await request.json();

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.projects}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    return Response.json(
      { error: error || 'Failed to create project' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data, { status: 201 });
}
