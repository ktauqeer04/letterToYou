import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";

describe('app.service', () => {

    let appService: AppService;
    let prismaService: Partial<PrismaService>;

    const prismaMock = {
        letter: {
            updateMany: jest.fn() as any
        }
    }

    beforeEach(async () => {

        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [AppService,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                }
            ],
        }).compile();

        appService = app.get<AppService>(AppService);
        prismaService = app.get<PrismaService>(PrismaService);
            
    });


    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    describe('verifyToken', () => {

        it('should verify the token successfully', async () => {

            const requestPayload = {
                token: 'example-token'
            };

            (prismaMock.letter.updateMany).mockResolvedValue({
                count: 1
            });

            // ------------------------------------------------------

            const response = await appService.VerifyToken(requestPayload);


            // ------------------------------------------------------

            expect(prismaMock.letter.updateMany).toHaveBeenCalledTimes(1);

            const updateData = {
                where: {
                    hashedUuid: requestPayload.token,
                    updatedAt: { gte: expect.any(Date) },
                },
                data: { isVerified: true },
            }

            expect(prismaMock.letter.updateMany).toHaveBeenCalledWith(updateData);

            expect(response.success).toBe(true);
            expect(response.message).toBe('Email Verified Successfully');
        })

        it('should throw token expired error', async () => {

            

            const requestPayload = {
                token: 'example-token'
            };

            (prismaMock.letter.updateMany).mockResolvedValue({
                count: 0
            });

            // ------------------------------------------------------

            await expect(appService.VerifyToken(requestPayload)).rejects.toThrow('Token Expired')   ;

            // ------------------------------------------------------

            expect(prismaMock.letter.updateMany).toHaveBeenCalledTimes(1);
            

        })

    })


})