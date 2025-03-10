# Plot Architect: Design Schema and User Flow

## Core Principles

The Plot Architect should serve as a guided framework for users to create coherent story structures while maintaining creative flexibility. This document outlines the design principles, rules, and user flow for the Plot Architect tool.

## Plot Hierarchy and Rules

### Plot Types and Hierarchy

1. **Main Plot**
   - Each project should have exactly one Main Plot
   - Serves as the primary storyline and central conflict
   - All other plots (Subplots and Character Arcs) should connect to the Main Plot

2. **Subplots**
   - Multiple Subplots are allowed (recommended limit: 2-5 for manageability)
   - Must connect to either the Main Plot or to another Subplot
   - Connection rules:
     - "Supports" - develops or enhances the Main Plot
     - "Contrasts" - provides thematic counterpoint
     - "Complicates" - adds complexity or obstacles

3. **Character Arcs**
   - One Character Arc per major character (recommended)
   - Must be linked to at least one character in the Character schema
   - Should connect to either the Main Plot or a relevant Subplot
   - Connection rules:
     - "Drives" - character actions drive this plot
     - "Responds" - character grows/changes in response to plot events
     - "Parallel" - character journey mirrors plot developments

### Structure Implementation Rules

1. **Structure Consistency**
   - The Main Plot should follow one primary structure (e.g., Three-Act, Hero's Journey)
   - Subplots and Character Arcs can use different structures than the Main Plot
   - The system should warn users when mixing fundamentally incompatible structures

2. **Plot Element Requirements**
   - Each Plot Type + Structure combination has mandatory elements:
     - Three-Act: requires Setup, Inciting Incident, Rising Action, Climax, Resolution
     - Hero's Journey: requires Ordinary World, Call to Adventure, etc.
     - Other structures: appropriate required elements based on structure

3. **Chronological Integrity**
   - Plot elements have sequential order property
   - System should validate logical ordering of events
   - Warn users when subplot elements occur after Main Plot resolution

4. **Plot Connections**
   - Subplots and Character Arcs link to the Main Plot via the relatedPlots field
   - Plots can have direct connections to specific Plot Elements in other Plots
   - Plot Elements can be synchronized across plots for connected story moments

## Integration with Other Schemas

### Characters Integration

1. **Character Linking**
   - Each Plot Element can link to characters via the `characters` array
   - Character Arcs must link to at least one character from the Characters schema
   - System recommends character pairings for Plot Elements based on their role and arc

2. **Character Visibility**
   - Main characters should appear in a minimum threshold of Plot Elements
   - System warns if a character disappears for too many sequential Plot Elements
   - Provides analysis of character usage across the story structure

### Settings Integration

1. **Setting Linking**
   - Plot Elements link to settings via the `settings` array
   - System validates setting continuity (warns about impossible jumps)
   - Recommends setting transitions between sequential Plot Elements
   - Suggests objects that would naturally exist in the setting for plot use

### Chapter/Scene Integration

1. **Plot-to-Chapter Mapping**
   - Plot Elements can be mapped to specific chapters/scenes
   - Multiple Plot Elements can occur within a single chapter
   - System shows coverage view of Plot Elements across chapters

## User Flow

### 1. Initial Plot Setup

```
Start → Create Project → Create Main Plot → Select Structure → 
Define Key Plot Elements → Link Characters, Settings & Objects
```

1. **Structure Selection Guidance**
   - Present structure options with brief descriptions
   - Offer recommendations based on genre and narrative type
   - Provide visual template of structure with example elements

2. **Auto-Generated Elements**
   - Generate starter Plot Elements based on selected structure
   - Pre-populate with generic descriptions that user can modify
   - Auto-assign logical order numbers

### 2. Subplot and Character Arc Creation

```
Main Plot Created → Add Subplot/Character Arc → 
Select Relationship to Main Plot → Select Structure → 
Define Elements → Link to Main Plot Elements → Assign Relevant Objects
```

1. **Relationship Selection**
   - Guide user to define relationship between plots
   - Visualization shows how plots intersect
   - Recommend potential connection points

2. **Character Arc Specialized Flow**
   - If Character Arc selected, prompt for character selection first
   - Suggest arc type based on character traits (redemption, growth, fall, etc.)
   - Provide structure options best suited for that arc type

### 3. Plot Management and Refinement

```
All Plots Created → Plot Overview Dashboard → 
Visualize Interconnections → Identify Gaps/Issues → 
Refine and Balance
```

1. **Plot Balancing Tools**
   - Analyze distribution of plot elements across narrative
   - Highlight potential pacing issues
   - Show character presence/absence patterns

2. **Plot Health Check**
   - Validate structural integrity based on chosen structures
   - Warn about abandoned subplots
   - Check for unresolved plot elements

## Interface Components

### 1. Plot Architect Dashboard

- **Plot Hierarchy Visualization**
  - Tree-view showing Main Plot, Subplots, and Character Arcs
  - Visual indicators for plot status and completion
  - Drag-and-drop interface for adjusting relationships

- **Structure Templates Panel**
  - Visual representations of each structure type
  - Highlight required vs. optional elements
  - "Apply Template" button to auto-generate elements

### 2. Plot Element Editor

- **Element Type Selector**
  - Context-aware options based on selected structure
  - Visual position indicator in overall structure

- **Connection Manager**
  - Interface to link to characters, settings, and objects
  - Relationship visualization to other plot elements
  - Timeline view showing element position in narrative

### 3. Plot Timeline View

- **Chronological Display**
  - All plots shown on parallel timelines
  - Vertical alignment shows simultaneous events
  - Zoom controls for focus on specific segments
  - Object trajectory tracking across the timeline

- **Element Inspector**
  - Detailed view of selected element
  - Shows all connections and dependencies
  - Edit capabilities within timeline view
  - Object involvement and transfers visualization

## Implementation Guidelines

### Plot Structure Templates

For each structure type, define a template with:

1. **Required Elements**
   - List of mandatory element types
   - Suggested order and relative position
   - Default descriptions

2. **Optional Elements**
   - Additional elements that enhance the structure
   - Placement recommendations

3. **Structure-Specific Rules**
   - Validation rules specific to the structure
   - Pacing guidelines (e.g., midpoint should be ~50% through)

### Plot Element Type Mapping

Map the generic `plotElementTypeEnum` to structure-specific elements:

#### Three-Act Structure
- Setup → Setup
- Inciting Incident → Inciting Incident
- Rising Action → Rising Action
- Complications → Rising Action (multiple)
- Midpoint → Midpoint
- Crisis → Crisis
- Climax → Climax
- Resolution → Resolution

#### Hero's Journey
- Setup → Ordinary World
- Inciting Incident → Call to Adventure
- Custom → Refusal of the Call
- Custom → Meeting the Mentor
- Rising Action → Tests, Allies, and Enemies
- Midpoint → Approach to Inmost Cave
- Crisis → Ordeal
- Custom → Reward
- Complications → The Road Back
- Climax → Resurrection
- Resolution → Return with Elixir

*Similar mappings for other structure types...*

## Rules for Plot Relationships

### Main Plot to Subplot Relationships

1. **Support Relationship**
   - Subplot provides context or depth to Main Plot
   - Subplot resolution should occur before or during Main Plot climax
   - Characters can overlap between plots

2. **Contrast Relationship**
   - Subplot presents alternative perspective to Main Plot
   - Thematic elements should deliberately counterpoint
   - Resolution may provide commentary on Main Plot

3. **Complication Relationship**
   - Subplot introduces obstacles to Main Plot resolution
   - Key subplot moments should align with Main Plot decision points
   - Resolution must affect Main Plot trajectory

### Character Arc to Plot Relationships

1. **Driver Relationship**
   - Character's decisions actively shape plot direction
   - Character's strengths/flaws should be evident in plot elements
   - Plot resolution dependent on character growth

2. **Responder Relationship**
   - Plot events force character change
   - Character grows in response to plot challenges
   - Character transformation mirrors plot structure

## Validation Rules and Warnings

### Critical Validation Rules
- Main Plot missing essential structure elements
- Character Arc not linked to a character
- Plot elements with missing descriptions
- Subplots not connected to Main Plot

### Warning-Level Validation
- Character disappears for multiple consecutive elements
- Setting changes without transition elements
- Subplot resolution occurs after Main Plot resolution
- Pacing issues (too many elements clustered together)
- Elements missing character or setting links

## Plot Architect User Guidance

### Plot Structure Selection Guide

Provide contextual recommendations based on:

1. **Genre Factors**
   - Fantasy/Adventure: Hero's Journey, Three-Act
   - Mystery/Thriller: Fichtean Curve, Save the Cat
   - Character-driven Drama: Freytag's Pyramid, Seven-Point
   - Experimental/Literary: Custom structure

2. **Narrative Type Factors**
   - Short Story: Freytag's Pyramid, Seven-Point
   - Novel: Three-Act, Hero's Journey
   - Screenplay: Save the Cat, Three-Act
   - Comic: Hero's Journey, Three-Act
   - Poem: Custom, Freytag's Pyramid

### Structure Compatibility Guide

Provide guidance on mixing structures:

1. **Compatible Combinations**
   - Main Plot (Three-Act) + Subplot (Seven-Point)
   - Main Plot (Hero's Journey) + Character Arc (Seven-Point)
   - Main Plot (Save the Cat) + Subplot (Three-Act)

2. **Challenging Combinations**
   - Main Plot (Fichtean Curve) + Subplot (Freytag's Pyramid)
   - Main Plot (Hero's Journey) + Character Arc (Fichtean Curve)

### Plot Element Suggestions

Provide contextual suggestions for:

1. **Element Descriptions**
   - Templates based on genre and structure
   - Examples from similar stories
   - Prompts for key information to include

2. **Character Linking**
   - Suggest characters who should be present based on:
     - Previous element appearances
     - Character role in story
     - Character arc stage
     - Possession of plot-relevant objects

3. **Setting Recommendations**
   - Suggest appropriate settings based on:
     - Plot element type
     - Previous and next settings
     - Thematic requirements
     - Objects required for the scene

4. **Object Suggestions**
   - Recommend objects to include based on:
     - Plot element requirements
     - Character possessions
     - Setting appropriateness
     - Thematic significance

## Technical Implementation Notes

### Data Relationships

1. **Direct References vs. ObjectId**
   - Use ObjectId for database references
   - Use direct references for UI state management

2. **Event Synchronization**
   - Maintain event ordering across plot timelines
   - Detect and warn about temporal paradoxes

3. **Plot Template Library**
   - Maintain predefined templates for each structure
   - Allow users to save custom templates

### Performance Considerations

1. **Large Project Handling**
   - Implement pagination for projects with many plots
   - Lazy load plot elements when viewing timelines

2. **Real-Time Validation**
   - Run critical validations in real-time
   - Schedule comprehensive validations as background task

## Conclusion

The Plot Architect tool should balance structure with flexibility, providing guidance without limiting creativity. By implementing these rules and user flows, the system will help users create coherent, well-structured stories while maintaining their unique vision.