export interface AnalyzeReferenceInput {
  referenceVideoId: string;
  url: string;
}

export interface ReferenceAnalysisResult {
  summary: string;
  tags: string[];
}

export abstract class ReferenceProvider {
  abstract analyze(
    input: AnalyzeReferenceInput,
  ): Promise<ReferenceAnalysisResult>;
}
