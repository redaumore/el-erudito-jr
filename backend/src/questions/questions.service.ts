import { Injectable, Logger } from '@nestjs/common';
import { CategoryType, Question, CATEGORY_MAP } from '../common/types/game.types';
import { SEED_QUESTIONS } from '../data/seed/questions.seed';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  private questions: Question[] = [];

  constructor() {
    this.questions = [...SEED_QUESTIONS];
    this.logger.log(`Initialized question bank with ${this.questions.length} curated questions.`);
  }

  getAllQuestions(category?: CategoryType): Question[] {
    if (category) {
      return this.questions.filter((q) => q.category === category);
    }
    return this.questions;
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find((q) => q.id === id);
  }

  /**
   * Returns a random question for the given category (or any),
   * with options shuffled so the client doesn't get pre-ordered answers.
   */
  getRandomQuestion(category?: CategoryType, excludeId?: string): Question | null {
    let pool = category ? this.questions.filter((q) => q.category === category) : this.questions;
    if (excludeId && pool.length > 1) {
      pool = pool.filter((q) => q.id !== excludeId);
    }
    if (pool.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const original = pool[randomIndex];

    // Return a client-ready copy with shuffled presentation
    return this.prepareClientQuestion(original);
  }

  addQuestions(newQuestions: Question[]): number {
    let addedCount = 0;
    for (const q of newQuestions) {
      if (!this.questions.some((existing) => existing.id === q.id)) {
        this.questions.push(q);
        addedCount++;
      }
    }
    this.logger.log(`Added ${addedCount} new questions. Total in bank: ${this.questions.length}`);
    return addedCount;
  }

  getBankStats() {
    const counts: Record<CategoryType, number> = {
      association: 0,
      sequence: 0,
      approximation: 0,
      common: 0,
    };
    for (const q of this.questions) {
      if (counts[q.category] !== undefined) {
        counts[q.category]++;
      }
    }
    return {
      total: this.questions.length,
      byCategory: counts,
      categoriesInfo: CATEGORY_MAP,
    };
  }

  /**
   * Prepares the question for client-side rendering by shuffling items
   * so sequence items or association columns are randomized.
   */
  private prepareClientQuestion(question: Question): Question {
    const copy: Question = JSON.parse(JSON.stringify(question));

    if (copy.category === 'sequence' && copy.items) {
      // Shuffle presentation items
      copy.items = this.shuffleArray([...copy.items]);
    }

    if (copy.category === 'association') {
      if (copy.leftItems) {
        copy.leftItems = this.shuffleArray([...copy.leftItems]);
      }
      if (copy.rightItems) {
        copy.rightItems = this.shuffleArray([...copy.rightItems]);
      }
    }

    return copy;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
