import { EvaluationService } from './evaluation.service';
import { EvaluateAnswerDto } from './dto/evaluate-answer.dto';
export declare class EvaluationController {
    private readonly evaluationService;
    constructor(evaluationService: EvaluationService);
    checkAnswer(dto: EvaluateAnswerDto): import("../common/types/game.types").EvaluationResult;
}
