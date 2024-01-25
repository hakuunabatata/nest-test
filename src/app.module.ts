import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountController, AuthModule, PrismaService, envSchema } from '.'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [PrismaService],
})
export class AppModule {}
