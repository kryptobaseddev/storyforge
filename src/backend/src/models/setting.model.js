"use strict";
/**
 * Setting Model
 *
 * This model stores setting information including name, description,
 * details, and other setting-related metadata.
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
// Schema for Setting
const SettingSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required']
    },
    name: {
        type: String,
        required: [true, 'Setting name is required'],
        trim: true,
        maxlength: [100, 'Setting name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Setting description is required'],
        maxlength: [2000, 'Setting description cannot exceed 2000 characters']
    },
    type: {
        type: String,
        required: [true, 'Setting type is required'],
        enum: {
            values: ['Location', 'World', 'Environment', 'Building', 'Region', 'Planet'],
            message: 'Type must be a valid setting type'
        }
    },
    details: {
        geography: {
            type: String,
            default: ''
        },
        climate: {
            type: String,
            default: ''
        },
        architecture: {
            type: String,
            default: ''
        },
        culture: {
            type: String,
            default: ''
        },
        history: {
            type: String,
            default: ''
        },
        government: {
            type: String,
            default: ''
        },
        economy: {
            type: String,
            default: ''
        },
        technology: {
            type: String,
            default: ''
        }
    },
    map: {
        imageUrl: {
            type: String
        },
        coordinates: {
            type: mongoose_1.Schema.Types.Mixed
        }
    },
    relatedSettings: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Setting'
        }],
    characters: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Character'
        }],
    objects: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Object'
        }],
    imageUrl: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});
// Add text index for search
SettingSchema.index({ name: 'text', description: 'text' });
SettingSchema.index({ projectId: 1 });
// Create and export the model
exports.default = mongoose_1.default.model('Setting', SettingSchema);
