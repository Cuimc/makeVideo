import { Injectable } from '@nestjs/common';
import {
  ScriptProvider,
  type GenerateScriptInput,
  type ScriptGenerationResult,
} from './script.provider';

@Injectable()
export class MockScriptProvider extends ScriptProvider {
  async generate(input: GenerateScriptInput): Promise<ScriptGenerationResult> {
    return {
      title: `${input.title} Script`,
      sections: [
        {
          title: 'Opening',
          narration: `${input.summary} This is the opening narration.`,
        },
        {
          title: 'Takeaway',
          narration: `Project ${input.projectId} focuses on the main takeaway.`,
        },
      ],
    };
  }
}
