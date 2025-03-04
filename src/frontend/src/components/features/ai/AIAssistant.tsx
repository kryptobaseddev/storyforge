import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { aiApi, GenerationPrompt } from '../../../lib/api';

interface AIAssistantProps {
  onInsert: (content: string) => void;
  contextType: 'character' | 'plot' | 'setting' | 'text';
}

export function AIAssistant({ onInsert, contextType }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const generationPrompt: GenerationPrompt = {
        prompt,
        type: contextType,
      };

      const response = await aiApi.generate(generationPrompt);
      setResult(response.data.content);
    } catch (err) {
      console.error('AI generation error:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (result) {
      onInsert(result);
      setResult('');
      setPrompt('');
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Assistant</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="ai-prompt"
            className="block text-sm font-medium text-foreground"
          >
            What would you like help with?
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder(contextType)}
            rows={3}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="whitespace-pre-wrap">{result}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleInsert}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Insert
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getPlaceholder(contextType: string): string {
  switch (contextType) {
    case 'character':
      return 'E.g., "Create a brave young hero with a mysterious past"';
    case 'plot':
      return 'E.g., "Help me develop a plot twist for the middle of my story"';
    case 'setting':
      return 'E.g., "Describe a magical forest with ancient trees and mystical creatures"';
    case 'text':
      return 'E.g., "Write a paragraph about the main character discovering a hidden door"';
    default:
      return 'What would you like the AI to help you with?';
  }
} 