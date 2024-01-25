import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { z as zod } from 'zod'
import { CurrentUser } from '../auth'
import { ZodValidationPipe } from '../pipes'
import { PrismaService } from '../services'

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
  @UsePipes(new ZodValidationPipe(questionBodySchema))
  async handle(
    @Body() body: QuestionBodySchema,
    @CurrentUser() user: { sub: string },
  ) {
    const { content, title } = body

    const question = await this.prisma.question.create({
      data: { content, title, slug: '', authorId: user.sub },
    })

    return {
      success: true,
      question,
    }
  }
}
