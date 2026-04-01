export interface ReferenceImage {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface ImageUploadPayload {
  name: string;
  url: string;
  size: number;
}

export interface LibraryVideo {
  id: string;
  projectId: string;
  title: string;
  coverUrl: string;
  previewUrl?: string;
  downloadUrl?: string;
  createdAt: string;
  durationSeconds?: number;
}
