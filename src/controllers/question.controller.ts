import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '../pipes'
import { PrismaService } from '../services'
import { z as zod } from 'zod'
import { compare } from 'bcryptjs'
import { AuthGuard } from '@nestjs/passport'

const questionBodySchema = zod.object({
  content: zod.string(),
  title: zod.string(),
})

type QuestionBodySchema = zod.infer<typeof questionBodySchema>

@Controller('questions')
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(questionBodySchema))
  async handle(@Body() body: QuestionBodySchema) {
    const { content, title } = body

    const question = await this.prisma.question.create({
      data: { content, title, slug: '', authorId: '' },
    })

    return {
      success: true,
      question,
    }
  }
}
