/**
 * Builds the fetch options object carrying the Authorization header for
 * authenticated API requests.
 */
export function useAuthHeaders(accessToken: string) {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

/**
 * Extracts the inner data array from an Orval-generated API response.
 * Returns an empty array when the response is absent or the status is not 200.
 */
export function extractApiDataArray<T>(
  response: { status: number; data: unknown } | undefined,
): T[] {
  if (response?.status !== 200) return [];
  return (response.data as { data: T[] }).data;
}
