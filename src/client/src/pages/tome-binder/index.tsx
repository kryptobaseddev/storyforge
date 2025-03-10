import React, { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useChapterService } from "@/hooks/useChapterService";
import { HoverGlow } from "@/components/ui/hover-glow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Book, 
  FileText, 
  Download, 
  Settings, 
  FilePlus2, 
  Check, 
  Copy, 
  Pencil,
  BookOpen,
  Plus,
  MoveRight,
  CheckCircle2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const TomeBinder: React.FC = () => {
  const { currentProject } = useProject();
  const { chapters, isLoading } = useChapterService(currentProject?.id || 0);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("compile");
  const [bookTitle, setBookTitle] = useState(currentProject?.name || "Untitled Project");
  const [authorName, setAuthorName] = useState("Jessica Writer");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  
  // Export settings
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includeChapterNumbers, setIncludeChapterNumbers] = useState(true);
  const [includeFrontMatter, setIncludeFrontMatter] = useState(true);
  const [includeBackMatter, setIncludeBackMatter] = useState(true);
  const [customPageSize, setCustomPageSize] = useState("a5");
  const [fontFamily, setFontFamily] = useState("serif");
  const [fontSize, setFontSize] = useState("12");
  
  // Sample chapters data when none is available from service
  const sampleChapters = [
    {
      id: 1,
      name: "The Gathering Storm",
      sequence: 1,
      selected: true
    },
    {
      id: 2,
      name: "Shadows in the Forest",
      sequence: 2,
      selected: true
    },
    {
      id: 3,
      name: "The Unexpected Ally",
      sequence: 3,
      selected: true
    },
    {
      id: 4,
      name: "Secrets Revealed",
      sequence: 4,
      selected: true
    },
    {
      id: 5,
      name: "The Dark Tower",
      sequence: 5,
      selected: true
    }
  ];
  
  const [selectedChapters, setSelectedChapters] = useState<{id: number, name: string, sequence: number, selected: boolean}[]>(
    sampleChapters
  );
  
  const [frontMatter, setFrontMatter] = useState({
    dedication: "For my family, who always believed in me.",
    acknowledgments: "I would like to thank my writing group for their unwavering support and constructive feedback throughout the creation of this story.",
    foreword: "This tale began as a simple idea during a stormy night...",
  });
  
  const [backMatter, setBackMatter] = useState({
    epilogue: "Years later, the legends of the Crystal of Eternity would still be told around fires on cold winter nights...",
    aboutAuthor: "Jessica Writer lives in a small cottage near the woods with her three cats and an overflowing library. This is her first novel.",
    preview: "Coming soon: The sequel to this epic adventure...",
  });

  const handleExport = () => {
    toast({
      title: "Preparing Export",
      description: "Your manuscript is being compiled...",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${bookTitle} has been exported as ${selectedFormat.toUpperCase()}`,
        variant: "success",
      });
    }, 2000);
  };

  const handleChapterToggle = (id: number) => {
    setSelectedChapters(prev => 
      prev.map(chapter => 
        chapter.id === id ? { ...chapter, selected: !chapter.selected } : chapter
      )
    );
  };

  const handleSelectAllChapters = () => {
    setSelectedChapters(prev => 
      prev.map(chapter => ({ ...chapter, selected: true }))
    );
  };

  const handleDeselectAllChapters = () => {
    setSelectedChapters(prev => 
      prev.map(chapter => ({ ...chapter, selected: false }))
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-spectral font-bold text-white mb-2 flex items-center">
            <Book className="mr-3 h-8 w-8 text-green-400" />
            Tome Binder
          </h1>
          <p className="text-gray-400">Compile and export your epic tale into various formats</p>
        </div>

        <Tabs defaultValue="compile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-gray-700 mb-6">
            <TabsTrigger value="compile" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
              <Book className="h-4 w-4 mr-2" />
              Compile
            </TabsTrigger>
            <TabsTrigger value="metadata" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Front & Back Matter
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-green-700 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Export Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="compile" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="font-spectral flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-green-400" />
                      Content Selection
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Choose which chapters to include in your export
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSelectAllChapters}
                        className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDeselectAllChapters}
                        className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Deselect All
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {selectedChapters.map((chapter) => (
                        <div 
                          key={chapter.id} 
                          className="flex items-center justify-between p-3 bg-gray-750 rounded-md border border-gray-700 hover:border-green-500 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-3">
                              <span className="font-spectral text-white">{chapter.sequence}</span>
                            </div>
                            <div>
                              <h3 className="font-spectral font-medium text-white">{chapter.name}</h3>
                              <p className="text-xs text-gray-400">Chapter {chapter.sequence}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                chapter.selected 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              }`}
                              onClick={() => handleChapterToggle(chapter.id)}
                            >
                              {chapter.selected && <Check className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <HoverGlow color="ember">
                  <Card className="bg-gray-800 border-gray-700 text-white h-full">
                    <CardHeader>
                      <CardTitle className="font-spectral">Export Preview</CardTitle>
                      <CardDescription className="text-gray-400">
                        Review and export your manuscript
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-[3/4] bg-white rounded-md shadow-md mx-auto mb-6 flex flex-col max-w-[240px]">
                        <div className="bg-green-700 h-2/3 flex items-center justify-center relative">
                          <div className="text-center p-6">
                            <h3 className="font-spectral font-bold text-white text-xl mb-2">{bookTitle}</h3>
                            <p className="text-green-100 text-sm">by {authorName}</p>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Book className="h-8 w-8 text-white opacity-50" />
                          </div>
                        </div>
                        <div className="bg-white flex-1 p-4">
                          <div className="w-full h-2 bg-gray-200 mb-2 rounded-full"></div>
                          <div className="w-3/4 h-2 bg-gray-200 mb-3 rounded-full"></div>
                          <div className="w-full h-2 bg-gray-200 mb-2 rounded-full"></div>
                          <div className="w-5/6 h-2 bg-gray-200 mb-2 rounded-full"></div>
                          <div className="w-full h-2 bg-gray-200 mb-2 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Title</label>
                          <Input 
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Author</label>
                          <Input 
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Export Format</label>
                          <Select 
                            value={selectedFormat} 
                            onValueChange={setSelectedFormat}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                              <SelectItem value="epub">EPUB E-Book (.epub)</SelectItem>
                              <SelectItem value="docx">Word Document (.docx)</SelectItem>
                              <SelectItem value="html">Web Page (.html)</SelectItem>
                              <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            onClick={handleExport}
                            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(84,204,22,0.3)] hover:shadow-[0_0_20px_rgba(84,204,22,0.5)]"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export Manuscript
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverGlow>
              </div>
            </div>
            
            <div className="mt-6">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-400" />
                    Export Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-750 rounded-lg border border-gray-700">
                      <h3 className="font-spectral font-medium text-white mb-2 flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        Content Selection
                      </h3>
                      <p className="text-sm text-gray-300">
                        Selected {selectedChapters.filter(ch => ch.selected).length} of {selectedChapters.length} chapters
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-750 rounded-lg border border-gray-700">
                      <h3 className="font-spectral font-medium text-white mb-2 flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        Front Matter
                      </h3>
                      <p className="text-sm text-gray-300">
                        {includeFrontMatter ? 'Included' : 'Not included'} • {Object.keys(frontMatter).length} sections
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-750 rounded-lg border border-gray-700">
                      <h3 className="font-spectral font-medium text-white mb-2 flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        Back Matter
                      </h3>
                      <p className="text-sm text-gray-300">
                        {includeBackMatter ? 'Included' : 'Not included'} • {Object.keys(backMatter).length} sections
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-750 rounded-lg border border-gray-700">
                      <h3 className="font-spectral font-medium text-white mb-2 flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        Table of Contents
                      </h3>
                      <p className="text-sm text-gray-300">
                        {includeTableOfContents ? 'Included' : 'Not included'} • Auto-generated
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-750 rounded-lg border border-gray-700">
                      <h3 className="font-spectral font-medium text-white mb-2 flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        Formatting
                      </h3>
                      <p className="text-sm text-gray-300">
                        {fontFamily} • {fontSize}pt • {customPageSize.toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-750 rounded-lg border border-gray-700">
                      <h3 className="font-spectral font-medium text-white mb-2 flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        Export Format
                      </h3>
                      <p className="text-sm text-gray-300">
                        {selectedFormat.toUpperCase()} • Ready for publishing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral flex items-center">
                    <FilePlus2 className="mr-2 h-5 w-5 text-green-400" />
                    Front Matter
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Content that appears before the main text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Dedication</label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      value={frontMatter.dedication}
                      onChange={(e) => setFrontMatter({ ...frontMatter, dedication: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Acknowledgments</label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      value={frontMatter.acknowledgments}
                      onChange={(e) => setFrontMatter({ ...frontMatter, acknowledgments: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Foreword</label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      value={frontMatter.foreword}
                      onChange={(e) => setFrontMatter({ ...frontMatter, foreword: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Section
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-green-400" />
                    Back Matter
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Content that appears after the main text
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Epilogue</label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      value={backMatter.epilogue}
                      onChange={(e) => setBackMatter({ ...backMatter, epilogue: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">About the Author</label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      value={backMatter.aboutAuthor}
                      onChange={(e) => setBackMatter({ ...backMatter, aboutAuthor: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">Next Book Preview</label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      value={backMatter.preview}
                      onChange={(e) => setBackMatter({ ...backMatter, preview: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Section
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral">Book Metadata</CardTitle>
                  <CardDescription className="text-gray-400">
                    Additional information for publishing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">ISBN</label>
                        <Input 
                          placeholder="e.g. 978-3-16-148410-0" 
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Publisher</label>
                        <Input 
                          placeholder="Publisher name" 
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Publication Date</label>
                        <Input 
                          type="date" 
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Language</label>
                        <Select defaultValue="en">
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Genre</label>
                        <Select defaultValue="fantasy">
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="fantasy">Fantasy</SelectItem>
                            <SelectItem value="scifi">Science Fiction</SelectItem>
                            <SelectItem value="mystery">Mystery</SelectItem>
                            <SelectItem value="romance">Romance</SelectItem>
                            <SelectItem value="horror">Horror</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Tags</label>
                        <Input 
                          placeholder="adventure, magic, coming-of-age" 
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral">Structure Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure how your book is organized
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="toc">Table of Contents</Label>
                        <p className="text-sm text-gray-400">Include an auto-generated table of contents</p>
                      </div>
                      <Switch 
                        id="toc" 
                        checked={includeTableOfContents}
                        onCheckedChange={setIncludeTableOfContents}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="numbers">Chapter Numbers</Label>
                        <p className="text-sm text-gray-400">Add chapter numbers to chapter titles</p>
                      </div>
                      <Switch 
                        id="numbers" 
                        checked={includeChapterNumbers}
                        onCheckedChange={setIncludeChapterNumbers}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="frontmatter">Front Matter</Label>
                        <p className="text-sm text-gray-400">Include dedication, acknowledgments, etc.</p>
                      </div>
                      <Switch 
                        id="frontmatter" 
                        checked={includeFrontMatter}
                        onCheckedChange={setIncludeFrontMatter}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="backmatter">Back Matter</Label>
                        <p className="text-sm text-gray-400">Include epilogue, about author, etc.</p>
                      </div>
                      <Switch 
                        id="backmatter" 
                        checked={includeBackMatter}
                        onCheckedChange={setIncludeBackMatter}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="chapterstyle" className="text-sm font-medium text-gray-300 mb-2 block">Chapter Title Style</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="chapterstyle" className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="standard">Standard (Chapter One)</SelectItem>
                          <SelectItem value="numbered">Numbered (1)</SelectItem>
                          <SelectItem value="custom">Custom Names Only</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral">Format Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure the appearance of your exported book
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="pagesize" className="text-sm font-medium text-gray-300 mb-2 block">Page Size</Label>
                      <Select 
                        id="pagesize" 
                        value={customPageSize}
                        onValueChange={setCustomPageSize}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select page size" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="a4">A4 (210mm × 297mm)</SelectItem>
                          <SelectItem value="a5">A5 (148mm × 210mm)</SelectItem>
                          <SelectItem value="letter">US Letter (8.5" × 11")</SelectItem>
                          <SelectItem value="6x9">Paperback (6" × 9")</SelectItem>
                          <SelectItem value="5x8">Compact (5" × 8")</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="font" className="text-sm font-medium text-gray-300 mb-2 block">Font Family</Label>
                      <Select 
                        id="font" 
                        value={fontFamily}
                        onValueChange={setFontFamily}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="serif">Serif (Times New Roman)</SelectItem>
                          <SelectItem value="sans">Sans-serif (Arial)</SelectItem>
                          <SelectItem value="spectral">Spectral</SelectItem>
                          <SelectItem value="georgia">Georgia</SelectItem>
                          <SelectItem value="garamond">Garamond</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="fontsize" className="text-sm font-medium text-gray-300 mb-2 block">Font Size</Label>
                      <Select 
                        id="fontsize" 
                        value={fontSize}
                        onValueChange={setFontSize}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="10">10 pt</SelectItem>
                          <SelectItem value="11">11 pt</SelectItem>
                          <SelectItem value="12">12 pt</SelectItem>
                          <SelectItem value="14">14 pt</SelectItem>
                          <SelectItem value="16">16 pt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="lineheight" className="text-sm font-medium text-gray-300 mb-2 block">Line Height</Label>
                      <Select defaultValue="1.5">
                        <SelectTrigger id="lineheight" className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select line height" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="1.0">Single (1.0)</SelectItem>
                          <SelectItem value="1.15">Comfortable (1.15)</SelectItem>
                          <SelectItem value="1.5">Relaxed (1.5)</SelectItem>
                          <SelectItem value="2.0">Double (2.0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="margins" className="text-sm font-medium text-gray-300 mb-2 block">Margins</Label>
                      <Select defaultValue="normal">
                        <SelectTrigger id="margins" className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select margins" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="narrow">Narrow (0.5")</SelectItem>
                          <SelectItem value="normal">Normal (1")</SelectItem>
                          <SelectItem value="wide">Wide (1.5")</SelectItem>
                          <SelectItem value="mirrored">Mirrored</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral">Format Preview</CardTitle>
                  <CardDescription className="text-gray-400">
                    See how your formatting choices will look
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white text-gray-900 rounded-lg p-8 max-w-3xl mx-auto">
                    <div className="text-center mb-6">
                      <h1 className={`font-bold text-2xl mb-1 font-${fontFamily === 'spectral' ? 'spectral' : fontFamily}`}>CHAPTER ONE</h1>
                      <h2 className={`font-semibold text-xl font-${fontFamily === 'spectral' ? 'spectral' : fontFamily}`}>The Gathering Storm</h2>
                      <div className="w-16 h-1 bg-gray-300 mx-auto mt-4"></div>
                    </div>
                    
                    <p className={`font-${fontFamily === 'spectral' ? 'spectral' : fontFamily} text-${fontSize === '12' ? 'base' : fontSize === '10' ? 'sm' : 'lg'} leading-relaxed mb-4`}>
                      The air crackled with unnatural energy as Thorne Blackwood stood at the summit of his obsidian tower. Lightning flashed across the sky, illuminating the sinister curves of his face as he gazed out over the shadowy landscape. The Crystal of Eternity pulsed in his grasp, its radiance casting an otherworldly glow upon the chamber.
                    </p>
                    
                    <p className={`font-${fontFamily === 'spectral' ? 'spectral' : fontFamily} text-${fontSize === '12' ? 'base' : fontSize === '10' ? 'sm' : 'lg'} leading-relaxed`}>
                      "Soon," he whispered to the artifact, his voice barely audible above the howling wind. "Soon your power will be mine entirely."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end">
              <HoverGlow color="ember">
                <Button 
                  onClick={handleExport}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(84,204,22,0.3)] hover:shadow-[0_0_20px_rgba(84,204,22,0.5)]"
                >
                  <MoveRight className="mr-2 h-4 w-4" />
                  Continue to Export
                </Button>
              </HoverGlow>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TomeBinder;
