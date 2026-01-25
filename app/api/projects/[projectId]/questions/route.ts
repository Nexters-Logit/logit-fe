import { getAuthToken, API_BASE_URL, API_ENDPOINTS } from '@/libs/api-client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.questions(projectId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: 'Failed to fetch questions' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return Response.json(data);
}
