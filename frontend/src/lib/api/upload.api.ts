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
  const token = localStorage.getItem('morganna_token');

  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();

    let errorData;

    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    throw new Error(errorData.message || `HTTP ${response.status}: Failed to upload image`);
  }

  const result = await response.json();

  return result;
};

export const replaceImage = async (file: File, previousUrl?: string): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append('file', file);

  if (previousUrl) {
    formData.append('previousUrl', previousUrl);
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/image/replace`;
  const token = localStorage.getItem('morganna_token');

  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();

    let errorData;

    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    throw new Error(errorData.message || `HTTP ${response.status}: Failed to replace image`);
  }

  const result = await response.json();

  return result;
};
