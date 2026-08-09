import { GeneratorService } from './generator.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
export declare class GeneratorController {
    private readonly generatorService;
    constructor(generatorService: GeneratorService);
    generate(dto: GenerateQuestionsDto): Promise<{
        added: number;
        questions: import("../common/types/game.types").Question[];
    }>;
}
