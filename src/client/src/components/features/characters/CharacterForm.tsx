import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertCharacterSchema } from "@shared/schema";
import { useCharacterService } from "@/hooks/useCharacterService";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

// Extend insertCharacterSchema with validation
const characterFormSchema = insertCharacterSchema
  .extend({
    name: z.string().min(1, "Name is required"),
    role: z.string().optional(),
    archetype: z.string().optional(),
    appearance: z.string().optional(),
    personality: z.string().optional(),
    background: z.string().optional(),
    speech: z.string().optional(),
    age: z.string().optional(),
    gender: z.string().optional(),
    race: z.string().optional(),
    occupation: z.string().optional(),
  });

type CharacterFormValues = z.infer<typeof characterFormSchema>;

type CharacterFormProps = {
  projectId: number;
  character?: Partial<CharacterFormValues>;
  onSuccess: () => void;
  onCancel: () => void;
};

const CharacterForm: React.FC<CharacterFormProps> = ({
  projectId,
  character,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const { createCharacter, updateCharacter } = useCharacterService(projectId);
  const isEditing = !!character?.id;

  // Default form values
  const defaultValues: Partial<CharacterFormValues> = {
    projectId,
    name: "",
    role: "Supporting",
    archetype: "",
    appearance: "",
    personality: "",
    speech: "",
    age: "",
    gender: "",
    race: "",
    occupation: "",
    ...character,
  };

  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: CharacterFormValues) => {
    try {
      if (isEditing && character?.id) {
        await updateCharacter(character.id, data);
        toast({
          title: "Character updated",
          description: "Character has been updated successfully",
        });
      } else {
        await createCharacter(data);
        toast({
          title: "Character created",
          description: "New character has been created successfully",
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save character",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Character name"
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Protagonist">Protagonist</SelectItem>
                      <SelectItem value="Antagonist">Antagonist</SelectItem>
                      <SelectItem value="Ally">Ally</SelectItem>
                      <SelectItem value="Mentor">Mentor</SelectItem>
                      <SelectItem value="Supporting">Supporting</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="archetype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Archetype</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Character archetype"
                      className="bg-gray-700 border-gray-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    For example: Dark Sorcerer, Elven Ranger, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Age</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Age"
                        className="bg-gray-700 border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Gender</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Gender"
                        className="bg-gray-700 border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Race</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Race"
                        className="bg-gray-700 border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Occupation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Occupation"
                        className="bg-gray-700 border-gray-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="appearance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Appearance</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Character appearance"
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Personality</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Character personality"
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="speech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Speech & Mannerisms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Speech patterns and mannerisms"
                      className="bg-gray-700 border-gray-600 text-white h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white shadow-[0_0_15px_rgba(93,63,211,0.3)] hover:shadow-[0_0_20px_rgba(93,63,211,0.6)]"
          >
            {isEditing ? "Update Character" : "Create Character"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CharacterForm;
