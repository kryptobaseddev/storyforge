"use strict";
/**
 * Export Model
 *
 * This model stores export information including format, configuration,
 * and status tracking for document exports.
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
// Schema for Export
const ExportSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required']
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    format: {
        type: String,
        required: [true, 'Export format is required'],
        enum: {
            values: ['PDF', 'EPUB', 'DOCX', 'Markdown', 'HTML'],
            message: 'Export format must be PDF, EPUB, DOCX, Markdown, or HTML'
        }
    },
    name: {
        type: String,
        required: [true, 'Export name is required'],
        trim: true,
        maxlength: [100, 'Export name cannot exceed 100 characters']
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: [500, 'Export description cannot exceed 500 characters']
    },
    status: {
        type: String,
        required: [true, 'Export status is required'],
        enum: {
            values: ['Pending', 'Processing', 'Completed', 'Failed'],
            message: 'Export status must be Pending, Processing, Completed, or Failed'
        },
        default: 'Pending'
    },
    configuration: {
        includeChapters: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Chapter'
            }],
        includeTitlePage: {
            type: Boolean,
            default: true
        },
        includeTableOfContents: {
            type: Boolean,
            default: true
        },
        includeCharacterList: {
            type: Boolean,
            default: false
        },
        includeSettingDescriptions: {
            type: Boolean,
            default: false
        },
        customCss: String,
        templateId: mongoose_1.Schema.Types.ObjectId,
        pageSize: {
            type: String,
            default: 'A4'
        },
        fontFamily: {
            type: String,
            default: 'Times New Roman'
        },
        fontSize: {
            type: Number,
            default: 12
        }
    },
    fileUrl: String,
    errorMessage: String,
    completedAt: Date,
    fileSize: Number,
    downloadCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
// Index for faster queries
ExportSchema.index({ projectId: 1, createdAt: -1 });
ExportSchema.index({ userId: 1 });
// Create and export the model
exports.default = mongoose_1.default.model('Export', ExportSchema);
