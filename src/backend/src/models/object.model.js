"use strict";
/**
 * Object Model
 *
 * This model stores information about objects/items in the story,
 * including name, description, properties, and other object-related metadata.
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
// Schema for Object
const ObjectSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Item', 'Artifact', 'Vehicle', 'Weapon', 'Tool', 'Clothing', 'Other']
    },
    significance: {
        type: String,
        default: ''
    },
    properties: {
        physical: {
            size: {
                type: String,
                default: ''
            },
            material: {
                type: String,
                default: ''
            },
            appearance: {
                type: String,
                default: ''
            }
        },
        magical: {
            powers: [{
                    type: String
                }],
            limitations: [{
                    type: String
                }],
            origin: {
                type: String,
                default: ''
            }
        }
    },
    history: {
        type: String,
        default: ''
    },
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Setting'
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Character'
    },
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
ObjectSchema.index({ name: 'text', description: 'text', history: 'text' });
// Create and export the model
exports.default = mongoose_1.default.model('Object', ObjectSchema);
