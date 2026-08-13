export const scanImageApi = async (file: File, provider: string) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('provider', provider);

  const response = await fetch('/api/inspect', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    // Attempt to read the custom error message from the backend JSON
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Scan failed: ${response.statusText}`);
  }

  return response.json();
};