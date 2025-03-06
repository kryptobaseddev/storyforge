"use strict";
/**
 * Character Model
 *
 * This model stores character information including name, description,
 * attributes, relationships, and other character-related metadata.
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
// Schema for Character
const CharacterSchema = new mongoose_1.Schema({
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
    shortDescription: {
        type: String,
        required: true
    },
    detailedBackground: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        required: true,
        enum: ['Protagonist', 'Antagonist', 'Supporting', 'Minor']
    },
    attributes: {
        physical: {
            age: {
                type: Number,
                default: 0
            },
            height: {
                type: String,
                default: ''
            },
            build: {
                type: String,
                default: ''
            },
            hairColor: {
                type: String,
                default: ''
            },
            eyeColor: {
                type: String,
                default: ''
            },
            distinguishingFeatures: [{
                    type: String
                }]
        },
        personality: {
            traits: [{
                    type: String
                }],
            strengths: [{
                    type: String
                }],
            weaknesses: [{
                    type: String
                }],
            fears: [{
                    type: String
                }],
            desires: [{
                    type: String
                }]
        },
        background: {
            birthplace: {
                type: String,
                default: ''
            },
            family: {
                type: String,
                default: ''
            },
            education: {
                type: String,
                default: ''
            },
            occupation: {
                type: String,
                default: ''
            },
            significantEvents: [{
                    type: String
                }]
        },
        motivation: {
            type: String,
            default: ''
        },
        arc: {
            type: String,
            default: ''
        }
    },
    relationships: [{
            characterId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Character'
            },
            relationshipType: {
                type: String,
                enum: ['Friend', 'Enemy', 'Family', 'Romantic', 'Mentor', 'Colleague', 'Other']
            },
            notes: {
                type: String,
                default: ''
            }
        }],
    plotInvolvement: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Plotline'
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
CharacterSchema.index({ name: 'text', shortDescription: 'text' });
// Create and export the model
exports.default = mongoose_1.default.model('Character', CharacterSchema);
