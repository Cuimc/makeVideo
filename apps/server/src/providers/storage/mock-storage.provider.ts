import { Injectable } from '@nestjs/common';
import {
  StorageProvider,
  type UploadFileInput,
  type UploadFileResult,
} from './storage.provider';

@Injectable()
export class MockStorageProvider extends StorageProvider {
  async upload(input: UploadFileInput): Promise<UploadFileResult> {
    const storageKey = `mock-storage/${Date.now()}-${input.fileName}`;

    return {
      storageKey,
      url: `https://example.com/${storageKey}`,
    };
  }
}
