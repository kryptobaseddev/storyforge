import { 
  User, Project, Character, Setting, 
  Object as StoryObject, Plot, PlotElement, 
  Chapter, Scene
} from "@shared/schema";

export type CharacterRole = 'Protagonist' | 'Antagonist' | 'Ally' | 'Mentor' | 'Supporting';

export type CharacterMotivation = {
  text: string;
  type: string;
};

export type StoryConnection = {
  id: number;
  type: 'plot' | 'setting' | 'object' | 'chapter';
  name: string;
  subtext: string;
  color: string;
  icon: string;
};

export type CharacterWithConnections = Character & {
  connections?: StoryConnection[];
};

export type ProjectWithDetails = Project & {
  characters?: Character[];
  settings?: Setting[];
  objects?: StoryObject[];
  plots?: Plot[];
  chapters?: Chapter[];
};

export type ToolType = 
  | 'wizard'
  | 'character'
  | 'realm'
  | 'artifact'
  | 'plot'
  | 'chapter'
  | 'oracle'
  | 'tome';

export type NavItem = {
  name: string;
  path: string;
  icon: string;
  type: ToolType;
  color: string;
};

export type AIAssistance = {
  message: string;
  suggestions: string[];
  currentTool: ToolType;
};
