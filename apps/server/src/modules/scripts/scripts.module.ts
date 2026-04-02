import { Module } from '@nestjs/common';
import { MockScriptProvider } from '../../providers/ai/mock-script.provider';
import { ScriptProvider } from '../../providers/ai/script.provider';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { ScriptsController } from './scripts.controller';
import { ScriptsService } from './scripts.service';

@Module({
  imports: [AuthModule, ProjectsModule],
  controllers: [ScriptsController],
  providers: [
    ScriptsService,
    MockScriptProvider,
    {
      provide: ScriptProvider,
      useExisting: MockScriptProvider,
    },
  ],
})
export class ScriptsModule {}
