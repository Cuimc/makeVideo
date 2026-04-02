import { Injectable } from '@nestjs/common';
import {
  ReferenceProvider,
  type AnalyzeReferenceInput,
  type ReferenceAnalysisResult,
} from './reference.provider';

@Injectable()
export class MockReferenceProvider extends ReferenceProvider {
  async analyze(
    input: AnalyzeReferenceInput,
  ): Promise<ReferenceAnalysisResult> {
    return {
      summary: `Mock analysis for ${input.referenceVideoId} from ${input.url}.`,
      tags: ['fast', 'caption-heavy', 'news-style'],
    };
  }
}
