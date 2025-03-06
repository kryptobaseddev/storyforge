"use strict";
/**
 * AI Context Manager
 *
 * This helper manages the context for AI requests, selecting relevant
 * story elements based on the current task and optimizing the context
 * to stay within token limits.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
/**
 * Context Manager class for handling context selection and formatting
 */
class ContextManager {
    /**
     * Get relevant context elements for an AI request
     *
     * @param params - Context selection parameters
     * @returns Formatted context object with relevant elements
     */
    getContext(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock function for now - this would typically query a database
            // In a real implementation, this would fetch data from the database
            const projectContext = yield this.getProjectContext(params.project_id);
            // Get relevant elements based on task
            const characters = yield this.getRelevantCharacters(params);
            const settings = yield this.getRelevantSettings(params);
            const plotPoints = yield this.getRelevantPlotPoints(params);
            const chapters = yield this.getRelevantChapters(params);
            // Format the context
            return {
                project: this.formatProjectContext(projectContext),
                characters: this.formatCharacters(characters),
                settings: this.formatSettings(settings),
                plot_points: this.formatPlotPoints(plotPoints),
                recent_content: this.formatChapters(chapters),
            };
        });
    }
    /**
     * Get project context
     *
     * @param projectId - The project ID
     * @returns Project context object
     */
    getProjectContext(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock function - would typically query the database
            return {
                id: projectId,
                title: "Sample Project",
                genre: "fantasy",
                target_audience: "young adult",
                tone: "adventurous",
                style: "descriptive",
            };
        });
    }
    /**
     * Get relevant characters
     *
     * @param params - Context selection parameters
     * @returns Array of relevant character elements
     */
    getRelevantCharacters(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock function - would typically query the database
            // This would filter and sort characters by relevance
            return [];
        });
    }
    /**
     * Get relevant settings
     *
     * @param params - Context selection parameters
     * @returns Array of relevant setting elements
     */
    getRelevantSettings(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock function - would typically query the database
            return [];
        });
    }
    /**
     * Get relevant plot points
     *
     * @param params - Context selection parameters
     * @returns Array of relevant plot point elements
     */
    getRelevantPlotPoints(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock function - would typically query the database
            return [];
        });
    }
    /**
     * Get relevant chapters
     *
     * @param params - Context selection parameters
     * @returns Array of relevant chapter elements
     */
    getRelevantChapters(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock function - would typically query the database
            return [];
        });
    }
    /**
     * Calculate relevance score for a story element
     *
     * @param element - The story element
     * @param params - Context selection parameters
     * @returns Relevance score (higher is more relevant)
     */
    calculateRelevance(element, params) {
        var _a, _b, _c, _d;
        let score = 0;
        // Base importance score
        score += element.importance || 0;
        // Direct mention in parameters
        if ((element.type === 'character' && ((_a = params.character_ids) === null || _a === void 0 ? void 0 : _a.includes(element.id))) ||
            (element.type === 'setting' && ((_b = params.setting_ids) === null || _b === void 0 ? void 0 : _b.includes(element.id))) ||
            (element.type === 'plot_point' && ((_c = params.plot_point_ids) === null || _c === void 0 ? void 0 : _c.includes(element.id))) ||
            (element.type === 'chapter' && ((_d = params.chapter_ids) === null || _d === void 0 ? void 0 : _d.includes(element.id)))) {
            score += 10;
        }
        // Recency score
        if (params.include_recent && element.updated_at) {
            const daysSinceUpdate = (Date.now() - element.updated_at.getTime()) / (1000 * 60 * 60 * 24);
            const recentWindow = params.recent_window_days || 7;
            if (daysSinceUpdate <= recentWindow) {
                score += Math.max(0, 5 - (daysSinceUpdate / recentWindow) * 5);
            }
        }
        // Recently referenced bonus
        if (element.last_referenced_at) {
            const daysSinceReferenced = (Date.now() - element.last_referenced_at.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceReferenced <= 1) { // Referenced in the last day
                score += 3;
            }
        }
        return score;
    }
    /**
     * Format project context to reduce token usage
     *
     * @param project - The project context
     * @returns Formatted project context
     */
    formatProjectContext(project) {
        return {
            title: project.title,
            genre: project.genre,
            audience: project.target_audience,
            tone: project.tone,
            style: project.style,
        };
    }
    /**
     * Format characters to reduce token usage
     *
     * @param characters - Array of character elements
     * @returns Formatted character array
     */
    formatCharacters(characters) {
        return characters.map(char => {
            var _a, _b;
            return ({
                name: char.name,
                role: char.role,
                description: char.description,
                key_traits: ((_a = char.traits) === null || _a === void 0 ? void 0 : _a.slice(0, 3)) || [],
                goals: ((_b = char.goals) === null || _b === void 0 ? void 0 : _b.slice(0, 2)) || [],
            });
        });
    }
    /**
     * Format settings to reduce token usage
     *
     * @param settings - Array of setting elements
     * @returns Formatted setting array
     */
    formatSettings(settings) {
        return settings.map(setting => {
            var _a;
            return ({
                name: setting.name,
                description: setting.description,
                type: setting.location_type,
                key_features: ((_a = setting.key_features) === null || _a === void 0 ? void 0 : _a.slice(0, 3)) || [],
            });
        });
    }
    /**
     * Format plot points to reduce token usage
     *
     * @param plotPoints - Array of plot point elements
     * @returns Formatted plot point array
     */
    formatPlotPoints(plotPoints) {
        return plotPoints.map(point => ({
            description: point.description,
            sequence: point.sequence,
            resolved: point.resolved,
        }));
    }
    /**
     * Format chapters to reduce token usage
     *
     * @param chapters - Array of chapter elements
     * @returns Formatted chapter array
     */
    formatChapters(chapters) {
        return chapters.map(chapter => ({
            title: chapter.name,
            summary: chapter.description,
            sequence: chapter.sequence,
        }));
    }
}
exports.ContextManager = ContextManager;
