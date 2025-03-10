import React, { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { usePlotService } from "@/hooks/usePlotService";
import { Plot, PlotElement } from "@shared/schema";
import { HoverGlow } from "@/components/ui/hover-glow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, Plus, Filter, Search, MoreVertical, Edit, Share, Edit2, ChevronRight, User, MapPin, Gem } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const PlotArchitect: React.FC = () => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  const { plots, isLoading } = usePlotService(currentProject?.id || 0);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample plot data for demonstration
  const samplePlot: Plot = {
    id: 1,
    projectId: currentProject?.id || 1,
    name: "The Crystal of Eternity",
    description: "Thorne's quest to obtain the Crystal of Eternity and the heroes' journey to stop him",
    plotType: "Main Plot",
    structure: "Three-Act Structure",
    iconInitial: "C",
    iconColor: "bg-red-600",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Sample plot elements
  const plotElements: PlotElement[] = [
    {
      id: 1,
      plotId: 1,
      name: "The Prophecy Revealed",
      description: "Luna Moonshadow reveals the ancient prophecy about the Crystal of Eternity",
      elementType: "Inciting Incident",
      sequence: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      plotId: 1,
      name: "First Confrontation",
      description: "Arwen and her companions encounter Thorne's minions in the Whispering Woods",
      elementType: "Rising Action",
      sequence: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      plotId: 1,
      name: "The Map Fragment",
      description: "The heroes discover a fragment of the map leading to the Crystal's location",
      elementType: "Rising Action",
      sequence: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      plotId: 1,
      name: "Betrayal at Mistral",
      description: "A trusted ally betrays the group, revealing themselves as Thorne's spy",
      elementType: "Plot Twist",
      sequence: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      plotId: 1,
      name: "The Dark Tower Confrontation",
      description: "Arwen confronts Thorne in his tower as he attempts to harness the Crystal's power",
      elementType: "Climax",
      sequence: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Use the sample plot if no plot is selected
  React.useEffect(() => {
    if (!selectedPlot && plots.length === 0) {
      setSelectedPlot(samplePlot);
    } else if (!selectedPlot && plots.length > 0) {
      setSelectedPlot(plots[0]);
    }
  }, [plots, selectedPlot]);

  // Filter plots based on search query
  const filteredPlots = plots.filter(
    (plot) =>
      plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plot.plotType && plot.plotType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreatePlot = () => {
    toast({
      title: "Coming Soon",
      description: "Plot creation will be available soon!",
    });
  };

  const handleEditField = (field: string) => {
    toast({
      title: "Coming Soon",
      description: `Editing ${field} will be available soon!`,
    });
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
                onClick={handleCreatePlot}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>New Plot</span>
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
              placeholder="Search plots..."
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col md:flex-row">
        {/* Plots List (Left Panel) */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          {filteredPlots.length === 0 && searchQuery === "" ? (
            <div className="group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center bg-gray-700" onClick={() => setSelectedPlot(samplePlot)}>
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-3">
                <span className="font-spectral text-white">C</span>
              </div>
              <div className="flex-1">
                <h3 className="font-spectral font-medium text-white">The Crystal of Eternity</h3>
                <p className="text-xs text-gray-400">Main Plot • Three-Act</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : filteredPlots.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No plots found</p>
              <p className="text-sm mt-1">Try adjusting your search or create a new plot</p>
            </div>
          ) : (
            filteredPlots.map((plot) => (
              <div
                key={plot.id}
                className={`group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center ${
                  selectedPlot?.id === plot.id ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedPlot(plot)}
              >
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-3">
                  <span className="font-spectral text-white">
                    {plot.iconInitial || plot.name?.charAt(0) || "P"}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-spectral font-medium text-white">{plot.name}</h3>
                  <p className="text-xs text-gray-400">
                    {plot.plotType || "Plot"} • {plot.structure || "Unstructured"}
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

        {/* Plot Details (Right Panel) */}
        {selectedPlot ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Plot Header */}
              <div className="flex flex-col md:flex-row md:items-start mb-8">
                <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                  <div className="w-32 h-32 rounded-lg bg-gray-700 border-4 border-red-600 mb-4 overflow-hidden flex items-center justify-center">
                    <Map className="h-16 w-16 text-red-400 opacity-60" />
                  </div>
                  <button className="text-xs text-gray-400 hover:text-white">Change Image</button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-spectral font-bold text-white">{selectedPlot.name}</h2>
                      <div className="flex items-center mt-1">
                        <span className="text-sm px-3 py-1 rounded-full bg-red-900 text-red-200 mr-2">
                          {selectedPlot.plotType || "Plot"}
                        </span>
                        <span className="text-sm px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                          {selectedPlot.structure || "Unstructured"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        <span>Edit</span>
                      </Button>
                      <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    {selectedPlot.description}
                  </p>
                </div>
              </div>
              
              {/* Tabbed Navigation */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="border-b border-gray-700 mb-6 w-full bg-transparent">
                  <TabsTrigger 
                    value="overview" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'overview' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="elements" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'elements' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Plot Elements
                  </TabsTrigger>
                  <TabsTrigger 
                    value="characters" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'characters' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Characters
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'settings' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Settings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notes" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'notes' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Notes
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        Synopsis
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        The evil sorcerer Thorne Blackwood seeks the mythical Crystal of Eternity, an artifact said to grant its possessor unlimited power and immortality. When the elven ranger Arwen Silverleaf discovers Thorne's plans through an ancient prophecy revealed by her mentor Luna, she assembles a group of allies to prevent him from obtaining the crystal. Their journey takes them through dangerous territories, confrontations with Thorne's minions, and encounters with potential allies. The final confrontation occurs in Thorne's tower as he performs the ritual to harness the Crystal's power.
                      </p>
                      <button 
                        onClick={() => handleEditField('synopsis')}
                        className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </button>
                    </div>
                    
                    <div>
                      <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                          Structure
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-gray-700 rounded p-3">
                            <p className="text-sm font-medium text-white">Act 1: The Call to Adventure</p>
                            <p className="text-xs text-gray-400">Establishment of the world, introduction of Arwen and the revelation of Thorne's plans</p>
                          </div>
                          <div className="bg-gray-700 rounded p-3">
                            <p className="text-sm font-medium text-white">Act 2: The Journey & Trials</p>
                            <p className="text-xs text-gray-400">Assembly of the team, search for the Crystal's location, confrontations with Thorne's forces</p>
                          </div>
                          <div className="bg-gray-700 rounded p-3">
                            <p className="text-sm font-medium text-white">Act 3: The Confrontation</p>
                            <p className="text-xs text-gray-400">Final battle at Blackwood Tower, the fate of the Crystal, and aftermath</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleEditField('structure')}
                          className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </div>
                      
                      <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"></path></svg>
                          Themes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 rounded bg-red-900/50 text-red-200 text-xs">Power & Corruption</span>
                          <span className="px-2 py-1 rounded bg-blue-900/50 text-blue-200 text-xs">Duty vs Desire</span>
                          <span className="px-2 py-1 rounded bg-green-900/50 text-green-200 text-xs">Nature's Balance</span>
                          <span className="px-2 py-1 rounded bg-purple-900/50 text-purple-200 text-xs">Redemption</span>
                          <span className="px-2 py-1 rounded bg-amber-900/50 text-amber-200 text-xs">Sacrifice</span>
                        </div>
                        <button 
                          onClick={() => handleEditField('themes')}
                          className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="elements" className="mt-0">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-spectral font-semibold text-white">Plot Elements</h3>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Element
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {plotElements.map((element) => (
                      <div key={element.id} className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3 text-xs font-bold">
                              {element.sequence}
                            </div>
                            <h4 className="text-lg font-spectral font-medium text-white">{element.name}</h4>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                            {element.elementType}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4">
                          {element.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center bg-blue-900/20 rounded-full pl-1 pr-3 py-1">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mr-1.5">
                              <User className="h-3 w-3 text-blue-100" />
                            </div>
                            <span className="text-xs text-blue-200">Arwen, Luna</span>
                          </div>
                          
                          <div className="flex items-center bg-green-900/20 rounded-full pl-1 pr-3 py-1">
                            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center mr-1.5">
                              <MapPin className="h-3 w-3 text-green-100" />
                            </div>
                            <span className="text-xs text-green-200">Whispering Woods</span>
                          </div>
                          
                          {element.id === 5 && (
                            <div className="flex items-center bg-amber-900/20 rounded-full pl-1 pr-3 py-1">
                              <div className="w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center mr-1.5">
                                <Gem className="h-3 w-3 text-amber-100" />
                              </div>
                              <span className="text-xs text-amber-200">Staff of Dark Whispers</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="characters" className="mt-0">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-spectral font-semibold text-white">Characters in this Plot</h3>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Character
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="font-spectral text-white">A</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-spectral font-medium text-white">Arwen Silverleaf</h4>
                            <p className="text-xs text-gray-400">Protagonist • Elven Ranger</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-200">
                            Hero
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          The main protagonist who discovers Thorne's plans and leads the quest to stop him.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="font-spectral text-white">T</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-spectral font-medium text-white">Thorne Blackwood</h4>
                            <p className="text-xs text-gray-400">Antagonist • Dark Sorcerer</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-200">
                            Villain
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          The primary antagonist seeking the Crystal to gain unlimited power and immortality.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="font-spectral text-white">L</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-spectral font-medium text-white">Luna Moonshadow</h4>
                            <p className="text-xs text-gray-400">Supporting • Mystic</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-200">
                            Mentor
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          A wise mystic who reveals the prophecy and guides Arwen on her journey.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start">
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="font-spectral text-white">K</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-spectral font-medium text-white">Kiran Emberforge</h4>
                            <p className="text-xs text-gray-400">Supporting • Dwarven Smith</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-200">
                            Ally
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          A skilled craftsman who joins Arwen's quest and provides valuable assistance.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-spectral font-semibold text-white">Settings in this Plot</h3>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Setting
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start">
                      <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-spectral font-medium text-white">Whispering Woods</h4>
                            <p className="text-xs text-gray-400">Forest • Mysterious</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-200">
                            Act 1
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          An ancient forest where Luna reveals the prophecy and the first encounter with Thorne's minions occurs.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start">
                      <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-spectral font-medium text-white">City of Mistral</h4>
                            <p className="text-xs text-gray-400">Urban • Trading Hub</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-200">
                            Act 2
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          A bustling port city where the betrayal occurs and the heroes learn crucial information about the Crystal.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-start">
                      <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-spectral font-medium text-white">Blackwood Tower</h4>
                            <p className="text-xs text-gray-400">Fortress • Dark Magic</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-200">
                            Act 3
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          Thorne's ominous fortress where the final confrontation takes place as he attempts to harness the Crystal's power.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-spectral font-semibold text-white mb-4">Plot Notes & Ideas</h3>
                    <Textarea 
                      placeholder="Add your notes about this plot here..." 
                      className="w-full bg-gray-700 border-gray-600 text-white h-48 mb-4 resize-none"
                    />
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      Save Notes
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-800">
            <div className="text-center">
              <h2 className="text-xl font-spectral font-semibold text-white mb-2">
                No Plot Selected
              </h2>
              <p className="text-gray-400 mb-4">
                Select a plot from the list or create a new one.
              </p>
              <Button 
                onClick={handleCreatePlot}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Plot
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotArchitect;
