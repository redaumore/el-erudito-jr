import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';

@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  generate(@Body() dto: GenerateQuestionsDto) {
    return this.generatorService.generateQuestions(dto);
  }
}
