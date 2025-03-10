import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { trpc } from '@/utils/trpc';

// TODO: Fix the AIAssistant to use the proper AI API

interface AIAssistantProps {
  onInsert: (content: string) => void;
  contextType: 'character' | 'plot' | 'setting' | 'text';
}

export function AIAssistant({ onInsert, contextType }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  
  // Use the tRPC mutation for AI generation
  const generateMutation = trpc.ai.generateContent.useMutation();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Create the request payload
      const payload = {
        content: prompt,
        project_id: 'current', // This will be resolved on the server
        user_id: 'current',    // This will be resolved on the server
      };

      // Add the task based on contextType
      if (contextType === 'character') {
        const response = await generateMutation.mutateAsync({
          ...payload,
          task: 'character'
        });
        setResult(response.content);
      } else if (contextType === 'plot') {
        const response = await generateMutation.mutateAsync({
          ...payload,
          task: 'plot'
        });
        setResult(response.content);
      } else if (contextType === 'setting') {
        const response = await generateMutation.mutateAsync({
          ...payload,
          task: 'setting'
        });
        setResult(response.content);
      } else {
        // Default to editorial for text
        const response = await generateMutation.mutateAsync({
          ...payload,
          task: 'editorial'
        });
        setResult(response.content);
      }
    } catch (err) {
      console.error('AI generation failed:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (result) {
      onInsert(result);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">AI Assistant</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-foreground mb-1"
          >
            What would you like to generate?
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder(contextType)}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <>Generate</>
            )}
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-500 p-2 border border-red-200 rounded bg-red-50">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Generated Content</h4>
              <button
                onClick={handleInsert}
                className="text-xs text-primary hover:text-primary/80"
              >
                Insert
              </button>
            </div>
            <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
              {result}
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
      return 'Describe a character for my story...';
    case 'plot':
      return 'Generate a plot idea or scene...';
    case 'setting':
      return 'Describe a setting or location...';
    case 'text':
    default:
      return 'What would you like me to help you write?';
  }
} 