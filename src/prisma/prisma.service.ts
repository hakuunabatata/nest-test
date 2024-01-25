import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaClient, User } from '@prisma/client'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClient

  constructor() {
    this.client = new PrismaClient({ log: ['warn', 'error'] })
  }

  onModuleInit = async () => this.client.$connect()

  onModuleDestroy = async () => this.client.$disconnect()

  getUsers = async (): Promise<User[]> => this.client.user.findMany()

  addUser = async (data: Omit<User, 'id'>): Promise<User> =>
    this.client.user.create({ data })
}
