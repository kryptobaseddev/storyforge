"use strict";
/**
 * Character Creation Template
 *
 * This template is used to generate a new character for a story based on
 * provided parameters such as genre, role, and traits.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCharacterTemplate = exports.createCharacterTemplate = void 0;
const createCharacterTemplate = ({ genre, audience, role = 'character', name, age_range, key_traits = [], setting_description, related_characters = [], narrative_importance = 'supporting', }) => `
Create a character for a ${genre} story appropriate for ${audience} readers.

${name ? `The character's name is ${name}.` : 'Please provide a suitable name for the character.'}
${role ? `The character should serve as a ${role} in the narrative.` : ''}
${age_range ? `The character should be in the following age range: ${age_range}.` : ''}
${key_traits.length > 0 ? `The character should have the following key traits: ${key_traits.join(', ')}.` : ''}
${setting_description ? `This character should fit naturally in the following setting: ${setting_description}` : ''}
${related_characters.length > 0 ? `This character should have meaningful connections to the following characters: ${related_characters.join(', ')}.` : ''}
${narrative_importance ? `This character has ${narrative_importance} importance to the overall narrative.` : ''}

This character should:
1. Be well-rounded with strengths and flaws
2. Have clear motivations that drive their actions
3. Have a distinctive voice and personality
4. Be relatable and believable
5. Have potential for growth or change throughout the story

Return the character in the following JSON format:
{
  "name": "Character Name",
  "shortDescription": "One sentence description",
  "background": "Character backstory (3-5 sentences)",
  "physicalTraits": ["trait1", "trait2", "trait3"],
  "personalityTraits": ["trait1", "trait2", "trait3"],
  "goals": ["primary goal", "secondary goal"],
  "fears": ["primary fear", "secondary fear"],
  "skills": ["skill1", "skill2"],
  "voice": "Brief description of how this character speaks",
  "role": "Role in the story",
  "relationships": [
    {
      "with": "Related character name or 'potential'",
      "type": "Relationship type (friend, enemy, mentor, etc.)",
      "dynamics": "Brief description of relationship dynamics"
    }
  ],
  "arc": "Potential character arc or development path"
}

Make sure all content is age-appropriate for ${audience} readers and fits well with the ${genre} genre.
`;
exports.createCharacterTemplate = createCharacterTemplate;
const expandCharacterTemplate = ({ genre, audience, existing_character, expansion_focus, setting_description, related_characters = [], }) => `
Expand the character "${existing_character.name}" for a ${genre} story appropriate for ${audience} readers.

Current information about the character:
${existing_character.description}
${existing_character.background ? `Background: ${existing_character.background}` : ''}
${existing_character.traits && existing_character.traits.length > 0
    ? `Known traits: ${existing_character.traits.join(', ')}`
    : ''}

${setting_description ? `This character exists in the following setting: ${setting_description}` : ''}
${related_characters.length > 0 ? `This character has relationships with: ${related_characters.join(', ')}` : ''}

Focus on developing the character's ${expansion_focus}.

${expansion_focus === 'background' ? 'Provide a detailed backstory that explains how the character became who they are today. Include formative experiences, key relationships, and pivotal moments.' : ''}
${expansion_focus === 'relationships' ? 'Develop the character\'s relationships with others. Create connections that are complex, meaningful, and have potential for conflict or growth.' : ''}
${expansion_focus === 'development' ? 'Outline a potential character arc or development path. How might this character change over the course of the story? What events might trigger this growth?' : ''}
${expansion_focus === 'details' ? 'Add rich, specific details about the character\'s personality, habits, preferences, mannerisms, and quirks that make them unique and memorable.' : ''}

Return the expanded character details in JSON format, focusing on the ${expansion_focus} aspect.

Make sure all content is age-appropriate for ${audience} readers and fits well with the ${genre} genre.
`;
exports.expandCharacterTemplate = expandCharacterTemplate;
