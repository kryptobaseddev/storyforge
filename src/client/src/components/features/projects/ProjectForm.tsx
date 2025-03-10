import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProjectSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjectService } from "@/hooks/useProjectService";
import { Loader2 } from "lucide-react";

// Extend the schema for form validation
const projectFormSchema = insertProjectSchema.extend({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { createProject } = useProjectService();

  // Initialize the form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      userId: 1, // Use default user ID
      coverInitial: "",
      coverColor: "bg-primary",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // Set coverInitial if not provided
      if (!data.coverInitial) {
        data.coverInitial = data.name.charAt(0).toUpperCase();
      }
      
      await createProject(data);
      onSuccess();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Project Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter project name"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description"
                  className="bg-gray-700 border-gray-600 text-white resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverInitial"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Cover Initial (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a single character"
                  className="bg-gray-700 border-gray-600 text-white"
                  maxLength={1}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="bg-gray-600 text-white hover:bg-gray-500 border-gray-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};