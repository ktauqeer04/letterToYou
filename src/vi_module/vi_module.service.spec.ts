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
      create: jest.fn() as any,
    }
  }

  const jwtMock = {
    sign: jest.fn() as any
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
            useValue: jwtMock
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

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  })

  describe('create Functionn', () => {

    // three cases 
    // 1. if an email doesn't exist
    // 2. if an email already exists but not verified
    // 3. email doesn't exist


    it('should should create an email and send verification token if email does not exists', async () =>  {

        const examplePayload = {
          email: 'example@example.com',
          content: "This is a test content",
          sendDate: new Date()
        };

        (prismaMock.letter.findUnique).mockResolvedValue(null);

        (jwtMock.sign).mockReturnValue('example-jwt-token');

        const createdLetter = {
          idUuid: 'example-uuid',
          hashedUuid: 'example-hashed-uuid',
          email: examplePayload.email,
          isVerified: false,
        };

        (prismaMock.letter.create).mockResolvedValue(createdLetter);

        await viModuleService.create(examplePayload)

        expect(prismaMock.letter.findUnique).toHaveBeenCalledWith({
          where: { email : examplePayload.email }
        });

        expect(prismaMock.letter.create).toHaveBeenCalledWith({
          data: {
            hashedUuid: expect.any(String),
            email: examplePayload.email,
            content: {
              create: {
                content: examplePayload.content,
                sendDate: examplePayload.sendDate
              }
            }
          }
        });

    })

      it('should send a verification token if an email exists but not verified', async () => {

          const examplePayload = {
            email: 'example@example.com',
            content: "This is a test content",
            sendDate: new Date()
          };
          
          const existingLetter = {
            idUuid: 'existing-example-uuid',
            hashedUuid: 'existing-example-hashedUuid',
            email: 'example@example.com',
            isVerified: false,
            content: []
          };

          (prismaMock.letter.findUnique).mockResolvedValue(existingLetter);

          const insertData = {
            content: examplePayload.content,
            sendDate: examplePayload.sendDate,
            letterId: existingLetter.idUuid
          };

          (prismaMock.content.create).mockResolvedValue(insertData);

          const res = await viModuleService.create(examplePayload);

          expect(prismaMock.letter.findUnique).toHaveBeenCalledWith({
            where: { email : examplePayload.email}
          });

          expect(prismaMock.content.create).toHaveBeenCalledWith({
            data: {
              content: examplePayload.content,
              sendDate: examplePayload.sendDate,
              letterId: existingLetter.idUuid,
            }
          })

      })

    // it('should create the content as email exists and verified', async () => {

    // })

  })

});
