import type { ScriptGenerationResult } from '@make-video/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ScriptProvider } from '../../providers/ai/script.provider';
import { ProjectsService } from '../projects/projects.service';

const SCRIPT_POINT_COST = 100;

@Injectable()
export class ScriptsService {
  constructor(
    private readonly projectsService: ProjectsService,
    @Inject(ScriptProvider)
    private readonly scriptProvider: ScriptProvider,
  ) {}

  async generate(projectId: string, userId: string): Promise<ScriptGenerationResult> {
    const input = this.projectsService.getScriptGenerationInput(projectId, userId);
    const result = await this.scriptProvider.generate(input);
    const script = result.sections
      .map((section) => `${section.title}: ${section.narration}`)
      .join('\n');
    const payload: ScriptGenerationResult = {
      script,
      estimatedPointCost: SCRIPT_POINT_COST,
    };

    this.projectsService.setScriptDraft(userId, projectId, payload);

    return payload;
  }
}
