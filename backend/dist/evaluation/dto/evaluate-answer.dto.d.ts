import { PairItem } from '../../common/types/game.types';
export declare class EvaluateAnswerDto {
    questionId: string;
    userOrder?: string[];
    userPairs?: PairItem[];
    userValue?: number;
    userAnswer?: string;
}
