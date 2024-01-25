import { Controller, Get, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { AppService } from './app.service'
import { PrismaService } from './prisma'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('hello')
  index(): { message: string } {
    return this.appService.getHello()
  }

  @Get('users')
  async list(): Promise<User[]> {
    return this.prismaService.getUsers()
  }

  @Post('user')
  async add(): Promise<User> {
    return this.prismaService.addUser({
      name: '',
      email: '',
      password: '',
    })
  }
}
