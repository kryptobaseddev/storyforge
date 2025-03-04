/**
 * User Model
 * 
 * This model stores user information including authentication
 * details, preferences, and references to their projects.
 */

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  age?: number;
  avatar?: string;
  preferences: {
    theme: string;
    fontSize: number;
    readingLevel: string;
    notificationSettings: Record<string, any>;
  };
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema for User
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    min: 5,
    max: 120
  },
  avatar: {
    type: String
  },
  preferences: {
    theme: {
      type: String,
      default: 'light'
    },
    fontSize: {
      type: Number,
      default: 16
    },
    readingLevel: {
      type: String,
      default: 'middle grade'
    },
    notificationSettings: {
      type: Object,
      default: {
        email: true,
        app: true
      }
    }
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified
  if (!this.isModified('passwordHash')) return next();
  
  try {
    // Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Create and export the model
export default mongoose.model<IUser>('User', UserSchema); 