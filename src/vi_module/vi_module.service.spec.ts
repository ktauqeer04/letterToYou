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

        const tempUrl = `http://localhost:300/email-verify?token=${createdLetter.hashedUuid}`;

        (queueMock.add).mockResolvedValue('verification-email', {
          to: examplePayload.email,
          url: tempUrl,
          idUuid: createdLetter.idUuid
        }, {
          delay: 5000
        })


        // ---------------------------------------------

        const response = await viModuleService.create(examplePayload)

        // ---------------------------------------------

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

        // console.log(queueMock.add.mock.calls);

        expect(queueMock.add).toHaveBeenCalledTimes(1);

        const queueArgs = queueMock.add.mock.calls[0];

        expect(queueArgs[0]).toBe('verification-email');
        expect(queueArgs[1].to).toBe(examplePayload.email);
        expect(queueArgs[1].url).toContain('/email-verify?token=');
        expect(queueArgs[1].idUuid).toBe(createdLetter.idUuid);
        expect(queueArgs[2]).toEqual({
          delay: 5000,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
        });


        expect(response.success).toBe(true);
        expect(response.message).toBe('Letter created and verification email queued');
        expect(response.data).toEqual(createdLetter);
        

    })

      it('should send a verification token if an email exists but not verified', async () => {

          const examplePayload = {
            email: 'example@example.com',
            content: "This is a test content",
            sendDate: new Date()
          };
          
          // const existingLetter = {
          //   idUuid: 'existing-example-uuid',
          //   hashedUuid: 'existing-example-hashedUuid',
          //   email: 'example@example.com',
          //   isVerified: false,
          //   content: []
          // };

          (prismaMock.letter.findUnique).mockResolvedValue({
            isVerified: false,
            idUuid: 'existing-example-uuid',
            hashedUuid: 'existing-example-hashedUuid',
            email: examplePayload.email,
          });

          const insertData = {
            content: examplePayload.content,
            sendDate: examplePayload.sendDate,
            letterId: 'existing-example-uuid',
          };

          (prismaMock.content.create).mockResolvedValue(insertData);

          const tempUrl = `http://localhost:300/email-verify?token=${'existing-example-hashedUuid'}`;

          (queueMock.add).mockResolvedValue('verification-email', 
          {
            to: examplePayload.email,
            url: tempUrl,
            idUuid: 'existing-example-uuid'
          }, {
            delay: 5000, 
            attemps: 3, 
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
          });

          // ---------------------------------------------

          const response = await viModuleService.create(examplePayload);


          // ---------------------------------------------

          expect(prismaMock.letter.findUnique).toHaveBeenCalledWith({
            where: { email : examplePayload.email}
          });

          expect(prismaMock.content.create).toHaveBeenCalledWith({
            data: {
              content: examplePayload.content,
              sendDate: examplePayload.sendDate,
              letterId: 'existing-example-uuid',
            }
          });


          const queueArgs = queueMock.add.mock.calls[0];

          expect(queueArgs[0]).toBe('verification-email');
          expect(queueArgs[1].to).toBe(examplePayload.email);
          expect(queueArgs[1].url).toContain('/email-verify?token=');
          expect(queueArgs[1].idUuid).toBe('existing-example-uuid');
          expect(queueArgs[2]).toEqual({
            delay: 5000,
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
          });


          expect(response.success).toBe(true);          
          expect(response.message).toBe('Letter content added and verification email re-queued');
          expect(response.data).toEqual({
            isVerified: false,
            idUuid: 'existing-example-uuid',
            hashedUuid: 'existing-example-hashedUuid',
            email: examplePayload.email,  
          });


      });

    it('should create the content as email exists and verified', async () => {

      const examplePayload = {
        email: 'example@example.com',
        content: "This is a test content",
        sendDate: new Date()
      };

      const findExistingEmail = {
        isVerified: true,
        idUuid: 'existing-example-uuid',
        hashedUuid: 'existing-example-hashedUuid',
        email: examplePayload.email,
      };

      (prismaMock.letter.findUnique).mockResolvedValue(findExistingEmail);

      const contentData = {
        content: examplePayload.content,
        sendDate: examplePayload.sendDate,
        letterId: findExistingEmail.idUuid
      };

      (prismaMock.content.create).mockResolvedValue(contentData);

      // ----------------------------------------------------

      const response = await viModuleService.create(examplePayload);

      // ----------------------------------------------------

      expect(prismaMock.letter.findUnique).toHaveBeenCalledWith({
        where: { email : examplePayload.email} 
      });

      expect(prismaMock.content.create).toHaveBeenCalledWith({
        data: {
          content: examplePayload.content,
          sendDate: examplePayload.sendDate,
          letterId: findExistingEmail.idUuid
        }
      });

      expect(response.success).toBe(true);
      expect(response.message).toBe('Letter content added');
      expect(response.data).toEqual(findExistingEmail);

    })

  })

});
