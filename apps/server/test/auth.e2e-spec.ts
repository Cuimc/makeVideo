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

  it('logs in by sms code and fetches current user profile', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/send-code')
      .send({ phone: '13800138000' })
      .expect(200);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login-by-sms')
      .send({ phone: '13800138000', code: '123456' })
      .expect(200);

    expect(loginResponse.body.data.token).toEqual(expect.any(String));
    expect(loginResponse.body.data.accessToken).toBe(
      loginResponse.body.data.token,
    );

    const token = loginResponse.body.data.token as string;
    const profileResponse = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.data.phone).toBe('13800138000');
    expect(profileResponse.body.data.nickname).toBe('Demo User');
  });

  it('supports sdk-compatible auth endpoints', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/send-code')
      .send({ phone: '13800138000' })
      .expect(200);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ phone: '13800138000', code: '123456' })
      .expect(200);

    const token = loginResponse.body.data.token as string;
    const profileResponse = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.data.maskedPhone).toBe('138****8000');
  });

  it('supports dev login without sending code first', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ phone: '13800138000', code: '123456' })
      .expect(200);

    expect(loginResponse.body.data.token).toEqual(expect.any(String));
    expect(loginResponse.body.data.profile.phone).toBe('13800138000');
  });
});
