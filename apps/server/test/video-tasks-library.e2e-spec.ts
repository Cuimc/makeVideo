import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Video tasks and library integration (e2e)', () => {
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

  it('returns task center payloads using the web-facing routes', async () => {
    const token = await loginAndGetAccessToken(app);

    const tasks = await request(app.getHttpServer())
      .get('/api/video-tasks?page=1&pageSize=20')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(tasks.body.data).toEqual({
      items: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      pageSize: 20,
    });
  });

  it('creates and retries a video task using the web-facing routes', async () => {
    const token = await loginAndGetAccessToken(app);

    const created = await request(app.getHttpServer())
      .post('/api/video-tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        projectId: 'project_1',
        count: 1,
        aspectRatio: '9:16',
        durationSeconds: 60,
        styleBias: '专业理性',
        withSubtitle: true,
      })
      .expect(200);

    expect(created.body.data).toEqual({
      id: expect.any(String),
      projectId: expect.any(String),
      projectName: expect.any(String),
      status: expect.any(String),
      progressText: expect.any(String),
      pointCost: expect.any(Number),
      refundPoints: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      resultVideoIds: expect.any(Array),
    });

    const retried = await request(app.getHttpServer())
      .post(`/api/video-tasks/${created.body.data.id as string}/retry`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(retried.body.data.id).toBe(created.body.data.id);
  });

  it('returns library payloads using the web-facing routes', async () => {
    const token = await loginAndGetAccessToken(app);

    const videos = await request(app.getHttpServer())
      .get('/api/library/videos?page=1&pageSize=20')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(videos.body.data).toEqual({
      items: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      pageSize: 20,
    });
  });
});

async function loginAndGetAccessToken(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ phone: '13800138000', code: '123456' })
    .expect(200);

  return response.body.data.token as string;
}
