import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plot, InsertPlot, PlotElement, InsertPlotElement } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const usePlotService = (projectId: number) => {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch plots
  const { 
    data: plots = [], 
    isLoading, 
    isError 
  } = useQuery<Plot[]>({
    queryKey: ['/api/projects', projectId, 'plots'],
    enabled: projectId > 0,
  });

  // Fetch plot elements for a specific plot
  const getPlotElements = (plotId: number) => {
    return useQuery<PlotElement[]>({
      queryKey: ['/api/projects', projectId, 'plots', plotId, 'elements'],
      enabled: plotId > 0,
    });
  };

  // Create plot mutation
  const createPlotMutation = useMutation({
    mutationFn: async (plot: InsertPlot) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/plots`, plot);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'plots'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating plot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update plot mutation
  const updatePlotMutation = useMutation({
    mutationFn: async ({ id, plot }: { id: number; plot: Partial<Plot> }) => {
      const response = await apiRequest('PUT', `/api/projects/${projectId}/plots/${id}`, plot);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'plots'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating plot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete plot mutation
  const deletePlotMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/projects/${projectId}/plots/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'plots'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting plot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create plot element mutation
  const createPlotElementMutation = useMutation({
    mutationFn: async ({ plotId, element }: { plotId: number; element: InsertPlotElement }) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/plots/${plotId}/elements`, element);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'plots', variables.plotId, 'elements'] 
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating plot element",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update plot element mutation
  const updatePlotElementMutation = useMutation({
    mutationFn: async ({ 
      plotId, 
      elementId, 
      element 
    }: { 
      plotId: number; 
      elementId: number; 
      element: Partial<PlotElement> 
    }) => {
      const response = await apiRequest(
        'PUT', 
        `/api/projects/${projectId}/plots/${plotId}/elements/${elementId}`, 
        element
      );
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'plots', variables.plotId, 'elements'] 
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating plot element",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete plot element mutation
  const deletePlotElementMutation = useMutation({
    mutationFn: async ({ plotId, elementId }: { plotId: number; elementId: number }) => {
      const response = await apiRequest(
        'DELETE', 
        `/api/projects/${projectId}/plots/${plotId}/elements/${elementId}`, 
        undefined
      );
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'plots', variables.plotId, 'elements'] 
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting plot element",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const createPlot = async (plot: InsertPlot) => {
    return createPlotMutation.mutateAsync(plot);
  };

  const updatePlot = async (id: number, plot: Partial<Plot>) => {
    return updatePlotMutation.mutateAsync({ id, plot });
  };

  const deletePlot = async (id: number) => {
    return deletePlotMutation.mutateAsync(id);
  };

  const createPlotElement = async (plotId: number, element: InsertPlotElement) => {
    return createPlotElementMutation.mutateAsync({ plotId, element });
  };

  const updatePlotElement = async (plotId: number, elementId: number, element: Partial<PlotElement>) => {
    return updatePlotElementMutation.mutateAsync({ plotId, elementId, element });
  };

  const deletePlotElement = async (plotId: number, elementId: number) => {
    return deletePlotElementMutation.mutateAsync({ plotId, elementId });
  };

  // Add character to plot element
  const addCharacterToElement = async (plotId: number, elementId: number, characterId: number) => {
    try {
      const response = await apiRequest(
        'POST', 
        `/api/projects/${projectId}/plots/${plotId}/elements/${elementId}/characters`, 
        { characterId }
      );
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'plots', plotId, 'elements'] 
      });
      
      return response.json();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error adding character to plot element",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add setting to plot element
  const addSettingToElement = async (plotId: number, elementId: number, settingId: number) => {
    try {
      const response = await apiRequest(
        'POST', 
        `/api/projects/${projectId}/plots/${plotId}/elements/${elementId}/settings`, 
        { settingId }
      );
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'plots', plotId, 'elements'] 
      });
      
      return response.json();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error adding setting to plot element",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add object to plot element
  const addObjectToElement = async (plotId: number, elementId: number, objectId: number) => {
    try {
      const response = await apiRequest(
        'POST', 
        `/api/projects/${projectId}/plots/${plotId}/elements/${elementId}/objects`, 
        { objectId }
      );
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'plots', plotId, 'elements'] 
      });
      
      return response.json();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error adding object to plot element",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Sample data for development until API is implemented
  useEffect(() => {
    if (projectId <= 0 || !isLoading || plots.length > 0) return;

    // Sample plots data for UI development
    const samplePlots: Plot[] = [
      {
        id: 1,
        projectId,
        name: "The Crystal of Eternity",
        description: "Thorne's quest to obtain the Crystal of Eternity and the heroes' journey to stop him",
        plotType: "Main Plot",
        structure: "Three-Act Structure",
        iconInitial: "C",
        iconColor: "bg-red-600",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        projectId,
        name: "Arwen's Vengeance",
        description: "Arwen's personal journey to avenge her father's death at Thorne's hands",
        plotType: "Character Arc",
        structure: "Hero's Journey",
        iconInitial: "A",
        iconColor: "bg-blue-600",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        projectId,
        name: "The Elven Alliance",
        description: "The diplomatic efforts to unite the fractured elven clans against a common threat",
        plotType: "Subplot",
        structure: "Rising Action",
        iconInitial: "E",
        iconColor: "bg-green-600",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Sample plot elements for The Crystal of Eternity plot
    const samplePlotElements: PlotElement[] = [
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

    // Mock the queryClient data for plots
    queryClient.setQueryData(['/api/projects', projectId, 'plots'], samplePlots);
    
    // Mock the queryClient data for plot elements
    queryClient.setQueryData(['/api/projects', projectId, 'plots', 1, 'elements'], samplePlotElements);
  }, [projectId, isLoading, plots]);

  return {
    plots,
    isLoading,
    isError,
    error,
    getPlotElements,
    createPlot,
    updatePlot,
    deletePlot,
    createPlotElement,
    updatePlotElement,
    deletePlotElement,
    addCharacterToElement,
    addSettingToElement,
    addObjectToElement
  };
};
