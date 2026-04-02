import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

describe('Auth module (e2e)', () => {
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

  it('wraps unauthorized response with unified envelope', async () => {
    const response = await request(app.getHttpServer()).get('/api/users/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: 401,
      message: 'Unauthorized',
      data: null,
    });
  });
});
