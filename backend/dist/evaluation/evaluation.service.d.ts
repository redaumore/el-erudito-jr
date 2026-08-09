import { QuestionsService } from '../questions/questions.service';
import { EvaluationResult } from '../common/types/game.types';
import { EvaluateAnswerDto } from './dto/evaluate-answer.dto';
export declare class EvaluationService {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    evaluate(dto: EvaluateAnswerDto): EvaluationResult;
    private evaluateSequence;
    private evaluateAssociation;
    private evaluateApproximation;
    private evaluateCommon;
    private normalizeText;
}
