"use strict";
/**
 * Plots Model
 *
 * This model stores plot information including title, description,
 * structure, importance, status, and other plot-related metadata.
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
// Schema for Plot
const PlotSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required']
    },
    title: {
        type: String,
        required: [true, 'Plot title is required'],
        trim: true,
        maxlength: [100, 'Plot title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Plot description is required'],
        maxlength: [2000, 'Plot description cannot exceed 2000 characters']
    },
    type: {
        type: String,
        required: [true, 'Plot type is required'],
        enum: {
            values: ['Main Plot', 'Subplot', 'Character Arc'],
            message: 'Type must be Main Plot, Subplot, or Character Arc'
        }
    },
    structure: {
        type: String,
        enum: {
            values: [
                'Three-Act',
                'Hero\'s Journey',
                'Save the Cat',
                'Seven-Point',
                'Freytag\'s Pyramid',
                'Fichtean Curve',
                'Custom'
            ],
            message: 'Structure must be a valid story structure'
        },
        default: 'Three-Act'
    },
    importance: {
        type: Number,
        min: [1, 'Importance must be between 1 and 5'],
        max: [5, 'Importance must be between 1 and 5'],
        default: 3
    },
    status: {
        type: String,
        enum: {
            values: ['Planned', 'In Progress', 'Completed', 'Abandoned'],
            message: 'Status must be Planned, In Progress, Completed, or Abandoned'
        },
        default: 'Planned'
    },
    elements: [{
            type: {
                type: String,
                enum: {
                    values: ['Setup', 'Inciting Incident', 'Rising Action', 'Midpoint', 'Complications', 'Crisis', 'Climax', 'Resolution', 'Custom'],
                    message: 'Element type must be valid'
                },
                required: [true, 'Element type is required']
            },
            description: {
                type: String,
                required: [true, 'Element description is required']
            },
            characters: [{
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Character'
                }],
            settings: [{
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Setting'
                }],
            objects: [{
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Object'
                }],
            order: {
                type: Number,
                required: [true, 'Element order is required']
            }
        }],
    relatedPlots: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Plot'
        }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});
// Add text index for search
PlotSchema.index({ title: 'text', description: 'text' });
PlotSchema.index({ projectId: 1 });
// Create and export the model
exports.default = mongoose_1.default.model('Plot', PlotSchema);
