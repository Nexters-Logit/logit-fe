import { getAuthToken, API_BASE_URL, API_ENDPOINTS } from '@/libs/api-client';

export async function GET() {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.experiences}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    return Response.json(
      { error: error || 'Failed to fetch experiences' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const token = getAuthToken();
  const body = await request.json();

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.experiences}`, {
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
      { error: error || 'Failed to create experience' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data, { status: 201 });
}
