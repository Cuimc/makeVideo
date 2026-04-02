import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Prisma schema', () => {
  const schemaPath = resolve(__dirname, '../../../prisma/schema.prisma');
  const prismaBinaryPath = resolve(process.cwd(), 'node_modules/.bin/prisma');

  it('defines the core mvp models and validates the schema', () => {
    const schema = readFileSync(schemaPath, 'utf8');

    expect(schema).toContain('enum ProjectStatus');
    expect(schema).toContain('enum VideoTaskStatus');
    expect(schema).toContain('model User');
    expect(schema).toContain('model PointAccount');
    expect(schema).toContain('model PointTransaction');
    expect(schema).toContain('model RechargeOrder');
    expect(schema).toContain('model Project');
    expect(schema).toContain('model ProjectNews');
    expect(schema).toContain('model Script');
    expect(schema).toContain('model Storyboard');
    expect(schema).toContain('model Asset');
    expect(schema).toContain('model ReferenceVideo');
    expect(schema).toContain('model ScriptReference');
    expect(schema).toContain('model VideoGenerateTask');
    expect(schema).toContain('model VideoGenerateTaskItem');
    expect(schema).toContain('model Video');
    expect(() => {
      execFileSync(prismaBinaryPath, ['validate', '--schema', schemaPath], {
        cwd: process.cwd(),
        stdio: 'pipe',
        env: {
          ...process.env,
          DATABASE_URL:
            process.env.DATABASE_URL ??
            'mysql://root:password@127.0.0.1:3306/make_video',
        },
      });
    }).not.toThrow();
  });
});
