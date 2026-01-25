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
