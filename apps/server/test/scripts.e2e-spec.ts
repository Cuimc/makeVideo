import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Scripts and storyboards flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('generates script and storyboard for a project', async () => {
    const token = await loginAndGetToken(app);
    const newsResponse = await request(app.getHttpServer())
      .get('/api/news')
      .query({ keyword: 'AI' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const createResponse = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        keyword: 'AI',
        newsIds: [newsResponse.body.data[0].id],
      })
      .expect(200);

    const projectId = createResponse.body.data.id as string;
    const scriptResponse = await request(app.getHttpServer())
      .post(`/api/projects/${projectId}/script/generate`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(scriptResponse.body.data.script).toContain('Opening');

    const storyboardResponse = await request(app.getHttpServer())
      .post(`/api/projects/${projectId}/storyboard/generate`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(storyboardResponse.body.data.storyboard).not.toHaveLength(0);

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(detailResponse.body.data.status).toBe('script_pending_confirm');
    expect(detailResponse.body.data.scriptDraft).toContain('Opening');
    expect(detailResponse.body.data.storyboardDraft).not.toHaveLength(0);
  });
});

async function loginAndGetToken(app: INestApplication) {
  await request(app.getHttpServer())
    .post('/api/auth/send-code')
    .send({ phone: '13800138000' })
    .expect(200);

  const response = await request(app.getHttpServer())
    .post('/api/auth/login-by-sms')
    .send({ phone: '13800138000', code: '123456' })
    .expect(200);

  return response.body.data.token as string;
}
