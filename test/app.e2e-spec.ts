import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface AuthResponseBody {
  user: {
    id: string;
    email: string;
    fullName: string;
    rol: string[];
  };
  token: string;
}

describe('Teslo Shop (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const testUser = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Test1234',
    };

    it('should register and login a user', async () => {
      // Register
      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      const registerBody = registerRes.body as AuthResponseBody;
      expect(registerBody.user).toBeDefined();
      expect(registerBody.token).toBeDefined();
      expect(registerBody.user.email).toBe(testUser.email);
      expect(registerBody.user.fullName).toBe(testUser.fullName);

      // Login with same credentials
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(202);

      const loginBody = loginRes.body as AuthResponseBody;
      expect(loginBody.user).toBeDefined();
      expect(loginBody.token).toBeDefined();
      expect(loginBody.user.email).toBe(testUser.email);
    });
  });
});
