/**
 * Export Model
 * 
 * This file defines the schema for story exports, including different
 * export formats, metadata, and status tracking.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IExport extends Document {
  project: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  format: 'pdf' | 'epub' | 'docx' | 'markdown' | 'html';
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  configuration: {
    include_chapters: mongoose.Types.ObjectId[];
    include_title_page: boolean;
    include_table_of_contents: boolean;
    include_character_list: boolean;
    include_setting_descriptions: boolean;
    custom_css?: string;
    template_id?: mongoose.Types.ObjectId;
    page_size?: string;
    font_family?: string;
    font_size?: number;
  };
  file_url?: string;
  error_message?: string;
  completed_at?: Date;
  file_size?: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
}

const ExportSchema: Schema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required']
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    format: {
      type: String,
      required: [true, 'Export format is required'],
      enum: {
        values: ['pdf', 'epub', 'docx', 'markdown', 'html'],
        message: 'Export format must be pdf, epub, docx, markdown, or html'
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
        values: ['pending', 'processing', 'completed', 'failed'],
        message: 'Export status must be pending, processing, completed, or failed'
      },
      default: 'pending'
    },
    configuration: {
      include_chapters: [{
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
      }],
      include_title_page: {
        type: Boolean,
        default: true
      },
      include_table_of_contents: {
        type: Boolean,
        default: true
      },
      include_character_list: {
        type: Boolean,
        default: false
      },
      include_setting_descriptions: {
        type: Boolean,
        default: false
      },
      custom_css: String,
      template_id: Schema.Types.ObjectId,
      page_size: {
        type: String,
        default: 'A4'
      },
      font_family: {
        type: String,
        default: 'Times New Roman'
      },
      font_size: {
        type: Number,
        default: 12
      }
    },
    file_url: String,
    error_message: String,
    completed_at: Date,
    file_size: Number,
    download_count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Index for faster queries
ExportSchema.index({ project: 1, created_at: -1 });
ExportSchema.index({ created_by: 1 });

export default mongoose.model<IExport>('Export', ExportSchema); 