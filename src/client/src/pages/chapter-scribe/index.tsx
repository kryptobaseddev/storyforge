import React, { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useChapterService } from "@/hooks/useChapterService";
import { Chapter, Scene } from "@shared/schema";
import { HoverGlow } from "@/components/ui/hover-glow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Filter, Search, MoreVertical, Edit, Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ChapterScribe: React.FC = () => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  const { chapters, isLoading } = useChapterService(currentProject?.id || 0);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [isEditing, setIsEditing] = useState(false);
  const [chapterContent, setChapterContent] = useState("");

  // Sample chapter data for demonstration
  const sampleChapter: Chapter = {
    id: 1,
    projectId: currentProject?.id || 1,
    name: "The Gathering Storm",
    content: "The air crackled with unnatural energy as Thorne Blackwood stood at the summit of his obsidian tower. Lightning flashed across the sky, illuminating the sinister curves of his face as he gazed out over the shadowy landscape. The Crystal of Eternity pulsed in his grasp, its radiance casting an otherworldly glow upon the chamber.\n\n\"Soon,\" he whispered to the artifact, his voice barely audible above the howling wind. \"Soon your power will be mine entirely.\"\n\nMiles away, Arwen Silverleaf jolted awake, her heart pounding. The nightmare that had plagued her for weeks had returned with greater intensity. She wiped cold sweat from her brow and rose from her bed, moving to the window of Luna's cottage. In the distance, storm clouds gathered above Blackwood Tower, swirling in an unnatural pattern.\n\n\"It's beginning,\" she murmured, reaching for her bow. \"I need to warn the others.\"",
    sequence: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Sample scenes for the chapter
  const sampleScenes: Scene[] = [
    {
      id: 1,
      chapterId: 1,
      name: "Thorne's Ritual Begins",
      content: "The air crackled with unnatural energy as Thorne Blackwood stood at the summit of his obsidian tower. Lightning flashed across the sky, illuminating the sinister curves of his face as he gazed out over the shadowy landscape. The Crystal of Eternity pulsed in his grasp, its radiance casting an otherworldly glow upon the chamber.\n\n\"Soon,\" he whispered to the artifact, his voice barely audible above the howling wind. \"Soon your power will be mine entirely.\"",
      sequence: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      chapterId: 1,
      name: "Arwen's Vision",
      content: "Miles away, Arwen Silverleaf jolted awake, her heart pounding. The nightmare that had plagued her for weeks had returned with greater intensity. She wiped cold sweat from her brow and rose from her bed, moving to the window of Luna's cottage. In the distance, storm clouds gathered above Blackwood Tower, swirling in an unnatural pattern.\n\n\"It's beginning,\" she murmured, reaching for her bow. \"I need to warn the others.\"",
      sequence: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Use the sample chapter if no chapter is selected
  React.useEffect(() => {
    if (!selectedChapter && chapters.length === 0) {
      setSelectedChapter(sampleChapter);
      setChapterContent(sampleChapter.content);
    } else if (!selectedChapter && chapters.length > 0) {
      setSelectedChapter(chapters[0]);
      setChapterContent(chapters[0].content);
    }
  }, [chapters, selectedChapter]);

  // Filter chapters based on search query
  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChapter = () => {
    toast({
      title: "Coming Soon",
      description: "Chapter creation will be available soon!",
    });
  };

  const handleSaveContent = () => {
    if (selectedChapter) {
      toast({
        title: "Chapter Saved",
        description: "Your chapter has been saved successfully.",
      });
      setIsEditing(false);
    }
  };

  const handleEditContent = () => {
    setIsEditing(true);
  };

  const handleSelectScene = (scene: Scene) => {
    setSelectedScene(scene);
    setChapterContent(scene.content);
    setActiveTab("write");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="border-b border-gray-700 p-4 bg-gray-800">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <HoverGlow color="primary">
              <Button 
                onClick={handleCreateChapter}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>New Chapter</span>
              </Button>
            </HoverGlow>
            <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
          </div>
          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Input
              type="text"
              placeholder="Search chapters..."
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col md:flex-row">
        {/* Chapters List (Left Panel) */}
        <div className="w-full md:w-1/4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          {filteredChapters.length === 0 && searchQuery === "" ? (
            <div className="group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center bg-gray-700" onClick={() => {
              setSelectedChapter(sampleChapter);
              setChapterContent(sampleChapter.content);
              setSelectedScene(null);
            }}>
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <span className="font-spectral text-white">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-spectral font-medium text-white">The Gathering Storm</h3>
                <p className="text-xs text-gray-400">Chapter 1</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No chapters found</p>
              <p className="text-sm mt-1">Try adjusting your search or create a new chapter</p>
            </div>
          ) : (
            filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center ${
                  selectedChapter?.id === chapter.id ? "bg-gray-700" : ""
                }`}
                onClick={() => {
                  setSelectedChapter(chapter);
                  setChapterContent(chapter.content);
                  setSelectedScene(null);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <span className="font-spectral text-white">
                    {chapter.sequence}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-spectral font-medium text-white">{chapter.name}</h3>
                  <p className="text-xs text-gray-400">
                    Chapter {chapter.sequence}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chapter Content (Middle Panel) */}
        {selectedChapter ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-spectral font-bold text-white flex items-center">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2 text-sm">
                    {selectedChapter.sequence}
                  </span>
                  {selectedChapter.name}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <Button 
                    onClick={handleSaveContent}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    <span>Save</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={handleEditContent}
                    variant="secondary" 
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Edit</span>
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="border-b border-gray-700 bg-transparent justify-start">
                <TabsTrigger 
                  value="write" 
                  className={`py-3 px-4 border-b-2 ${activeTab === 'write' ? 'border-purple-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                >
                  Write
                </TabsTrigger>
                <TabsTrigger 
                  value="scenes" 
                  className={`py-3 px-4 border-b-2 ${activeTab === 'scenes' ? 'border-purple-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                >
                  Scenes
                </TabsTrigger>
                <TabsTrigger 
                  value="notes" 
                  className={`py-3 px-4 border-b-2 ${activeTab === 'notes' ? 'border-purple-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger 
                  value="characters" 
                  className={`py-3 px-4 border-b-2 ${activeTab === 'characters' ? 'border-purple-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                >
                  Characters
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="flex-1 p-6 overflow-auto">
                {isEditing ? (
                  <Textarea 
                    value={chapterContent}
                    onChange={(e) => setChapterContent(e.target.value)}
                    className="w-full h-full min-h-[500px] bg-gray-700 border-gray-600 text-white p-4 leading-relaxed font-spectral resize-none focus:ring-purple-500"
                  />
                ) : (
                  <div className="prose prose-invert max-w-none font-spectral text-gray-300 whitespace-pre-line">
                    {chapterContent}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="scenes" className="p-6 overflow-auto">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-xl font-spectral font-semibold text-white">Scenes in this Chapter</h3>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Scene
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {sampleScenes.map((scene) => (
                    <div 
                      key={scene.id} 
                      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer hover:border-purple-500 transition-colors ${
                        selectedScene?.id === scene.id ? 'border-purple-500 bg-gray-700' : ''
                      }`}
                      onClick={() => handleSelectScene(scene)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2 text-xs font-bold">
                            {scene.sequence}
                          </div>
                          <h4 className="font-spectral font-medium text-white">{scene.name}</h4>
                        </div>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-3">
                        {scene.content.slice(0, 150)}...
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-200 rounded-full">Arwen</span>
                        <span className="text-xs px-2 py-0.5 bg-red-900/30 text-red-200 rounded-full">Thorne</span>
                        <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-200 rounded-full">Luna's Cottage</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="p-6 overflow-auto">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-spectral font-semibold text-white mb-4">Chapter Notes</h3>
                  <Textarea 
                    placeholder="Add notes about this chapter here..." 
                    className="w-full bg-gray-700 border-gray-600 text-white h-48 mb-4 resize-none"
                  />
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Save Notes
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="characters" className="p-6 overflow-auto">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-xl font-spectral font-semibold text-white">Characters in this Chapter</h3>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Character
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <span className="font-spectral text-white">A</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-spectral font-medium text-white">Arwen Silverleaf</h4>
                      <p className="text-xs text-gray-400">
                        Protagonist • Elven Ranger
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-3">
                      <span className="font-spectral text-white">T</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-spectral font-medium text-white">Thorne Blackwood</h4>
                      <p className="text-xs text-gray-400">
                        Antagonist • Dark Sorcerer
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                      <span className="font-spectral text-white">L</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-spectral font-medium text-white">Luna Moonshadow</h4>
                      <p className="text-xs text-gray-400">
                        Supporting • Mystic
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-800">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-spectral font-semibold text-white mb-2">
                No Chapter Selected
              </h2>
              <p className="text-gray-400 mb-4">
                Select a chapter from the list or create a new one.
              </p>
              <Button 
                onClick={handleCreateChapter}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Chapter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterScribe;
