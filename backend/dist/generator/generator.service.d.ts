import { ConfigService } from '@nestjs/config';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../common/types/game.types';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
export declare class GeneratorService {
    private readonly configService;
    private readonly questionsService;
    private readonly logger;
    constructor(configService: ConfigService, questionsService: QuestionsService);
    generateQuestions(dto: GenerateQuestionsDto): Promise<{
        added: number;
        questions: Question[];
    }>;
    private pickRandomCategory;
    private generateWithGemini;
    private buildPrompt;
    private generateWithCuratedTemplates;
}
