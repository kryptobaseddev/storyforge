import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { useUI } from '@/context/UIContext';
import { useAIService } from '@/hooks/useAIService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Book, Wand2, Brain } from 'lucide-react';
import { HoverGlow } from '@/components/ui/hover-glow';

const StoryOraclePage: React.FC = () => {
  const { setCurrentTool, setOracleOpen } = useUI();
  const { currentProject } = useProject();
  const { 
    generateContent, 
    generateCharacter, 
    generateSetting, 
    generatePlot, 
    isGenerating,
    error
  } = useAIService();
  
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [currentTab, setCurrentTab] = useState('general');
  
  // Set current tool on component mount
  React.useEffect(() => {
    setCurrentTool('oracle');
    // Close the oracle popup if it's open
    setOracleOpen(false);
  }, [setCurrentTool, setOracleOpen]);
  
  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    try {
      let content = '';
      
      switch (currentTab) {
        case 'character':
          const characterResult = await generateCharacter(prompt);
          content = characterResult.content;
          break;
        case 'setting':
          const settingResult = await generateSetting(prompt);
          content = settingResult.content;
          break;
        case 'plot':
          const plotResult = await generatePlot(prompt);
          content = plotResult.content;
          break;
        default:
          content = await generateContent(prompt, 'general');
          break;
      }
      
      setResult(content);
    } catch (err) {
      console.error('Failed to generate content:', err);
    }
  };
  
  const generatePromptPlaceholder = () => {
    switch (currentTab) {
      case 'character':
        return 'Describe a character you need help developing...';
      case 'setting':
        return 'Describe a setting or world you need help creating...';
      case 'plot':
        return 'Describe a plot or story arc you need help with...';
      default:
        return 'Ask the Oracle for storytelling guidance or advice...';
    }
  };
  
  const renderTabTitle = (title: string, icon: React.ReactNode) => (
    <div className="flex items-center space-x-2">
      {icon}
      <span>{title}</span>
    </div>
  );
  
  return (
    <div className="container mx-auto py-6 px-4 flex-1 overflow-auto">
      <div className="flex flex-col space-y-8">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <HoverGlow color="accent" className="rounded-full p-4">
              <Sparkles className="h-12 w-12 text-purple-300" />
            </HoverGlow>
          </div>
          <h1 className="text-3xl font-bold mb-2">Story Oracle</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The Story Oracle provides AI-powered insights and assistance for your writing journey. 
            Ask questions, get suggestions, or generate new ideas for your story.
          </p>
        </div>
        
        <Card className="p-6 bg-gray-800/60 border-gray-700">
          <Tabs 
            defaultValue="general" 
            value={currentTab} 
            onValueChange={setCurrentTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">
                {renderTabTitle("General", <Brain className="h-4 w-4" />)}
              </TabsTrigger>
              <TabsTrigger value="character">
                {renderTabTitle("Characters", <Sparkles className="h-4 w-4" />)}
              </TabsTrigger>
              <TabsTrigger value="setting">
                {renderTabTitle("Settings", <Book className="h-4 w-4" />)}
              </TabsTrigger>
              <TabsTrigger value="plot">
                {renderTabTitle("Plots", <Wand2 className="h-4 w-4" />)}
              </TabsTrigger>
            </TabsList>
            
            <div className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={generatePromptPlaceholder()}
                className="min-h-[100px] resize-none bg-gray-700/30 border-gray-600"
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-purple-700 hover:bg-purple-600"
                >
                  {isGenerating ? "Consulting the Oracle..." : "Consult the Oracle"}
                </Button>
              </div>
              
              {error && (
                <p className="text-red-400 text-sm">
                  {error.message || "Something went wrong"}
                </p>
              )}
              
              {result && (
                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    Oracle's Response
                  </h3>
                  <div className="bg-gray-700/30 p-4 rounded-lg whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </Card>
        
        <div className="text-center text-gray-500 text-sm">
          <p>
            The Story Oracle uses AI to help you craft your narrative.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryOraclePage;