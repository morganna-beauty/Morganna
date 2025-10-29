export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append('file', file);

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/image`;

  console.log('Upload URL:', apiUrl);
  console.log('FormData file:', file);

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers));

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Error response:', errorText);

    let errorData;

    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    throw new Error(errorData.message || `HTTP ${response.status}: Failed to upload image`);
  }

  const result = await response.json();

  console.log('Success response:', result);

  return result;
};

export const replaceImage = async (file: File, previousUrl?: string): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append('file', file);

  if (previousUrl) {
    formData.append('previousUrl', previousUrl);
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/image/replace`;

  console.log('Replace URL:', apiUrl);
  console.log('FormData file:', file);
  console.log('Previous URL:', previousUrl);

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers));

  if (!response.ok) {
    const errorText = await response.text();

    console.error('Error response:', errorText);

    let errorData;

    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    throw new Error(errorData.message || `HTTP ${response.status}: Failed to replace image`);
  }

  const result = await response.json();

  console.log('Success response:', result);

  return result;
};
