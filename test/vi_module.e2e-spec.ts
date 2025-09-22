import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ViModuleModule } from '../src/vi_module/vi_module.module';

describe('VI_module Controller (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ViModuleModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const CREATE_URL = '/vi-module'

  it('/should create and return a status code of 201', () => {

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
});
