import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Dashboard and billing integration (e2e)', () => {
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

  it('returns dashboard summary used by the web dashboard page', async () => {
    const token = await loginAndGetAccessToken(app);
    const response = await request(app.getHttpServer())
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data).toEqual({
      summary: {
        pointBalance: expect.any(Number),
        recentProjectCount: expect.any(Number),
        recentVideoCount: expect.any(Number),
      },
      recentProjects: expect.any(Array),
      recentVideos: expect.any(Array),
    });
  });

  it('returns billing summary and paged billing lists used by account pages', async () => {
    const token = await loginAndGetAccessToken(app);

    const summary = await request(app.getHttpServer())
      .get('/api/billing/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(summary.body.data).toEqual({
      balance: expect.any(Number),
      totalRecharged: expect.any(Number),
      totalConsumed: expect.any(Number),
      totalRefunded: expect.any(Number),
    });

    const packages = await request(app.getHttpServer())
      .get('/api/billing/packages')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(packages.body.data).toEqual(expect.any(Array));

    const pointRecords = await request(app.getHttpServer())
      .get('/api/billing/records?page=1&pageSize=20')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(pointRecords.body.data).toEqual({
      items: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      pageSize: 20,
    });

    const rechargeRecords = await request(app.getHttpServer())
      .get('/api/billing/recharges?page=1&pageSize=20')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(rechargeRecords.body.data).toEqual({
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
