"use strict";
/**
 * Project Model
 *
 * This model stores project information including title, description,
 * genre, target audience, and other project-related metadata.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Schema for Project
const ProjectSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    genre: {
        type: String,
        required: true,
        enum: [
            'fantasy',
            'science fiction',
            'mystery',
            'adventure',
            'historical fiction',
            'realistic fiction',
            'horror',
            'comedy',
            'drama',
            'fairy tale',
            'fable',
            'superhero'
        ]
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['children', 'middle grade', 'young adult', 'adult']
    },
    narrativeType: {
        type: String,
        required: true,
        enum: ['Short Story', 'Novel', 'Screenplay', 'Comic', 'Poem']
    },
    status: {
        type: String,
        default: 'Draft',
        enum: ['Draft', 'In Progress', 'Completed', 'Archived']
    },
    tone: {
        type: String,
        default: 'Neutral',
        enum: ['Serious', 'Humorous', 'Educational', 'Dramatic', 'Neutral', 'Uplifting']
    },
    style: {
        type: String,
        default: 'Neutral',
        enum: ['Descriptive', 'Dialogue-heavy', 'Action-oriented', 'Poetic', 'Neutral']
    },
    targetLength: {
        type: {
            type: String,
            enum: ['Words', 'Pages', 'Chapters'],
            default: 'Words'
        },
        value: {
            type: Number,
            default: 0
        }
    },
    collaborators: [{
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['Editor', 'Viewer', 'Contributor'],
                default: 'Viewer'
            }
        }],
    metadata: {
        createdWithTemplate: {
            type: Boolean,
            default: false
        },
        templateId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Template'
        },
        tags: [{
                type: String,
                trim: true
            }]
    },
    completionDate: {
        type: Date,
        default: null
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Add text index for search
ProjectSchema.index({ title: 'text', description: 'text' });
// Create and export the model
exports.default = mongoose_1.default.model('Project', ProjectSchema);
