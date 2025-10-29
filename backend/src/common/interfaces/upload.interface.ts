export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface IUploadService {
  uploadImage(file: any): Promise<UploadResult>;
  deleteImage(filename: string): Promise<void>;
  getImageUrl(filename: string): string;
  extractFilenameFromUrl(url: string): string;
}
