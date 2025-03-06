"use strict";
/**
 * Chapter Model
 *
 * This model stores chapter information including title, position,
 * content, and other chapter-related metadata.
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
// Schema for Chapter
const ChapterSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required']
    },
    title: {
        type: String,
        required: [true, 'Chapter title is required'],
        trim: true,
        maxlength: [100, 'Chapter title cannot exceed 100 characters']
    },
    position: {
        type: Number,
        required: [true, 'Chapter position is required'],
        min: [0, 'Chapter position must be a positive number']
    },
    synopsis: {
        type: String,
        required: [true, 'Chapter synopsis is required'],
        trim: true,
        maxlength: [1000, 'Chapter synopsis cannot exceed 1000 characters'],
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: {
            values: ['Draft', 'Revised', 'Final', 'Needs Review'],
            message: 'Status must be Draft, Revised, Final, or Needs Review'
        },
        default: 'Draft'
    },
    wordCount: {
        type: Number,
        default: 0
    },
    characters: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Character'
        }],
    settings: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Setting'
        }],
    plotlines: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Plotline'
        }],
    objects: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Object'
        }],
    notes: {
        type: String
    },
    aiGenerated: {
        isGenerated: {
            type: Boolean,
            default: false
        },
        generatedTimestamp: {
            type: Date
        },
        prompt: {
            type: String
        },
        model: {
            type: String
        }
    },
    edits: [{
            timestamp: {
                type: Date,
                default: Date.now
            },
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            changes: {
                type: String,
                required: true
            }
        }]
}, {
    timestamps: true
});
// Pre-save hook to calculate word count
ChapterSchema.pre('save', function (next) {
    if (this.content) {
        const content = this.content;
        this.wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
    }
    next();
});
// Index for faster query by project and position
ChapterSchema.index({ projectId: 1, position: 1 }, { unique: true });
// Index for text search
ChapterSchema.index({ title: 'text', synopsis: 'text', content: 'text' });
// Create and export the model
exports.default = mongoose_1.default.model('Chapter', ChapterSchema);
