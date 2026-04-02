import { Injectable } from '@nestjs/common';
import { ScriptsService } from '../modules/scripts/scripts.service';

@Injectable()
export class ScriptGenerateProcessor {
  constructor(private readonly scriptsService: ScriptsService) {}

  process(job: { projectId: string; userId: string }) {
    return this.scriptsService.generate(job.projectId, job.userId);
  }
}
