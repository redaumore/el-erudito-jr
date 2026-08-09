import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { QuestionsService } from '../questions/questions.service';
import { EvaluationResult, Question } from '../common/types/game.types';
import { EvaluateAnswerDto } from './dto/evaluate-answer.dto';

@Injectable()
export class EvaluationService {
  constructor(private readonly questionsService: QuestionsService) {}

  evaluate(dto: EvaluateAnswerDto): EvaluationResult {
    const question = this.questionsService.getQuestionById(dto.questionId);
    if (!question) {
      throw new NotFoundException(`Pregunta ${dto.questionId} no encontrada.`);
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
        throw new BadRequestException(`Categoría desconocida: ${(question as any).category}`);
    }
  }

  /**
   * Evaluates Sequence:
   * Compares user sequence with correct sequence item by item (0 to N-1).
   * Stops AT THE FIRST MISMATCH and informs only about that position.
   */
  private evaluateSequence(question: Question, userOrder?: string[]): EvaluationResult {
    if (!userOrder || !Array.isArray(userOrder) || userOrder.length === 0) {
      throw new BadRequestException('Debés enviar el orden propuesto para la secuencia.');
    }

    const correct = question.correctOrder || [];
    if (userOrder.length !== correct.length) {
      throw new BadRequestException(`La secuencia debe contener exactamente ${correct.length} elementos.`);
    }

    for (let i = 0; i < correct.length; i++) {
      const userItem = userOrder[i];
      const expectedItem = correct[i];

      if (userItem !== expectedItem) {
        // FIRST MISTAKE FOUND: stop immediately!
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

    // All matched
    return {
      isCorrect: true,
      category: 'sequence',
      message: '¡Excelente! Ordenaste toda la secuencia a la perfección.',
      revealedSolution: correct,
    };
  }

  /**
   * Evaluates Association:
   * Compares user pairs with correct pairs.
   * Stops AT THE FIRST INCORRECT PAIR and informs only about that left item connection.
   */
  private evaluateAssociation(
    question: Question,
    userPairs?: { left: string; right: string }[],
  ): EvaluationResult {
    if (!userPairs || !Array.isArray(userPairs) || userPairs.length === 0) {
      throw new BadRequestException('Debés enviar las parejas asociadas.');
    }

    const correctMap = new Map<string, string>();
    for (const pair of question.correctPairs || []) {
      correctMap.set(pair.left.trim().toLowerCase(), pair.right.trim());
    }

    for (let i = 0; i < userPairs.length; i++) {
      const pair = userPairs[i];
      const leftKey = pair.left.trim().toLowerCase();
      const expectedRight = correctMap.get(leftKey);

      if (!expectedRight || expectedRight.toLowerCase() !== pair.right.trim().toLowerCase()) {
        // FIRST MISTAKE FOUND: stop immediately!
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

  /**
   * Evaluates Approximation:
   * Compares numeric input with target value and acceptable percentage margin.
   * Includes absolute difference in feedback.
   */
  private evaluateApproximation(question: Question, userValue?: number): EvaluationResult {
    if (userValue === undefined || userValue === null || isNaN(userValue)) {
      throw new BadRequestException('Debés ingresar un valor numérico para la aproximación.');
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

  /**
   * Evaluates Common:
   * Checks if user answer matches key concept tokens or provided keywords.
   * Includes what elements have in common in feedback.
   */
  private evaluateCommon(question: Question, userAnswer?: string): EvaluationResult {
    if (!userAnswer || userAnswer.trim() === '') {
      throw new BadRequestException('Debés ingresar una respuesta para la consigna En Común.');
    }

    const normalizedUser = this.normalizeText(userAnswer);
    const keywords = (question.keywords || []).map((k) => this.normalizeText(k));
    const normalizedTrait = this.normalizeText(question.commonTrait || '');

    // Check keyword inclusion
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

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }
}
