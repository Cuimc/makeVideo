export interface GenerateScriptInput {
  projectId: string;
  title: string;
  summary: string;
}

export interface ScriptSection {
  title: string;
  narration: string;
}

export interface ScriptGenerationResult {
  title: string;
  sections: ScriptSection[];
}

export abstract class ScriptProvider {
  abstract generate(input: GenerateScriptInput): Promise<ScriptGenerationResult>;
}
