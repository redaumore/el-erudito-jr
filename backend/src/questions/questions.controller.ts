import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { GetRandomQuestionDto } from './dto/get-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('random')
  getRandom(@Query() query: GetRandomQuestionDto) {
    const question = this.questionsService.getRandomQuestion(query.category, query.excludeId);
    if (!question) {
      throw new NotFoundException(`No hay preguntas disponibles para la categoría: ${query.category}`);
    }
    return question;
  }

  @Get('stats')
  getStats() {
    return this.questionsService.getBankStats();
  }

  @Get()
  getAll(@Query('category') category?: any) {
    return this.questionsService.getAllQuestions(category);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    const question = this.questionsService.getQuestionById(id);
    if (!question) {
      throw new NotFoundException(`Pregunta con id ${id} no encontrada.`);
    }
    return question;
  }
}
