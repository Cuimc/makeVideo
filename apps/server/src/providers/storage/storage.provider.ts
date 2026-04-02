export interface UploadFileInput {
  fileName: string;
  mimeType: string;
  content: string | Uint8Array;
}

export interface UploadFileResult {
  storageKey: string;
  url: string;
}

export abstract class StorageProvider {
  abstract upload(input: UploadFileInput): Promise<UploadFileResult>;
}
