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
var GeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const questions_service_1 = require("../questions/questions.service");
let GeneratorService = GeneratorService_1 = class GeneratorService {
    constructor(configService, questionsService) {
        this.configService = configService;
        this.questionsService = questionsService;
        this.logger = new common_1.Logger(GeneratorService_1.name);
    }
    async generateQuestions(dto) {
        const category = dto.category || this.pickRandomCategory();
        const count = dto.count || 1;
        const apiKey = dto.customApiKey || this.configService.get('GEMINI_API_KEY');
        let generated = [];
        if (apiKey) {
            try {
                generated = await this.generateWithGemini(category, count, dto.topic, apiKey);
            }
            catch (err) {
                this.logger.warn(`Failed to generate with Gemini API (${err.message}). Falling back to algorithmic templates.`);
                generated = this.generateWithCuratedTemplates(category, count, dto.topic);
            }
        }
        else {
            generated = this.generateWithCuratedTemplates(category, count, dto.topic);
        }
        const added = this.questionsService.addQuestions(generated);
        return { added, questions: generated };
    }
    pickRandomCategory() {
        const categories = ['association', 'sequence', 'approximation', 'common'];
        return categories[Math.floor(Math.random() * categories.length)];
    }
    async generateWithGemini(category, count, topic, apiKey) {
        const prompt = this.buildPrompt(category, count, topic);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.7,
                },
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawJson) {
            throw new Error('Empty response from Gemini');
        }
        const parsed = JSON.parse(rawJson);
        const questionsArray = Array.isArray(parsed) ? parsed : [parsed];
        return questionsArray.map((item, index) => ({
            id: `gen-${Date.now()}-${index}`,
            category,
            topic: item.topic || topic || 'Cultura General 6to Grado',
            grade: '6to Primaria',
            title: item.title,
            instructions: item.instructions,
            items: item.items,
            correctOrder: item.correctOrder,
            orderCriteria: item.orderCriteria,
            leftItems: item.leftItems,
            rightItems: item.rightItems,
            correctPairs: item.correctPairs,
            targetValue: item.targetValue,
            unit: item.unit,
            acceptableMarginPercent: item.acceptableMarginPercent,
            explanation: item.explanation,
            commonItems: item.commonItems,
            commonTrait: item.commonTrait,
            keywords: item.keywords,
            hint: item.hint,
        }));
    }
    buildPrompt(category, count, topic) {
        const baseGuide = `Generá ${count} consignas del juego 'El Erudito' adaptadas para una niña de 11 años que cursa 6to grado de primaria en Argentina.
Nivel: Desafiante pero acorde a su edad escolar. Temáticas recomendadas: Geografía Argentina, Historia Argentina, Ciencias Naturales (Cuerpo humano, Ecosistemas, Astronomía), Lengua y Matemática.
${topic ? `Tema específico solicitado: ${topic}` : ''}
Categoría solicitada: ${category}.`;
        if (category === 'sequence') {
            return `${baseGuide}
Respondé en formato JSON con un array de objetos con el siguiente esquema:
[
  {
    "topic": "string",
    "title": "string (consigna)",
    "instructions": "string",
    "orderCriteria": "string (criterio de orden)",
    "items": ["string", "string", "string", "string", "string"],
    "correctOrder": ["string (en orden correcto)", "...", "...", "...", "..."]
  }
]`;
        }
        if (category === 'association') {
            return `${baseGuide}
Respondé en formato JSON con un array de objetos con el siguiente esquema:
[
  {
    "topic": "string",
    "title": "string",
    "instructions": "string",
    "leftItems": ["string (4 items columna A)"],
    "rightItems": ["string (4 items columna B)"],
    "correctPairs": [
      { "left": "item A1", "right": "item B1" },
      { "left": "item A2", "right": "item B2" },
      { "left": "item A3", "right": "item B3" },
      { "left": "item A4", "right": "item B4" }
    ]
  }
]`;
        }
        if (category === 'approximation') {
            return `${baseGuide}
Respondé en formato JSON con un array de objetos con el siguiente esquema:
[
  {
    "topic": "string",
    "title": "string",
    "instructions": "string (pregunta de estimación numérica)",
    "targetValue": 1234,
    "unit": "string (ej. kilómetros, años, metros)",
    "acceptableMarginPercent": 5,
    "explanation": "string (explicación del dato exacto)"
  }
]`;
        }
        return `${baseGuide}
Respondé en formato JSON con un array de objetos con el siguiente esquema:
[
  {
    "topic": "string",
    "title": "¿Qué tienen en común?",
    "instructions": "string",
    "commonItems": ["item 1", "item 2", "item 3", "item 4"],
    "commonTrait": "string (explicación de la característica unificadora)",
    "keywords": ["palabra_clave1", "palabra_clave2", "palabra_clave3"],
    "hint": "string (pista amistosa sin revelar la respuesta)"
  }
]`;
    }
    generateWithCuratedTemplates(category, count, topic) {
        const fallbackBank = {
            sequence: [
                {
                    id: `tpl-sec-${Date.now()}-1`,
                    category: 'sequence',
                    topic: 'Historia de la Escritura y Comunicación',
                    grade: '6to Primaria',
                    title: 'Evolución de los Medios de Comunicación',
                    instructions: 'Ordená los inventos de comunicación desde el más antiguo hasta el más moderno.',
                    orderCriteria: 'Del más antiguo al más moderno',
                    items: ['Internet', 'Pinturas Rupestres', 'Teléfono', 'Imprenta de Gutenberg'],
                    correctOrder: ['Pinturas Rupestres', 'Imprenta de Gutenberg', 'Teléfono', 'Internet'],
                },
                {
                    id: `tpl-sec-${Date.now()}-2`,
                    category: 'sequence',
                    topic: 'Matemática: Unidades de Capacidad',
                    grade: '6to Primaria',
                    title: 'Unidades de Capacidad de Menor a Mayor',
                    instructions: 'Ordená las siguientes medidas de volumen/capacidad de menor a mayor.',
                    orderCriteria: 'De menor a mayor capacidad',
                    items: ['1 Litro (1 L)', '1 Mililitro (1 ml)', '1 Hectolitro (100 L)', '1 Centilitro (10 ml)'],
                    correctOrder: ['1 Mililitro (1 ml)', '1 Centilitro (10 ml)', '1 Litro (1 L)', '1 Hectolitro (100 L)'],
                },
            ],
            association: [
                {
                    id: `tpl-asoc-${Date.now()}-1`,
                    category: 'association',
                    topic: 'Literatura y Personajes',
                    grade: '6to Primaria',
                    title: 'Cuentos Clásicos y Personajes',
                    instructions: 'Asociá cada personaje o elemento con su cuento clásico.',
                    leftItems: ['Pinocho', 'Peter Pan', 'Aladino', 'Alicia'],
                    rightItems: ['Gepetto', 'Capitán Garfio', 'El Genio de la Lámpara', 'El Sombrerero Loco'],
                    correctPairs: [
                        { left: 'Pinocho', right: 'Gepetto' },
                        { left: 'Peter Pan', right: 'Capitán Garfio' },
                        { left: 'Aladino', right: 'El Genio de la Lámpara' },
                        { left: 'Alicia', right: 'El Sombrerero Loco' },
                    ],
                },
            ],
            approximation: [
                {
                    id: `tpl-aprox-${Date.now()}-1`,
                    category: 'approximation',
                    topic: 'Astronomía: La Luna',
                    grade: '6to Primaria',
                    title: 'Distancia de la Tierra a la Luna',
                    instructions: '¿A cuántos miles de kilómetros de distancia promedio se encuentra la Luna de la Tierra?',
                    targetValue: 384,
                    unit: 'mil kilómetros (384.400 km)',
                    acceptableMarginPercent: 15,
                    explanation: 'La distancia promedio de la Tierra a la Luna es de aproximadamente 384.400 kilómetros.',
                },
            ],
            common: [
                {
                    id: `tpl-com-${Date.now()}-1`,
                    category: 'common',
                    topic: 'Ciencias Naturales: Los Continentes',
                    grade: '6to Primaria',
                    title: '¿Qué tienen en común?',
                    instructions: '¿Qué gran masa continental o geográfica comparten?',
                    commonItems: ['Río Amazonas', 'Cordillera de los Andes', 'Cataratas del Iguazú', 'Desierto de Atacama'],
                    commonTrait: 'Son accidentes geográficos de América del Sur',
                    keywords: ['america del sur', 'sudamerica', 'continente americano', 'suramerica'],
                    hint: 'Todos se encuentran en nuestra misma región del continente americano.',
                },
            ],
        };
        const templates = fallbackBank[category] || [];
        return templates.slice(0, count);
    }
};
exports.GeneratorService = GeneratorService;
exports.GeneratorService = GeneratorService = GeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        questions_service_1.QuestionsService])
], GeneratorService);
//# sourceMappingURL=generator.service.js.map