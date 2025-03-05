/**
 * Export Model
 * 
 * This model stores export information including format, configuration,
 * and status tracking for document exports.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Export document
export interface IExport extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  format: string;
  name: string;
  description: string;
  status: string;
  configuration: {
    includeChapters: mongoose.Types.ObjectId[];
    includeTitlePage: boolean;
    includeTableOfContents: boolean;
    includeCharacterList: boolean;
    includeSettingDescriptions: boolean;
    customCss?: string;
    templateId?: mongoose.Types.ObjectId;
    pageSize?: string;
    fontFamily?: string;
    fontSize?: number;
  };
  fileUrl?: string;
  errorMessage?: string;
  completedAt?: Date;
  fileSize?: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Export
const ExportSchema: Schema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
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
    templateId: Schema.Types.ObjectId,
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
export default mongoose.model<IExport>('Export', ExportSchema); 