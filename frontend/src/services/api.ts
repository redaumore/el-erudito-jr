import { CategoryType, EvaluationResult, PairItem, Question } from '../types/game';

const API_BASE = '/api';

export const api = {
  async getRandomQuestion(category: CategoryType, excludeId?: string): Promise<Question> {
    const params = new URLSearchParams({ category });
    if (excludeId) params.append('excludeId', excludeId);

    const res = await fetch(`${API_BASE}/questions/random?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Error al obtener pregunta (${res.status})`);
    }
    return res.json();
  },

  async evaluateAnswer(payload: {
    questionId: string;
    userOrder?: string[];
    userPairs?: PairItem[];
    userValue?: number;
    userAnswer?: string;
  }): Promise<EvaluationResult> {
    const res = await fetch(`${API_BASE}/evaluation/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al validar la respuesta');
    }
    return res.json();
  },

  async getStats(): Promise<{
    total: number;
    byCategory: Record<CategoryType, number>;
  }> {
    const res = await fetch(`${API_BASE}/questions/stats`);
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return res.json();
  },

  async getAllQuestions(category?: CategoryType): Promise<Question[]> {
    const url = category ? `${API_BASE}/questions?category=${category}` : `${API_BASE}/questions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al listar preguntas');
    return res.json();
  },

  async generateQuestions(dto: {
    category?: CategoryType;
    count?: number;
    topic?: string;
    customApiKey?: string;
  }): Promise<{ added: number; questions: Question[] }> {
    const res = await fetch(`${API_BASE}/generator/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Error al generar preguntas');
    return res.json();
  },
};
