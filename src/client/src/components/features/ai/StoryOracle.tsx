import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Flame, RefreshCw } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { useProject } from '@/context/ProjectContext';
import { useAIService } from '@/hooks/useAIService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { HoverGlow } from '@/components/ui/hover-glow';

const StoryOracle: React.FC = () => {
  const { oracleOpen, toggleOracle, currentTool } = useUI();
  const { currentProject } = useProject();
  const { 
    processChatMessage, 
    generateContextualSuggestions, 
    isGenerating, 
    error 
  } = useAIService();
  
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load contextual suggestions when opened or tool changes
  useEffect(() => {
    if (oracleOpen && currentProject && currentTool) {
      loadSuggestions();
    }
  }, [oracleOpen, currentTool, currentProject]);
  
  // Scroll to bottom of chat when history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Load tool-specific suggestions
  const loadSuggestions = async () => {
    if (!currentProject || !currentTool) return;
    
    setIsSuggestionsLoading(true);
    try {
      const newSuggestions = await generateContextualSuggestions(
        currentProject.id,
        currentTool,
        ''
      );
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || isGenerating || !currentProject) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    
    try {
      // Process with AI
      const response = await processChatMessage(
        currentProject.id,
        currentTool || 'general',
        userMessage.content,
        chatHistory
      );
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Failed to process message:', err);
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an error processing your request. Please try again.' 
        }
      ]);
    }
  };
  
  // Handle using a suggestion
  const handleUseSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };
  
  // Get the current tool name for display
  const getToolName = () => {
    switch (currentTool) {
      case 'wizard':
        return 'Story Wizard';
      case 'character':
        return 'Character Workshop';
      case 'realm':
        return 'Realm Crafter';
      case 'artifact':
        return 'Artifact Vault';
      case 'plot':
        return 'Plot Architect';
      case 'chapter':
        return 'Chapter Scribe';
      case 'tome':
        return 'Tome Binder';
      default:
        return 'StoryForge';
    }
  };
  
  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col shadow-lg rounded-2xl overflow-hidden border border-gray-700 bg-gradient-to-tr from-gray-800 to-gray-900 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-2">
          <HoverGlow color="accent">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </HoverGlow>
          <h3 className="font-semibold text-lg">Story Oracle</h3>
          <Badge variant="secondary" className="text-xs bg-purple-900/50">
            {getToolName()}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleOracle}
          className="h-8 w-8 rounded-full hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Welcome message */}
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <HoverGlow color="accent" className="p-6">
              <Sparkles className="h-12 w-12 text-purple-300" />
            </HoverGlow>
            <h3 className="text-xl font-semibold text-gray-100">
              I am the Story Oracle
            </h3>
            <p className="text-sm text-gray-300 max-w-xs">
              Ask me anything about storytelling, or get help with your current project.
              I can see what you're working on and offer personalized guidance.
            </p>
          </div>
        )}
        
        {/* Chat messages */}
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-purple-700/30 text-gray-100' 
                  : 'bg-gray-700/50 text-gray-200'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggestions */}
      {suggestions.length > 0 && chatHistory.length === 0 && (
        <div className="p-3 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Suggestions</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadSuggestions}
              disabled={isSuggestionsLoading}
              className="h-6 w-6 rounded-full"
            >
              <RefreshCw className={`h-3 w-3 ${isSuggestionsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                onClick={() => handleUseSuggestion(suggestion)}
                className="text-xs p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/80">
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask the Oracle..."
              className="min-h-[60px] max-h-[120px] bg-gray-700/50 border-gray-600 resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isGenerating}
            className="h-10 w-10 rounded-full bg-purple-700 hover:bg-purple-600"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-400">
            Error: {error.message || 'Something went wrong'}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StoryOracle;