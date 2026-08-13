export const scanImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/inspect', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Scan failed: ${response.statusText}`);
  }

  return response.json();
};