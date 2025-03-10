import { useState } from 'react';
import { Character, CreateCharacterInput } from '@/schemas';

// TODO: Fix the form to use the proper Character Schema
interface CharacterFormProps {
  initialData?: Partial<Character>;
  projectId: string;
  onSubmit: (data: CreateCharacterInput, projectId: string) => void;
  onCancel: () => void;
}

export function CharacterForm({
  initialData,
  projectId,
  onSubmit,
  onCancel,
}: CharacterFormProps) {
  const [character, setCharacter] = useState<CreateCharacterInput>({
    name: initialData?.name || '',
    role: initialData?.role || '',
    shortDescription: initialData?.shortDescription || '',
    detailedBackground: initialData?.detailedBackground || '',
    possessions: initialData?.possessions || [],
    // Initialize other fields as needed
  });

  const [trait, setTrait] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTrait = () => {
    if (trait.trim()) {
      // Add trait to attributes if it doesn't exist
      setCharacter((prev) => {
        const attributes = { ...(prev.attributes || {}) };
        attributes[`trait_${Date.now()}`] = trait.trim();
        return {
          ...prev,
          attributes,
        };
      });
      setTrait('');
    }
  };

  const handleRemoveTrait = (traitKey: string) => {
    setCharacter((prev) => {
      const attributes = { ...(prev.attributes || {}) };
      delete attributes[traitKey];
      return {
        ...prev,
        attributes,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(character, projectId);
  };

  // Get traits from attributes for display
  const traits = character.attributes 
    ? Object.entries(character.attributes)
      .filter(([key]) => key.startsWith('trait_'))
      .map(([key, value]) => ({ key, value: String(value) }))
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            Character Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={character.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Enter character name"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-foreground"
          >
            Role in Story
          </label>
          <select
            id="role"
            name="role"
            value={character.role || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a role</option>
            <option value="protagonist">Protagonist</option>
            <option value="antagonist">Antagonist</option>
            <option value="supporting">Supporting Character</option>
            <option value="mentor">Mentor</option>
            <option value="sidekick">Sidekick</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="shortDescription"
            className="block text-sm font-medium text-foreground"
          >
            Description
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={character.shortDescription || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Describe your character"
          />
        </div>

        <div>
          <label
            htmlFor="traits"
            className="block text-sm font-medium text-foreground"
          >
            Character Traits
          </label>
          <div className="mt-1 flex">
            <input
              id="traits"
              type="text"
              value={trait}
              onChange={(e) => setTrait(e.target.value)}
              className="block w-full rounded-md rounded-r-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Add a trait"
            />
            <button
              type="button"
              onClick={handleAddTrait}
              className="rounded-md rounded-l-none border border-l-0 border-input bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add
            </button>
          </div>
          {traits.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {traits.map(({ key, value }) => (
                <span
                  key={key}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => handleRemoveTrait(key)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-primary hover:bg-primary/20"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="detailedBackground"
            className="block text-sm font-medium text-foreground"
          >
            Backstory
          </label>
          <textarea
            id="detailedBackground"
            name="detailedBackground"
            value={character.detailedBackground || ''}
            onChange={handleChange}
            rows={5}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Character's backstory (optional)"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {initialData?.id ? 'Update Character' : 'Create Character'}
        </button>
      </div>
    </form>
  );
} 