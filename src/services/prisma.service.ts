// eslint-disable-next-line prettier/prettier
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ log: ['warn', 'error'] })
  }

  onModuleInit = async () => this.$connect()

  onModuleDestroy = async () => this.$disconnect()
}
