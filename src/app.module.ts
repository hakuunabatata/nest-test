import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  AccountController,
  AuthController,
  AuthModule,
  PrismaService,
  QuestionController,
  envSchema,
} from '.'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AccountController, AuthController, QuestionController],
  providers: [PrismaService],
})
export class AppModule {}
