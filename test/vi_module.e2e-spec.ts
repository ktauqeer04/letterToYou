import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ViModuleModule } from '../src/vi_module/vi_module.module';
import { ValidationExceptionFilter } from 'src/pipes/custom-validation';

describe('VI_module Controller (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ViModuleModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new ValidationExceptionFilter());
    await app.init();
  });

  afterAll( async () => {
    await app.close()
  })

  const CREATE_URL = '/vi-module'

  it('should create and return a status code of 201', async () => {

    const payload = {
        email: 'rediya3561@artvara.com',
        content: 'example content',
        sendDate: '2025-09-10T00:00:00.000Z'
    }

    return request(app.getHttpServer())
      .post(CREATE_URL)
      .send(payload)
      .expect(201)
      .expect(( { body } ) => {
        expect(body.success).toBe(true),
        expect(body.message).toBe('Letter created successfully')
      });

  });


  it('should throw an error for email constraint',   () => {

    const payload = {
      email: "tauqeer",
      content: "Hello from kratos",
      sendDate: false
    }

    return request(app.getHttpServer())
      .post(CREATE_URL)
      .send(payload)
      .expect(400)
      .expect(({ body }) => {
        expect(body.success).toBe(false)
        expect(body.message).toBe('Invalid inputs')
    });

  })

  it('should throw an error for content constraint',   () => {

    const payload = {
      email: "tauqeer@example.com",
      content: 4,
      sendDate: false
    }

    return request(app.getHttpServer())
      .post(CREATE_URL)
      .send(payload)
      .expect(400)
      .expect(({ body }) => {
        expect(body.success).toBe(false)
        expect(body.message).toBe('Invalid inputs')
        expect(body.error.message).toBe('content must be a string')
    });

  })

  it('should throw an error for date constraint',   () => {

    const payload = {
      email: "tauqeer@example.com",
      content: "Hello from kratos",
      sendDate: false
    }

    return request(app.getHttpServer())
      .post(CREATE_URL)
      .send(payload)
      .expect(400)
      .expect(({ body }) => {
        expect(body.success).toBe(false)
        expect(body.error.message).toBe('sendDate is invalid')
    });

  })

  

});
