import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Projects flow (e2e)', () => {
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

  it('searches news, creates project and fetches detail', async () => {
    const token = await loginAndGetToken(app);
    const newsResponse = await request(app.getHttpServer())
      .get('/api/news')
      .query({ keyword: 'AI' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(newsResponse.body.data).toHaveLength(3);

    const createResponse = await request(app.getHttpServer())
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        keyword: 'AI',
        newsIds: [newsResponse.body.data[0].id],
      })
      .expect(200);

    expect(createResponse.body.data.status).toBe('created');

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/projects/${createResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(detailResponse.body.data.keyword).toBe('AI');
    expect(detailResponse.body.data.newsItems).toHaveLength(1);
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
