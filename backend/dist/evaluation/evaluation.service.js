"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationService = void 0;
const common_1 = require("@nestjs/common");
const questions_service_1 = require("../questions/questions.service");
let EvaluationService = class EvaluationService {
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    evaluate(dto) {
        const question = this.questionsService.getQuestionById(dto.questionId);
        if (!question) {
            throw new common_1.NotFoundException(`Pregunta ${dto.questionId} no encontrada.`);
        }
        switch (question.category) {
            case 'sequence':
                return this.evaluateSequence(question, dto.userOrder);
            case 'association':
                return this.evaluateAssociation(question, dto.userPairs);
            case 'approximation':
                return this.evaluateApproximation(question, dto.userValue);
            case 'common':
                return this.evaluateCommon(question, dto.userAnswer);
            default:
                throw new common_1.BadRequestException(`Categoría desconocida: ${question.category}`);
        }
    }
    evaluateSequence(question, userOrder) {
        if (!userOrder || !Array.isArray(userOrder) || userOrder.length === 0) {
            throw new common_1.BadRequestException('Debés enviar el orden propuesto para la secuencia.');
        }
        const correct = question.correctOrder || [];
        if (userOrder.length !== correct.length) {
            throw new common_1.BadRequestException(`La secuencia debe contener exactamente ${correct.length} elementos.`);
        }
        for (let i = 0; i < correct.length; i++) {
            const userItem = userOrder[i];
            const expectedItem = correct[i];
            if (userItem !== expectedItem) {
                return {
                    isCorrect: false,
                    category: 'sequence',
                    firstMistakeIndex: i,
                    firstMistakeDetail: {
                        item: userItem,
                        actualPosition: i + 1,
                    },
                    message: `¡Casi! El primer error está en la posición ${i + 1}: "${userItem}" no corresponde a ese lugar.`,
                };
            }
        }
        return {
            isCorrect: true,
            category: 'sequence',
            message: '¡Excelente! Ordenaste toda la secuencia a la perfección.',
            revealedSolution: correct,
        };
    }
    evaluateAssociation(question, userPairs) {
        if (!userPairs || !Array.isArray(userPairs) || userPairs.length === 0) {
            throw new common_1.BadRequestException('Debés enviar las parejas asociadas.');
        }
        const correctMap = new Map();
        for (const pair of question.correctPairs || []) {
            correctMap.set(pair.left.trim().toLowerCase(), pair.right.trim());
        }
        for (let i = 0; i < userPairs.length; i++) {
            const pair = userPairs[i];
            const leftKey = pair.left.trim().toLowerCase();
            const expectedRight = correctMap.get(leftKey);
            if (!expectedRight || expectedRight.toLowerCase() !== pair.right.trim().toLowerCase()) {
                return {
                    isCorrect: false,
                    category: 'association',
                    firstMistakeIndex: i,
                    firstMistakeDetail: {
                        pairLeft: pair.left,
                        pairRight: pair.right,
                    },
                    message: `El primer error está en la asociación de "${pair.left}": no corresponde con "${pair.right}".`,
                };
            }
        }
        return {
            isCorrect: true,
            category: 'association',
            message: '¡Brillante! Todas las asociaciones son correctas.',
            revealedSolution: question.correctPairs,
        };
    }
    evaluateApproximation(question, userValue) {
        if (userValue === undefined || userValue === null || isNaN(userValue)) {
            throw new common_1.BadRequestException('Debés ingresar un valor numérico para la aproximación.');
        }
        const target = question.targetValue ?? 0;
        const marginPercent = question.acceptableMarginPercent ?? 5;
        const marginDelta = Math.abs(target * (marginPercent / 100));
        const diff = userValue - target;
        const absDiff = Math.abs(Number(diff.toFixed(2)));
        const isWithinMargin = absDiff <= Math.max(marginDelta, 0.001);
        if (!isWithinMargin) {
            const direction = diff > 0 ? 'higher' : 'lower';
            const directionText = diff > 0 ? 'por encima' : 'por debajo';
            return {
                isCorrect: false,
                category: 'approximation',
                firstMistakeDetail: {
                    difference: absDiff,
                    direction,
                },
                message: `Tu estimación de ${userValue} ${question.unit || ''} estuvo ${directionText} del valor real. La diferencia absoluta es de ${absDiff} ${question.unit || ''} (el valor real es ${target} ${question.unit || ''}).`,
                revealedSolution: {
                    targetValue: target,
                    unit: question.unit,
                    absoluteDifference: absDiff,
                    explanation: question.explanation,
                },
            };
        }
        return {
            isCorrect: true,
            category: 'approximation',
            message: `¡Gran estimación! El valor exacto es ${target} ${question.unit || ''} (diferencia absoluta: ${absDiff} ${question.unit || ''}).`,
            revealedSolution: {
                targetValue: target,
                unit: question.unit,
                absoluteDifference: absDiff,
                explanation: question.explanation,
            },
        };
    }
    evaluateCommon(question, userAnswer) {
        if (!userAnswer || userAnswer.trim() === '') {
            throw new common_1.BadRequestException('Debés ingresar una respuesta para la consigna En Común.');
        }
        const normalizedUser = this.normalizeText(userAnswer);
        const keywords = (question.keywords || []).map((k) => this.normalizeText(k));
        const normalizedTrait = this.normalizeText(question.commonTrait || '');
        const hasKeywordMatch = keywords.some((kw) => normalizedUser.includes(kw));
        const traitWords = normalizedTrait.split(' ').filter((w) => w.length > 3);
        const userWords = normalizedUser.split(' ').filter((w) => w.length > 3);
        const matchingWordsCount = userWords.filter((uw) => traitWords.includes(uw)).length;
        const isMatch = hasKeywordMatch || matchingWordsCount >= 2;
        if (!isMatch) {
            return {
                isCorrect: false,
                category: 'common',
                message: `No es correcto. Lo que tienen en común: ${question.commonTrait}.`,
                revealedSolution: {
                    commonTrait: question.commonTrait,
                    hint: question.hint,
                },
            };
        }
        return {
            isCorrect: true,
            category: 'common',
            message: `¡Exacto! Lo que tienen en común: ${question.commonTrait}.`,
            revealedSolution: {
                commonTrait: question.commonTrait,
            },
        };
    }
    normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .trim();
    }
};
exports.EvaluationService = EvaluationService;
exports.EvaluationService = EvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], EvaluationService);
//# sourceMappingURL=evaluation.service.js.map