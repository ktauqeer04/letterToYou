import { Module } from '@nestjs/common';
import { ViModuleController } from './vi_module.controller';
import { ViModuleService } from './vi_module.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '20m' },
      })
    }),
  ],
  controllers: [ViModuleController],
  providers: [ViModuleService],
})
export class ViModuleModule {}
