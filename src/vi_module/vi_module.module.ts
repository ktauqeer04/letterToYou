import { Module } from '@nestjs/common';
import { ViModuleController } from './vi_module.controller';
import { ViModuleService } from './vi_module.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { WorkerModule } from '../worker/worker.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    WorkerModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '20m' },
      })
    }),
    
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          auth:{
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD')
          }
        }
      })
    }),

  ],
  controllers: [ViModuleController],
  providers: [ViModuleService],
})
export class ViModuleModule {}
