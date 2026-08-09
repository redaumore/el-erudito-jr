import { QuestionsService } from './questions.service';
import { GetRandomQuestionDto } from './dto/get-question.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    getRandom(query: GetRandomQuestionDto): import("../common/types/game.types").Question;
    getStats(): {
        total: number;
        byCategory: Record<import("../common/types/game.types").CategoryType, number>;
        categoriesInfo: Record<import("../common/types/game.types").CategoryType, import("../common/types/game.types").CategoryInfo>;
    };
    getAll(category?: any): import("../common/types/game.types").Question[];
    getById(id: string): import("../common/types/game.types").Question;
}
