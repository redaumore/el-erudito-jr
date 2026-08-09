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
var QuestionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const game_types_1 = require("../common/types/game.types");
const questions_seed_1 = require("../data/seed/questions.seed");
let QuestionsService = QuestionsService_1 = class QuestionsService {
    constructor() {
        this.logger = new common_1.Logger(QuestionsService_1.name);
        this.questions = [];
        this.questions = [...questions_seed_1.SEED_QUESTIONS];
        this.logger.log(`Initialized question bank with ${this.questions.length} curated questions.`);
    }
    getAllQuestions(category) {
        if (category) {
            return this.questions.filter((q) => q.category === category);
        }
        return this.questions;
    }
    getQuestionById(id) {
        return this.questions.find((q) => q.id === id);
    }
    getRandomQuestion(category, excludeId) {
        let pool = category ? this.questions.filter((q) => q.category === category) : this.questions;
        if (excludeId && pool.length > 1) {
            pool = pool.filter((q) => q.id !== excludeId);
        }
        if (pool.length === 0)
            return null;
        const randomIndex = Math.floor(Math.random() * pool.length);
        const original = pool[randomIndex];
        return this.prepareClientQuestion(original);
    }
    addQuestions(newQuestions) {
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
        const counts = {
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
            categoriesInfo: game_types_1.CATEGORY_MAP,
        };
    }
    prepareClientQuestion(question) {
        const copy = JSON.parse(JSON.stringify(question));
        if (copy.category === 'sequence' && copy.items) {
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
    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = QuestionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map