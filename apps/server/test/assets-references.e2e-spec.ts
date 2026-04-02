import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Assets and references integration (e2e)', () => {
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

  it('returns paged assets and supports image upload / delete using web sdk paths', async () => {
    const token = await loginAndGetAccessToken(app);

    const assets = await request(app.getHttpServer())
      .get('/api/assets/images?page=1&pageSize=20')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(assets.body.data).toEqual({
      items: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      pageSize: 20,
    });

    const uploaded = await request(app.getHttpServer())
      .post('/api/assets/images')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'reference-image.png',
        url: 'https://example.com/reference-image.png',
        size: 1024,
      })
      .expect(200);

    expect(uploaded.body.data).toEqual({
      id: expect.any(String),
      name: 'reference-image.png',
      url: 'https://example.com/reference-image.png',
      size: 1024,
      createdAt: expect.any(String),
    });

    await request(app.getHttpServer())
      .delete(`/api/assets/images/${uploaded.body.data.id as string}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('returns paged references and supports analyze / delete using web sdk paths', async () => {
    const token = await loginAndGetAccessToken(app);

    const references = await request(app.getHttpServer())
      .get('/api/references?page=1&pageSize=20')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(references.body.data).toEqual({
      items: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      pageSize: 20,
    });

    const analyzed = await request(app.getHttpServer())
      .post('/api/references/analyze')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'reference-video.mp4',
        url: 'https://example.com/reference-video.mp4',
        durationSeconds: 60,
      })
      .expect(200);

    expect(analyzed.body.data).toEqual({
      id: expect.any(String),
      title: 'reference-video.mp4',
      status: expect.any(String),
      theme: expect.any(String),
      structureSummary: expect.any(String),
      scriptSummary: expect.any(String),
      storyboardSummary: expect.any(String),
      applicableScenes: expect.any(Array),
      createdAt: expect.any(String),
    });

    await request(app.getHttpServer())
      .delete(`/api/references/${analyzed.body.data.id as string}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

async function loginAndGetAccessToken(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ phone: '13800138000', code: '123456' })
    .expect(200);

  return response.body.data.token as string;
}
