import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      throw new BadRequestException(
        error instanceof ZodError
          ? {
              errors: fromZodError(error),
              message: 'Validation Failed',
              statusCode: 400,
            }
          : 'Validation Failed',
      )
    }

    return value
  }
}
