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

export const CATEGORY_MAP: Record<CategoryType, CategoryInfo> = {
  association: {
    type: 'association',
    color: 'red',
    colorHex: '#EF4444',
    name: 'Asociación',
    description: 'Conectá las parejas correspondientes entre las dos columnas.',
    iconName: 'Link2',
  },
  sequence: {
    type: 'sequence',
    color: 'blue',
    colorHex: '#3B82F6',
    name: 'Secuencia',
    description: 'Ordená los elementos según el criterio indicado.',
    iconName: 'ArrowUpDown',
  },
  approximation: {
    type: 'approximation',
    color: 'yellow',
    colorHex: '#F59E0B',
    name: 'Aproximación',
    description: 'Calculá o estimá el número más cercano.',
    iconName: 'Calculator',
  },
  common: {
    type: 'common',
    color: 'green',
    colorHex: '#10B981',
    name: 'En Común',
    description: 'Descubrí la característica o concepto que une a los elementos.',
    iconName: 'Layers',
  },
};

export interface PairItem {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  category: CategoryType;
  topic: string; // e.g. 'Geografía Argentina', 'Historia Argentina', 'Ciencias Naturales', 'Lengua y Literatura', 'Matemática'
  grade: string; // '6to Primaria'
  title: string;
  instructions?: string;
  
  // Data for 'sequence'
  items?: string[];
  correctOrder?: string[];
  orderCriteria?: string;

  // Data for 'association'
  leftItems?: string[];
  rightItems?: string[];
  correctPairs?: PairItem[];

  // Data for 'approximation'
  targetValue?: number;
  unit?: string;
  acceptableMarginPercent?: number;
  explanation?: string;

  // Data for 'common'
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
  revealedSolution?: any; // Only returned if fully correct or when explicitly requested
}
