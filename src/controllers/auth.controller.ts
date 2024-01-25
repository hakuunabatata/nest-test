import { Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Controller('sessions')
export class AuthController {
  constructor(private jwt: JwtService) {}

  @Post()
  async handle() {
    return this.jwt.sign({ sub: 'user_id' })
  }
}