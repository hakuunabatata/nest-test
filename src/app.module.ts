import { Module } from '@nestjs/common'
import { PrismaService } from './services'
import { AccountController } from './controllers'

@Module({
  controllers: [AccountController],
  providers: [PrismaService],
})
export class AppModule {}
