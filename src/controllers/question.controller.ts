import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { z as zod } from 'zod'
import { CurrentUser } from '../auth'
import { ZodValidationPipe } from '../pipes'
import { PrismaService } from '../services'
import { slugify } from '../utils'

const questionBodySchema = zod.object({
  content: zod.string(),
  title: zod.string(),
})

type QuestionBodySchema = zod.infer<typeof questionBodySchema>

@Controller('questions')
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(questionBodySchema)) body: QuestionBodySchema,
    @CurrentUser() { sub: authorId }: { sub: string },
  ) {
    const { content, title } = body

    const question = await this.prisma.question.create({
      data: { content, title, slug: slugify(title), authorId },
    })

    return {
      success: true,
      question,
    }
  }
}
