import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '../pipes'
import { PrismaService } from '../services'
import { z as zod } from 'zod'
import { compare } from 'bcryptjs'

const authBodySchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
})

type AuthBodySchema = zod.infer<typeof authBodySchema>

@Controller('sessions')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async handle(@Body() body: AuthBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) throw new UnauthorizedException('Invalid user credentials')

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid user credentials')

    return {
      access_token: this.jwt.sign({ sub: user.id }),
    }
  }
}
