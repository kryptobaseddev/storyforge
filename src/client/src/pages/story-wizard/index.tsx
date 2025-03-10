import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverGlow } from "@/components/ui/hover-glow";
import { Wand2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StoryWizard: React.FC = () => {
  const { toast } = useToast();

  const handleGenerateStory = () => {
    toast({
      title: "Coming Soon",
      description: "Story generation will be available soon!",
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-spectral font-bold text-white mb-2">Story Wizard</h1>
          <p className="text-gray-400">Begin your epic tale by crafting its foundation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <HoverGlow>
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral text-xl">Project Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Basic information about your story
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Project Name</label>
                    <Input 
                      placeholder="Enter a title for your story" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Genre</label>
                    <Select>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="scifi">Science Fiction</SelectItem>
                        <SelectItem value="mystery">Mystery</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                        <SelectItem value="historical">Historical Fiction</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Brief Description</label>
                    <Textarea 
                      placeholder="What is your story about?" 
                      className="bg-gray-700 border-gray-600 text-white h-32 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </HoverGlow>

            <HoverGlow>
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral text-xl">Story Elements</CardTitle>
                  <CardDescription className="text-gray-400">
                    Define the key components of your tale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Main Theme</label>
                    <Input 
                      placeholder="e.g. Redemption, Power, Love, Survival" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Setting</label>
                    <Input 
                      placeholder="Where does your story take place?" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Time Period</label>
                    <Input 
                      placeholder="When does your story take place?" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Main Conflict</label>
                    <Textarea 
                      placeholder="What is the central conflict or challenge?" 
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </HoverGlow>
          </div>

          <div className="space-y-6">
            <HoverGlow>
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral text-xl">Character Seeds</CardTitle>
                  <CardDescription className="text-gray-400">
                    Lay the groundwork for your key characters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Protagonist</label>
                    <Input 
                      placeholder="Who is your main character?" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea 
                      placeholder="Brief description of your protagonist" 
                      className="bg-gray-700 border-gray-600 text-white h-20 resize-none mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Antagonist</label>
                    <Input 
                      placeholder="Who or what opposes your protagonist?" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea 
                      placeholder="Brief description of your antagonist" 
                      className="bg-gray-700 border-gray-600 text-white h-20 resize-none mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Supporting Character</label>
                    <Input 
                      placeholder="Another important character" 
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea 
                      placeholder="Brief description of this character" 
                      className="bg-gray-700 border-gray-600 text-white h-20 resize-none mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </HoverGlow>

            <HoverGlow color="ember">
              <Card className="bg-gradient-to-br from-gray-800 to-primary-dark/30 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="font-spectral text-xl flex items-center">
                    <Wand2 className="mr-2 h-5 w-5 text-amber-500" />
                    Oracle Assistance
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Let the Oracle help craft your story
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-700/50 rounded-md border border-gray-600">
                    <h3 className="text-sm font-medium text-white mb-2">Generate a Story Seed</h3>
                    <p className="text-xs text-gray-300 mb-3">
                      The Oracle can suggest a complete story concept based on your preferences.
                    </p>
                    <div className="space-y-3 mb-4">
                      <Select>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Preferred genre" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="fantasy">Fantasy</SelectItem>
                          <SelectItem value="scifi">Science Fiction</SelectItem>
                          <SelectItem value="mystery">Mystery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Primary theme" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="redemption">Redemption</SelectItem>
                          <SelectItem value="power">Power & Corruption</SelectItem>
                          <SelectItem value="love">Love & Sacrifice</SelectItem>
                          <SelectItem value="survival">Survival</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleGenerateStory}
                      className="w-full bg-primary hover:bg-primary-dark text-white shadow-[0_0_10px_rgba(255,165,0,0.3)] hover:shadow-[0_0_15px_rgba(255,165,0,0.5)]"
                    >
                      Generate Story Concept
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </HoverGlow>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="outline" className="mr-4 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
            Save Draft
          </Button>
          <Button className="bg-primary hover:bg-primary-dark text-white shadow-[0_0_15px_rgba(93,63,211,0.3)] hover:shadow-[0_0_20px_rgba(93,63,211,0.6)]">
            Continue to Character Workshop
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryWizard;
