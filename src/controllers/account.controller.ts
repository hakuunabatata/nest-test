import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../services'

@Controller('accounts')
export class AccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: Omit<User, 'id'>): Promise<User> {
    const { name, email, password } = body ?? {}

    if (!name) throw new ForbiddenException('Name is missing')
    if (!email) throw new ForbiddenException('Email is missing')
    if (!password) throw new ForbiddenException('Password is missing')

    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email },
    })

    if (emailAlreadyExists) throw new ConflictException('Email already created')

    return this.prisma.user.create({ data: { name, email, password } })
  }
}
