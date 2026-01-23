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
