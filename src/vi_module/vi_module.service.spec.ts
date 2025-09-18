import { Test, TestingModule } from '@nestjs/testing';
import { ViModuleService } from './vi_module.service';
import { ViModuleController } from './vi_module.controller';
// import { responseSI } from 'src/interfaces/service.interface';
// import { Letter, Prisma } from '@prisma/client';
import { Queue } from 'bullmq';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';


describe('viModuleService', () => {
  let viModuleService: ViModuleService;
  let prismaService: Partial<PrismaService>;
  let queueService: Partial<Queue>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>

  // type createFn = () => Promise<responseSI<Letter>>;

  // const mockViModuleService = {
  //   create: jest.fn() as jest.MockedFunction<createFn>,
  // } 

  const prismaMock = {
    letter: {
      findUnique: jest.fn() as any,
      create: jest.fn() as any,
    },
    content: {
      create: jest.fn() as any
    }
  }

  const queueMock = {
    add: jest.fn() as any
  }

  beforeEach(async () => {

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ViModuleController],
      providers: [ViModuleService,
        {
            provide: PrismaService,
            useValue: prismaMock
        }, 
        {
          provide: 'BullQueue_send-bulk-email', // Provide the mock for the Queue
          useValue: queueMock
        },
        {
            provide: JwtService,
            useValue: {
              sign: jest.fn() as any
            }
        },
        {
          provide: ConfigService,
          useValue:{
            get: jest.fn() as any
          }
        }
      ],
    }).compile();

    viModuleService = app.get<ViModuleService>(ViModuleService);
    // queueService = app.get<Queue>(Queue);
    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

  });

  describe('create Functionn', () => {

    // three cases 
    // 1. if an email doesn't exist
    // 2. if an email already exists but not verified
    // 3. email doesn't exist

    const payload = {
      email : 'example@example.com',
      content: 'This is a test content',
      sendDate: new Date()
    }

    it('should should create an email and send verification token if email does not exists', async () =>  {

        (prismaMock.letter.findUnique).mockResolvedValue(payload.email);

        (jwtService.sign as jest.Mock).mockReturnValue('signedJwtToken');

        const createdLetter = {
          idUuid: 'random-generated-uuid',  
          hashedUuid: 'hashed-token',
          email: 'example@example.com',
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        prismaMock.letter.create.mockResolvedValue(createdLetter);

        // queueMock.add.mockResolvedValue()

        const res = await viModuleService.create(payload);

        expect(prismaMock.letter.findUnique).toHaveBeenCalledWith({
          where: { email: payload.email } 
        });

        expect(res.success).toBe(true);
        // expect(res.message).toBe('Verification email sent. Please verify your email before creating content.');
        // expect(res.data).toEqual(createdLetter);

    })

    // it('should send a verification token if an email exists but not verified', async () => {

    // })

    // it('should create the content as email exists and verified', async () => {

    // })

  })

});
