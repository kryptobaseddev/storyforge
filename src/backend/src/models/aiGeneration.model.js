"use strict";
/**
 * AI Generation Model
 *
 * This model stores records of AI-generated content, including
 * the request parameters, response content, and metadata.
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
// Schema for AI generation
const AIGenerationSchema = new mongoose_1.Schema({
    project_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: String,
        enum: ['character', 'plot', 'setting', 'chapter', 'editorial'],
        required: true
    },
    request_params: {
        type: Object,
        required: true
    },
    response_content: {
        type: String,
        required: true
    },
    metadata: {
        model: String,
        timestamp: Date,
        token_usage: {
            prompt: Number,
            completion: Number,
            total: Number
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    is_saved: {
        type: Boolean,
        default: false
    },
    parent_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AIGeneration'
    }
});
// Create and export the model
exports.default = mongoose_1.default.model('AIGeneration', AIGenerationSchema);
