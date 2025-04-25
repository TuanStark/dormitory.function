import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaController } from './prisma.controller';

@Global() //dung chung cho tat ca cac module khac
@Module({
  providers: [PrismaService],
  controllers: [PrismaController],
  exports: [PrismaService], //dung chung cho tat ca cac module khac
})
export class PrismaModule {}
