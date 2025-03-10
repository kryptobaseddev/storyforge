import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useObjectService } from '@/hooks/useObjectService';
import ContentLayout from '@/components/layout/ContentLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Package, Wand2 } from 'lucide-react';
import type { Object } from '@/schemas';

/**
 * Objects Page
 * 
 * Lists all objects for a project with filtering and search
 */
const ObjectsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Use the object service hook to fetch objects
  const { getAllObjects } = useObjectService();
  const { data: objectsData, isLoading, error } = getAllObjects(id || '');
  
  // Filter objects based on search term and filters
  const filteredObjects = React.useMemo(() => {
    if (!objectsData) return [];
    
    return objectsData.filter((object) => {
      const matchesSearch = searchTerm === '' || 
        object.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (object.description && object.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === '' || 
        (object.type && object.type.toLowerCase() === typeFilter.toLowerCase());
      
      return matchesSearch && matchesType;
    });
  }, [objectsData, searchTerm, typeFilter]);

  // Define breadcrumbs for navigation
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Project', href: `/projects/${id}` },
    { label: 'Objects', href: `/projects/${id}/objects` }
  ];

  // Error handling content
  if (error) {
    return (
      <ContentLayout
        title="Objects"
        description="Manage objects in your story"
        breadcrumbs={breadcrumbs}
        actions={
          <Button onClick={() => navigate(`/projects/${id}/objects/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            New Object
          </Button>
        }
      >
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-destructive">Error loading objects</h3>
            <p className="mt-2 text-sm text-destructive/80">{error.message}</p>
            <Button 
              variant="outline" 
              className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Objects"
      description="Manage objects in your story"
      breadcrumbs={breadcrumbs}
      actions={
        <Button onClick={() => navigate(`/projects/${id}/objects/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          New Object
        </Button>
      }
      isLoading={isLoading}
    >
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search objects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Types</option>
            <option value="item">Item</option>
            <option value="artifact">Artifact</option>
            <option value="vehicle">Vehicle</option>
            <option value="weapon">Weapon</option>
            <option value="tool">Tool</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      {/* Objects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredObjects.length > 0 ? (
          filteredObjects.map((object) => {
            // Convert Date objects to strings if needed
            const adaptedObject = {
              ...object,
              createdAt: typeof object.createdAt === 'string' 
                ? object.createdAt 
                : new Date(object.createdAt).toISOString(),
              updatedAt: typeof object.updatedAt === 'string' 
                ? object.updatedAt 
                : new Date(object.updatedAt).toISOString()
            } as Object;
            
            return (
              <ObjectCard 
                key={object.id} 
                object={adaptedObject} 
                projectId={id || ''} 
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-card text-card-foreground rounded-lg shadow">
            {searchTerm || typeFilter ? (
              <>
                <h3 className="text-lg font-medium text-foreground">No matching objects found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search filters</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-foreground">No objects yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create your first object to get started</p>
              </>
            )}
          </div>
        )}
        
        {/* New Object Card */}
        <div 
          className="bg-card text-card-foreground rounded-lg shadow overflow-hidden border-2 border-dashed border-border flex items-center justify-center p-6 min-h-[260px] cursor-pointer hover:bg-muted/40 transition-colors"
          onClick={() => navigate(`/projects/${id}/objects/new`)}
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-foreground">Create a new object</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add an item, artifact, or other object to your story</p>
            <div className="mt-4">
              <Button>
                New Object
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

// Helper component for object cards
interface ObjectCardProps {
  object: Object;
  projectId: string;
}

const ObjectCard: React.FC<ObjectCardProps> = ({ object, projectId }) => {
  const isMagical = object.properties.magical && 
    (object.properties.magical.powers.length > 0 || 
     object.properties.magical.limitations.length > 0 || 
     object.properties.magical.origin);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-muted flex items-center justify-center">
        {object.imageUrl ? (
          <img 
            src={object.imageUrl} 
            alt={object.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          isMagical ? (
            <Wand2 className="h-12 w-12 text-muted-foreground" />
          ) : (
            <Package className="h-12 w-12 text-muted-foreground" />
          )
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{object.name}</h3>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
            {object.type}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {object.description || 'No description provided.'}
        </p>
        {isMagical && (
          <div className="mt-2 flex items-center text-xs text-primary">
            <Wand2 className="h-3 w-3 mr-1" />
            <span>Magical</span>
          </div>
        )}
        <Button variant="secondary" size="sm" className="w-full mt-3" asChild>
          <Link to={`/projects/${projectId}/objects/${object.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ObjectsPage;
