import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { QuestionsService } from '../questions/questions.service';

describe('EvaluationService (First-Mistake Rule)', () => {
  let service: EvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationService, QuestionsService],
    }).compile();

    service = module.get<EvaluationService>(EvaluationService);
  });

  describe('Sequence Evaluation', () => {
    it('should return correct when sequence matches exactly', () => {
      const result = service.evaluate({
        questionId: 'sec-1',
        userOrder: ['Mercurio', 'Venus', 'Tierra', 'Marte', 'Júpiter'],
      });
      expect(result.isCorrect).toBe(true);
    });

    it('should pinpoint ONLY the first mistake without evaluating later items', () => {
      // Correct: Mercurio, Venus, Tierra, Marte, Júpiter
      // User sends: Mercurio, Tierra (wrong here at index 1!), Venus, Júpiter, Marte
      const result = service.evaluate({
        questionId: 'sec-1',
        userOrder: ['Mercurio', 'Tierra', 'Venus', 'Júpiter', 'Marte'],
      });

      expect(result.isCorrect).toBe(false);
      expect(result.firstMistakeIndex).toBe(1);
      expect(result.firstMistakeDetail?.item).toBe('Tierra');
      expect(result.firstMistakeDetail?.actualPosition).toBe(2);
      expect(result.message).toContain('posición 2');
      expect(result.message).toContain('Tierra');
      // Should NOT mention Júpiter or Marte at positions 4, 5
      expect(result.message).not.toContain('Júpiter');
    });
  });

  describe('Association Evaluation', () => {
    it('should return correct when all pairs match', () => {
      const result = service.evaluate({
        questionId: 'asoc-1',
        userPairs: [
          { left: 'Córdoba', right: 'Córdoba' },
          { left: 'Mendoza', right: 'Mendoza' },
          { left: 'Misiones', right: 'Posadas' },
          { left: 'Chubut', right: 'Rawson' },
        ],
      });
      expect(result.isCorrect).toBe(true);
    });

    it('should stop at the FIRST wrong pair and not evaluate subsequent pairs', () => {
      const result = service.evaluate({
        questionId: 'asoc-1',
        userPairs: [
          { left: 'Córdoba', right: 'Córdoba' }, // correct (0)
          { left: 'Mendoza', right: 'Rawson' }, // WRONG (1) - first mistake
          { left: 'Misiones', right: 'Mendoza' }, // also wrong (2)
          { left: 'Chubut', right: 'Posadas' }, // also wrong (3)
        ],
      });

      expect(result.isCorrect).toBe(false);
      expect(result.firstMistakeIndex).toBe(1);
      expect(result.firstMistakeDetail?.pairLeft).toBe('Mendoza');
      expect(result.firstMistakeDetail?.pairRight).toBe('Rawson');
      expect(result.message).toContain('Mendoza');
      expect(result.message).not.toContain('Misiones');
      expect(result.message).not.toContain('Chubut');
    });
  });

  describe('Approximation Evaluation', () => {
    it('should accept values within margin and include absolute difference', () => {
      // 5194 with 15% margin -> 4414 to 5973
      const result = service.evaluate({
        questionId: 'aprox-1',
        userValue: 5200,
      });
      expect(result.isCorrect).toBe(true);
      expect(result.message).toContain('diferencia absoluta: 6');
    });

    it('should report higher/lower and absolute difference when outside margin', () => {
      const result = service.evaluate({
        questionId: 'aprox-1',
        userValue: 8000,
      });
      expect(result.isCorrect).toBe(false);
      expect(result.firstMistakeDetail?.direction).toBe('higher');
      expect(result.firstMistakeDetail?.difference).toBe(2806);
      expect(result.message).toContain('diferencia absoluta es de 2806');
    });
  });

  describe('Common Evaluation', () => {
    it('should accept matching keywords and reveal common trait', () => {
      const result = service.evaluate({
        questionId: 'com-1',
        userAnswer: 'Son montañas de los andes',
      });
      expect(result.isCorrect).toBe(true);
      expect(result.message).toContain('Lo que tienen en común:');
    });

    it('should give common trait in feedback when wrong', () => {
      const result = service.evaluate({
        questionId: 'com-1',
        userAnswer: 'Son animales marinos',
      });
      expect(result.isCorrect).toBe(false);
      expect(result.message).toContain('Lo que tienen en común:');
      expect(result.revealedSolution?.commonTrait).toBeDefined();
    });
  });
});
