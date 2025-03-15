/**
 * AI Service
 * 
 * Service responsible for handling AI generation operations,
 * including making requests to AI providers and storing results.
 */

import mongoose from 'mongoose';
import AIGeneration, { IAIGeneration } from '../models/ai.model';
import { 
  AITaskType, 
  AIGenerationRequest,
  AIResponse,
  TokenUsage,
  CharacterGenerationRequest,
  PlotGenerationRequest,
  SettingGenerationRequest,
  ChapterGenerationRequest,
  EditorialFeedbackRequest,
  ImageGenerationRequest
} from '../types/ai.types';

class AIService {
  /**
   * Create a new AI generation record
   */
  async createGeneration(
    userId: string,
    projectId: string,
    task: AITaskType,
    requestParams: Record<string, any>,
    responseContent: string,
    model: string,
    tokenUsage: TokenUsage,
    parentId?: string
  ): Promise<IAIGeneration> {
    try {
      const generation = new AIGeneration({
        userId: new mongoose.Types.ObjectId(userId),
        projectId: new mongoose.Types.ObjectId(projectId),
        task,
        requestParams,
        responseContent,
        metadata: {
          model,
          timestamp: new Date(),
          tokenUsage
        },
        isSaved: false,
        ...(parentId && { parentId: new mongoose.Types.ObjectId(parentId) })
      });

      return await generation.save();
    } catch (error) {
      console.error('Error creating AI generation record:', error);
      throw error;
    }
  }

  /**
   * Get all AI generations for a project
   */
  async getGenerationsByProject(projectId: string): Promise<IAIGeneration[]> {
    try {
      return await AIGeneration.find({ 
        projectId: new mongoose.Types.ObjectId(projectId) 
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching AI generations by project:', error);
      throw error;
    }
  }

  /**
   * Get all saved AI generations for a project
   */
  async getSavedGenerationsByProject(projectId: string): Promise<IAIGeneration[]> {
    try {
      return await AIGeneration.find({ 
        projectId: new mongoose.Types.ObjectId(projectId),
        isSaved: true
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching saved AI generations by project:', error);
      throw error;
    }
  }

  /**
   * Get AI generations by task type
   */
  async getGenerationsByTask(projectId: string, task: AITaskType): Promise<IAIGeneration[]> {
    try {
      return await AIGeneration.find({ 
        projectId: new mongoose.Types.ObjectId(projectId),
        task
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error(`Error fetching AI generations for task ${task}:`, error);
      throw error;
    }
  }

  /**
   * Toggle saved status for an AI generation
   */
  async toggleSaved(generationId: string): Promise<IAIGeneration> {
    try {
      const generation = await AIGeneration.findById(generationId);
      if (!generation) {
        throw new Error('AI generation not found');
      }
      
      generation.isSaved = !generation.isSaved;
      return await generation.save();
    } catch (error) {
      console.error('Error toggling saved status:', error);
      throw error;
    }
  }

  /**
   * Delete an AI generation
   */
  async deleteGeneration(generationId: string): Promise<void> {
    try {
      const result = await AIGeneration.deleteOne({ 
        _id: new mongoose.Types.ObjectId(generationId) 
      });
      
      if (result.deletedCount === 0) {
        throw new Error('AI generation not found');
      }
    } catch (error) {
      console.error('Error deleting AI generation:', error);
      throw error;
    }
  }
}

export default new AIService(); 