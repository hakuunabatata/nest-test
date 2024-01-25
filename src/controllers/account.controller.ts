import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { PrismaService } from '../services'
import { ZodValidationPipe } from 'src/pipes'

const accountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type AccountBodySchema = z.infer<typeof accountBodySchema>

@Controller('accounts')
export class AccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(accountBodySchema))
  async handle(@Body() body: AccountBodySchema): Promise<User> {
    const { name, email, password } = accountBodySchema.parse(body)
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email },
    })
    if (emailAlreadyExists) throw new ConflictException('Email already created')
    return this.prisma.user.create({
      data: { name, email, password: await hash(password, 8) },
    })
  }
}
