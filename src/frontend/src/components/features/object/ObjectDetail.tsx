import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useObjectService } from '@/hooks/useObjectService';
import { useCharacterService } from '@/hooks/useCharacterService';
import { useSettingService } from '@/hooks/useSettingService';
import ContentLayout from '@/components/layout/ContentLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Trash2, 
  Package, 
  Wand2, 
  User, 
  MapPin,
  AlertCircle
} from 'lucide-react';

/**
 * Object Detail Page
 * 
 * Shows detailed information about an object
 */
const ObjectDetailPage: React.FC = () => {
  const { projectId, objectId } = useParams<{ projectId: string; objectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  
  // Fetch object data
  const { getObject } = useObjectService();
  const { data: objectData, isLoading: objectLoading, error: objectError } = 
    getObject(projectId || '', objectId || '');
  
  // Fetch owner data if available
  const { getCharacter } = useCharacterService();
  const { data: ownerData, isLoading: ownerLoading } = 
    objectData?.owner ? getCharacter(projectId || '', objectData.owner) : { data: null, isLoading: false };
  
  // Fetch location data if available
  const { getSetting } = useSettingService();
  const { data: locationData, isLoading: locationLoading } = 
    objectData?.location ? getSetting(projectId || '', objectData.location) : { data: null, isLoading: false };
  
  // Define breadcrumbs for navigation
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Project', href: `/projects/${projectId}` },
    { label: 'Objects', href: `/projects/${projectId}/objects` },
    { label: objectData?.name || 'Object Details', href: `/projects/${projectId}/objects/${objectId}` }
  ];
  
  // Loading state
  const isLoading = objectLoading || ownerLoading || locationLoading;
  
  // Error state
  if (objectError) {
    return (
      <ContentLayout
        title="Object Not Found"
        breadcrumbs={breadcrumbs.slice(0, 4)}
      >
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-destructive mr-2" />
              <h3 className="text-lg font-medium text-destructive">Error loading object</h3>
            </div>
            <p className="mt-2 text-sm text-destructive/80">
              The object could not be found or you don't have permission to view it.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate(`/projects/${projectId}/objects`)}
            >
              Back to Objects
            </Button>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }
  
  const isMagical = objectData?.properties.magical && 
    (objectData.properties.magical.powers.length > 0 || 
     objectData.properties.magical.limitations.length > 0 || 
     objectData.properties.magical.origin);
  
  return (
    <ContentLayout
      title={objectData?.name || 'Loading...'}
      description={objectData?.description || ''}
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${projectId}/objects/${objectId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      }
      isLoading={isLoading}
    >
      {/* Object Tabs */}
      <Tabs 
        defaultValue="details" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          {isMagical && <TabsTrigger value="magical">Magical</TabsTrigger>}
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center mr-4">
                  {objectData?.imageUrl ? (
                    <img 
                      src={objectData.imageUrl} 
                      alt={objectData.name} 
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    isMagical ? (
                      <Wand2 className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <Package className="h-12 w-12 text-muted-foreground" />
                    )
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">{objectData?.name}</h2>
                    <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {objectData?.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {objectData?.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Significance</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {objectData?.significance || 'No significance provided.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">History</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {objectData?.history || 'No history provided.'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Owner</h3>
                  {ownerData ? (
                    <div className="mt-1 flex items-center">
                      <User className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{ownerData.name}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">No owner</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  {locationData ? (
                    <div className="mt-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{locationData.name}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">No location</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">
                {objectData?.notes || 'No notes provided.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Properties Tab */}
        <TabsContent value="properties">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Physical Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Size</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {objectData?.properties.physical.size || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Material</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {objectData?.properties.physical.material || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Appearance</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {objectData?.properties.physical.appearance || 'Not specified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Magical Tab */}
        {isMagical && (
          <TabsContent value="magical">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Magical Properties</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Powers</h4>
                    {objectData?.properties.magical?.powers && objectData.properties.magical.powers.length > 0 ? (
                      <ul className="mt-1 space-y-1">
                        {objectData.properties.magical.powers.map((power, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                            {power}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">No powers specified</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Limitations</h4>
                    {objectData?.properties.magical?.limitations && objectData.properties.magical.limitations.length > 0 ? (
                      <ul className="mt-1 space-y-1">
                        {objectData.properties.magical.limitations.map((limitation, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-destructive mr-2"></div>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">No limitations specified</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Origin</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {objectData?.properties.magical?.origin || 'No origin specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* Relationships Tab */}
        <TabsContent value="relationships">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Relationships</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Owner</h4>
                  {ownerData ? (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="font-medium">{ownerData.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {ownerData.shortDescription || 'No description provided.'}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate(`/projects/${projectId}/characters/${ownerData.id}`)}>
                        View Character
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">This object has no owner.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Location</h4>
                  {locationData ? (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="font-medium">{locationData.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {locationData.description || 'No description provided.'}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate(`/projects/${projectId}/settings/${locationData.id}`)}>
                        View Location
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">This object has no specific location.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
};

export default ObjectDetailPage;
