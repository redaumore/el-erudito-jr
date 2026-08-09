export type CategoryType = 'association' | 'sequence' | 'approximation' | 'common';
export type CategoryColor = 'red' | 'blue' | 'yellow' | 'green';
export interface CategoryInfo {
    type: CategoryType;
    color: CategoryColor;
    colorHex: string;
    name: string;
    description: string;
    iconName: string;
}
export declare const CATEGORY_MAP: Record<CategoryType, CategoryInfo>;
export interface PairItem {
    left: string;
    right: string;
}
export interface Question {
    id: string;
    category: CategoryType;
    topic: string;
    grade: string;
    title: string;
    instructions?: string;
    items?: string[];
    correctOrder?: string[];
    orderCriteria?: string;
    leftItems?: string[];
    rightItems?: string[];
    correctPairs?: PairItem[];
    targetValue?: number;
    unit?: string;
    acceptableMarginPercent?: number;
    explanation?: string;
    commonItems?: string[];
    commonTrait?: string;
    keywords?: string[];
    hint?: string;
}
export interface EvaluationResult {
    isCorrect: boolean;
    category: CategoryType;
    message: string;
    firstMistakeIndex?: number;
    firstMistakeDetail?: {
        item?: string;
        expectedPosition?: number;
        actualPosition?: number;
        pairLeft?: string;
        pairRight?: string;
        difference?: number;
        direction?: 'higher' | 'lower';
    };
    revealedSolution?: any;
}
