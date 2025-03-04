import { useState } from 'react';
import { CharacterData } from '../../../lib/api';

interface CharacterFormProps {
  initialData?: CharacterData;
  projectId: string;
  onSubmit: (data: CharacterData) => void;
  onCancel: () => void;
}

export function CharacterForm({
  initialData,
  onSubmit,
  onCancel,
}: CharacterFormProps) {
  const [character, setCharacter] = useState<CharacterData>(
    initialData || {
      name: '',
      role: '',
      description: '',
      traits: [],
      backstory: '',
    }
  );

  const [trait, setTrait] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTrait = () => {
    if (trait.trim() && !character.traits?.includes(trait.trim())) {
      setCharacter((prev) => ({
        ...prev,
        traits: [...(prev.traits || []), trait.trim()],
      }));
      setTrait('');
    }
  };

  const handleRemoveTrait = (traitToRemove: string) => {
    setCharacter((prev) => ({
      ...prev,
      traits: prev.traits?.filter((t) => t !== traitToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(character);
  };

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
            value={character.role}
            onChange={handleChange}
            required
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
            htmlFor="description"
            className="block text-sm font-medium text-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={character.description}
            onChange={handleChange}
            required
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
          {character.traits && character.traits.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {character.traits.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTrait(t)}
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
            htmlFor="backstory"
            className="block text-sm font-medium text-foreground"
          >
            Backstory
          </label>
          <textarea
            id="backstory"
            name="backstory"
            value={character.backstory || ''}
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
          {initialData ? 'Update Character' : 'Create Character'}
        </button>
      </div>
    </form>
  );
} 