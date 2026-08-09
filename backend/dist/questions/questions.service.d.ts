import { CategoryType, Question } from '../common/types/game.types';
export declare class QuestionsService {
    private readonly logger;
    private questions;
    constructor();
    getAllQuestions(category?: CategoryType): Question[];
    getQuestionById(id: string): Question | undefined;
    getRandomQuestion(category?: CategoryType, excludeId?: string): Question | null;
    addQuestions(newQuestions: Question[]): number;
    getBankStats(): {
        total: number;
        byCategory: Record<CategoryType, number>;
        categoriesInfo: Record<CategoryType, import("../common/types/game.types").CategoryInfo>;
    };
    private prepareClientQuestion;
    private shuffleArray;
}
