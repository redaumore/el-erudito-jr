import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluateAnswerDto } from './dto/evaluate-answer.dto';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  checkAnswer(@Body() dto: EvaluateAnswerDto) {
    return this.evaluationService.evaluate(dto);
  }
}
