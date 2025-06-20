import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  LayoutGrid, Plus, Minus, BarChart3, PieChart, TrendingUp, 
  Table, Filter, Type, Image, Layers, Move, Maximize2, X, Edit3,
  Target, Users, DollarSign, Activity, Map, Grid3X3, Clock, ChartArea, ChartLine, ChartPie, Donut
} from "lucide-react";

interface LayoutBuilderProps {
  config: any;
  setConfig: (config: any) => void;
}

interface Visual {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'filter' | 'text' | 'image' | 'heatmap' | 'funnel' | 'scatter' | 'progress';
  name: string;
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'map' | 'donut';
  description?: string;
  dataSource?: string;
  filters?: string[];
  metrics?: string[];
  textContent?: string;
  kpiCount?: number;
}

interface PageComponent {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'filter' | 'text' | 'image' | 'tabs' | 'heatmap' | 'funnel' | 'scatter' | 'progress';
  count?: number;
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'map' | 'donut';
  span: number;
  position: { row: number; col: number };
  visualId?: string;
  name?: string;
  textContent?: string;
  kpiCount?: number;
}

interface PageLayout {
  pageId: number;
  components: PageComponent[];
  preset?: string;
}

const LayoutBuilder = ({ config, setConfig }: LayoutBuilderProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [editingVisual, setEditingVisual] = useState<string | null>(null);
  const [newVisualName, setNewVisualName] = useState('');

  // Initialize layouts and visuals if not present
  const initializeConfig = () => {
    const updates: any = {};
    
    if (!config.layouts || config.layouts.length !== config.pages) {
      const newLayouts: PageLayout[] = [];
      for (let i = 0; i < config.pages; i++) {
        newLayouts.push({
          pageId: i,
          components: [],
          preset: undefined
        });
      }
      updates.layouts = newLayouts;
    }
    
    if (!config.visuals) {
      updates.visuals = [];
    }
    
    if (!config.navigationStyle) {
      updates.navigationStyle = 'left-full';
    }
    
    if (Object.keys(updates).length > 0) {
      setConfig(prev => ({ ...prev, ...updates }));
    }
  };

  // Call initialization
  if (!config.layouts || config.layouts.length !== config.pages || !config.visuals || !config.navigationStyle) {
    initializeConfig();
  }

  const layouts = config.layouts || [];
  const visuals = config.visuals || [];

  const componentTypes = [
    { type: 'kpi', label: 'KPI Cards', icon: Target, color: 'bg-blue-50 border-blue-200' },
    { type: 'chart', label: 'Bar Chart', icon: BarChart3, color: 'bg-green-50 border-green-200', chartType: 'bar' },
    { type: 'chart', label: 'Line Chart', icon: ChartLine, color: 'bg-green-50 border-green-200', chartType: 'line' },
    { type: 'chart', label: 'Area Chart', icon: ChartArea, color: 'bg-green-50 border-green-200', chartType: 'area' },
    { type: 'chart', label: 'Pie Chart', icon: ChartPie, color: 'bg-green-50 border-green-200', chartType: 'pie' },
    { type: 'chart', label: 'Donut Chart', icon: Donut, color: 'bg-green-50 border-green-200', chartType: 'donut' },
    { type: 'chart', label: 'Map Chart', icon: Map, color: 'bg-green-50 border-green-200', chartType: 'map' },
    { type: 'table', label: 'Tables', icon: Table, color: 'bg-purple-50 border-purple-200' },
    { type: 'filter', label: 'Filters', icon: Filter, color: 'bg-orange-50 border-orange-200' },
    { type: 'text', label: 'Text Block', icon: Type, color: 'bg-gray-50 border-gray-200' },
    { type: 'image', label: 'Image/Logo', icon: Image, color: 'bg-yellow-50 border-yellow-200' },
    { type: 'heatmap', label: 'Heatmaps', icon: Grid3X3, color: 'bg-red-50 border-red-200' },
    { type: 'funnel', label: 'Funnel Charts', icon: TrendingUp, color: 'bg-indigo-50 border-indigo-200' },
    { type: 'scatter', label: 'Scatter Plots', icon: Target, color: 'bg-pink-50 border-pink-200' },
    { type: 'progress', label: 'Progress Bars', icon: Activity, color: 'bg-cyan-50 border-cyan-200' }
  ];

  const chartTypes = [
    { value: 'bar' as const, label: 'Bar Chart', icon: BarChart3 },
    { value: 'line' as const, label: 'Line Chart', icon: ChartLine },
    { value: 'area' as const, label: 'Area Chart', icon: ChartArea },
    { value: 'pie' as const, label: 'Pie Chart', icon: ChartPie },
    { value: 'donut' as const, label: 'Donut Chart', icon: Donut },
    { value: 'map' as const, label: 'Map Chart', icon: Map }
  ];

  // Filter navigation styles based on selected navigation position
  const getFilteredNavigationStyles = () => {
    const allNavigationStyles = [
      { 
        value: 'left-full', 
        label: 'Full Left Sidebar', 
        description: 'Fixed full-height sidebar with navigation',
        preview: 'bg-gradient-to-r from-blue-50 to-white',
        position: 'left'
      },
      { 
        value: 'left-collapsible', 
        label: 'Collapsible Left Bar', 
        description: 'Icon-only collapsible sidebar',
        preview: 'bg-gradient-to-r from-gray-50 to-white',
        position: 'left'
      },
      { 
        value: 'top-wide', 
        label: 'Wide Top Navigation', 
        description: 'Full-width top bar with logo and menu',
        preview: 'bg-gradient-to-r from-purple-50 to-white',
        position: 'top'
      },
      { 
        value: 'top-tabs', 
        label: 'Tabbed Top Navigation', 
        description: 'Tab-based navigation with dropdowns',
        preview: 'bg-gradient-to-r from-green-50 to-white',
        position: 'top'
      },
      { 
        value: 'top-minimal', 
        label: 'Minimal Top Bar', 
        description: 'Clean minimal navigation',
        preview: 'bg-gradient-to-r from-yellow-50 to-white',
        position: 'top'
      }
    ];

    // Filter based on selected navigation position from config
    return allNavigationStyles.filter(style => style.position === config.navigationPosition);
  };

  const navigationStyles = [
    { 
      value: 'left-full', 
      label: 'Full Left Sidebar', 
      description: 'Fixed full-height sidebar with navigation',
      preview: 'bg-gradient-to-r from-blue-50 to-white'
    },
    { 
      value: 'left-collapsible', 
      label: 'Collapsible Left Bar', 
      description: 'Icon-only collapsible sidebar',
      preview: 'bg-gradient-to-r from-gray-50 to-white'
    },
    { 
      value: 'top-wide', 
      label: 'Wide Top Navigation', 
      description: 'Full-width top bar with logo and menu',
      preview: 'bg-gradient-to-r from-purple-50 to-white'
    },
    { 
      value: 'top-tabs', 
      label: 'Tabbed Top Navigation', 
      description: 'Tab-based navigation with dropdowns',
      preview: 'bg-gradient-to-r from-green-50 to-white'
    },
    { 
      value: 'top-minimal', 
      label: 'Minimal Top Bar', 
      description: 'Clean minimal navigation',
      preview: 'bg-gradient-to-r from-yellow-50 to-white'
    }
  ];

  const addComponent = (type: string, chartType?: 'bar' | 'line' | 'pie' | 'area' | 'map' | 'donut') => {
    const newComponent: PageComponent = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      count: type === 'kpi' ? 1 : type === 'chart' ? 1 : 1,
      chartType: chartType || (type === 'chart' ? 'bar' : undefined),
      span: type === 'kpi' ? 3 : type === 'chart' ? 6 : type === 'table' ? 12 : 6,
      position: { row: 0, col: 0 },
      kpiCount: type === 'kpi' ? 1 : undefined,
      textContent: type === 'text' ? 'Welcome to Dashboard' : undefined
    };

    const updatedLayouts = [...layouts];
    if (!updatedLayouts[currentPageIndex]) {
      updatedLayouts[currentPageIndex] = { pageId: currentPageIndex, components: [] };
    }
    updatedLayouts[currentPageIndex].components.push(newComponent);
    
    setConfig(prev => ({ ...prev, layouts: updatedLayouts }));
  };

  const removeComponent = (componentId: string) => {
    const updatedLayouts = [...layouts];
    if (updatedLayouts[currentPageIndex]) {
      updatedLayouts[currentPageIndex].components = 
        updatedLayouts[currentPageIndex].components.filter(c => c.id !== componentId);
      setConfig(prev => ({ ...prev, layouts: updatedLayouts }));
    }
  };

  const updateComponent = (componentId: string, updates: Partial<PageComponent>) => {
    const updatedLayouts = [...layouts];
    if (updatedLayouts[currentPageIndex]) {
      const componentIndex = updatedLayouts[currentPageIndex].components.findIndex(c => c.id === componentId);
      if (componentIndex > -1) {
        updatedLayouts[currentPageIndex].components[componentIndex] = {
          ...updatedLayouts[currentPageIndex].components[componentIndex],
          ...updates
        };
        setConfig(prev => ({ ...prev, layouts: updatedLayouts }));
      }
    }
  };

  const addVisual = (type: string) => {
    const newVisual: Visual = {
      id: `visual-${Date.now()}`,
      type: type as any,
      name: newVisualName || `${type.charAt(0).toUpperCase() + type.slice(1)} ${visuals.length + 1}`,
      chartType: type === 'chart' ? 'bar' : undefined,
      description: '',
      dataSource: '',
      filters: [],
      metrics: [],
      textContent: type === 'text' ? 'Welcome to our Dashboard' : undefined,
      kpiCount: type === 'kpi' ? 1 : undefined
    };

    setConfig(prev => ({
      ...prev,
      visuals: [...prev.visuals, newVisual]
    }));
    setNewVisualName('');
  };

  const removeVisual = (visualId: string) => {
    // Remove visual and unlink from components
    const updatedLayouts = layouts.map((layout: PageLayout) => ({
      ...layout,
      components: layout.components.map(comp => 
        comp.visualId === visualId ? { ...comp, visualId: undefined } : comp
      )
    }));

    setConfig(prev => ({ 
      ...prev, 
      visuals: prev.visuals.filter((v: Visual) => v.id !== visualId),
      layouts: updatedLayouts
    }));
  };

  const updateVisual = (visualId: string, updates: Partial<Visual>) => {
    setConfig(prev => ({
      ...prev,
      visuals: prev.visuals.map((v: Visual) => 
        v.id === visualId ? { ...v, ...updates } : v
      )
    }));
  };

  const linkVisualToComponent = (componentId: string, visualId: string) => {
    const actualVisualId = visualId === "none" ? undefined : visualId;
    updateComponent(componentId, { visualId: actualVisualId });
  };

  const getCurrentPageLayout = () => {
    return layouts[currentPageIndex] || { pageId: currentPageIndex, components: [] };
  };

  const renderGridPreview = () => {
    const currentLayout = getCurrentPageLayout();
    
    return (
      <div className="border rounded-lg bg-gray-50 aspect-video p-4">
        <div className="grid grid-cols-12 gap-2 h-full">
          {currentLayout.components.length === 0 ? (
            <div className="col-span-12 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded">
              <div className="text-center">
                <LayoutGrid className="w-8 h-8 mx-auto mb-2" />
                <p>Add components to Page {currentPageIndex + 1}</p>
              </div>
            </div>
          ) : (
            currentLayout.components.map((component) => {
              const componentType = componentTypes.find(t => t.type === component.type);
              const IconComponent = componentType?.icon || LayoutGrid;
              const linkedVisual = visuals.find((v: Visual) => v.id === component.visualId);
              
              return (
                <div
                  key={component.id}
                  className={`${componentType?.color} border rounded p-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow relative`}
                  style={{ gridColumn: `span ${Math.min(component.span, 12)}` }}
                  onClick={() => setSelectedComponent(component.id)}
                >
                  <IconComponent className="w-4 h-4 mb-1" />
                  <span className="text-xs font-medium">{componentType?.label}</span>
                  {component.kpiCount && component.kpiCount > 1 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {component.kpiCount} KPIs
                    </Badge>
                  )}
                  {component.chartType && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {component.chartType}
                    </Badge>
                  )}
                  {linkedVisual && (
                    <Badge variant="default" className="text-xs mt-1">
                      {linkedVisual.name}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-4 w-4 p-0 absolute top-1 right-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeComponent(component.id);
                    }}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            Layout & Visual Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Design page layouts, create visuals, and link them together
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Page Selector */}
          <div className="flex items-center gap-4">
            <Label className="font-semibold">Current Page:</Label>
            <div className="flex gap-2">
              {Array.from({ length: config.pages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPageIndex === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPageIndex(i)}
                >
                  Page {i + 1}
                  {layouts[i]?.components.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {layouts[i].components.length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Navigation Style Selection - Filtered based on navigation position */}
          <div className="space-y-3">
            <Label className="font-semibold">Navigation Style</Label>
            <p className="text-sm text-muted-foreground">
              Showing styles for {config.navigationPosition === 'left' ? 'Left Sidebar' : 'Top Navigation'} position
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getFilteredNavigationStyles().map((style) => (
                <Card 
                  key={style.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    config.navigationStyle === style.value 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, navigationStyle: style.value }))}
                >
                  <CardContent className="p-4">
                    <div className={`h-8 rounded mb-2 ${style.preview}`}></div>
                    <div className="font-medium text-sm">{style.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="layout">Build Layout</TabsTrigger>
              <TabsTrigger value="visuals">Manage Visuals</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-4">
              {/* Component Palette */}
              <div>
                <Label className="font-semibold mb-3 block">Add Components to Page {currentPageIndex + 1}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {componentTypes.map((componentType, index) => {
                    const IconComponent = componentType.icon;
                    const chartType = (componentType as any).chartType;
                    
                    return (
                      <Button
                        key={`${componentType.type}-${chartType || index}`}
                        variant="outline"
                        className={`h-20 flex flex-col items-center gap-2 border-2 ${componentType.color}`}
                        onClick={() => addComponent(componentType.type, chartType)}
                      >
                        <IconComponent className="w-6 h-6" />
                        <span className="text-xs font-medium">{componentType.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Component Properties */}
              {selectedComponent && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Component Properties</h4>
                  {(() => {
                    const component = getCurrentPageLayout().components.find(c => c.id === selectedComponent);
                    if (!component) return null;

                    return (
                      <div className="grid grid-cols-2 gap-4">
                        {component.type === 'kpi' && (
                          <div>
                            <Label>Number of KPI Cards</Label>
                            <Select
                              value={component.kpiCount?.toString() || "1"}
                              onValueChange={(value) => updateComponent(selectedComponent, { kpiCount: parseInt(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                                  <SelectItem key={num} value={num.toString()}>{num} Card{num > 1 ? 's' : ''}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {component.type === 'chart' && (
                          <>
                            <div>
                              <Label>Number of Charts</Label>
                              <Select
                                value={component.count?.toString() || "1"}
                                onValueChange={(value) => updateComponent(selectedComponent, { count: parseInt(value) })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num} Chart{num > 1 ? 's' : ''}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Chart Type</Label>
                              <Select
                                value={component.chartType || "bar"}
                                onValueChange={(value) => updateComponent(selectedComponent, { chartType: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {chartTypes.map(chart => (
                                    <SelectItem key={chart.value} value={chart.value}>{chart.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {component.type === 'text' && (
                          <div className="col-span-2">
                            <Label>Text Content</Label>
                            <Textarea
                              value={component.textContent || ''}
                              onChange={(e) => updateComponent(selectedComponent, { textContent: e.target.value })}
                              placeholder="Enter your text content..."
                              rows={3}
                            />
                          </div>
                        )}

                        <div>
                          <Label>Width (Grid Columns)</Label>
                          <Select
                            value={component.span.toString()}
                            onValueChange={(value) => updateComponent(selectedComponent, { span: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[3, 4, 6, 8, 12].map(span => (
                                <SelectItem key={span} value={span.toString()}>{span}/12 ({Math.round((span/12)*100)}%)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Link to Visual */}
                        <div>
                          <Label>Link to Visual</Label>
                          <Select
                            value={component.visualId || 'none'}
                            onValueChange={(value) => linkVisualToComponent(selectedComponent, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select visual" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Link</SelectItem>
                              {visuals.filter((visual: Visual) => visual.type === component.type).map((visual: Visual) => (
                                <SelectItem key={visual.id} value={visual.id}>
                                  {visual.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              )}
            </TabsContent>

            <TabsContent value="visuals" className="space-y-4">
              {/* Add New Visual */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Create New Visual</h4>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Visual name (optional)"
                    value={newVisualName}
                    onChange={(e) => setNewVisualName(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {componentTypes.filter((type, index, self) => 
                    index === self.findIndex(t => t.type === type.type)
                  ).map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <Button
                        key={type.type}
                        variant="outline"
                        className="h-16 flex flex-col items-center gap-1"
                        onClick={() => addVisual(type.type)}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </Card>

              {/* Visual Library */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Visual Library ({visuals.length})</h4>
                {visuals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <LayoutGrid className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No visuals created yet. Add some above!</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {visuals.map((visual: Visual) => {
                      const typeInfo = componentTypes.find(t => t.type === visual.type);
                      const IconComponent = typeInfo?.icon || LayoutGrid;
                      
                      return (
                        <div key={visual.id} className={`p-3 border rounded-lg ${typeInfo?.color} space-y-2`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5" />
                              <div>
                                {editingVisual === visual.id ? (
                                  <Input
                                    value={visual.name}
                                    onChange={(e) => updateVisual(visual.id, { name: e.target.value })}
                                    className="h-6 text-sm"
                                    onBlur={() => setEditingVisual(null)}
                                    onKeyDown={(e) => e.key === 'Enter' && setEditingVisual(null)}
                                    autoFocus
                                  />
                                ) : (
                                  <div className="font-medium text-sm">{visual.name}</div>
                                )}
                                <div className="text-xs text-gray-600 capitalize">{visual.type}{visual.chartType && ` - ${visual.chartType}`}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => setEditingVisual(visual.id)}
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                onClick={() => removeVisual(visual.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Visual Properties */}
                          {visual.type === 'kpi' && (
                            <div>
                              <Label className="text-xs">KPI Count</Label>
                              <Select
                                value={visual.kpiCount?.toString() || "1"}
                                onValueChange={(value) => updateVisual(visual.id, { kpiCount: parseInt(value) })}
                              >
                                <SelectTrigger className="h-6 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6].map(num => (
                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          {visual.type === 'text' && (
                            <div>
                              <Label className="text-xs">Text Content</Label>
                              <Textarea
                                value={visual.textContent || ''}
                                onChange={(e) => updateVisual(visual.id, { textContent: e.target.value })}
                                placeholder="Enter text content..."
                                rows={2}
                                className="text-xs"
                              />
                            </div>
                          )}
                          
                          <div>
                            <Label className="text-xs">Description</Label>
                            <Input
                              value={visual.description || ''}
                              onChange={(e) => updateVisual(visual.id, { description: e.target.value })}
                              placeholder="Visual description..."
                              className="h-6 text-xs"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div>
                <Label className="font-semibold mb-3 block">Page {currentPageIndex + 1} Layout Preview</Label>
                {renderGridPreview()}
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>• Click components to select and edit properties</p>
                  <p>• Use the minus button to remove components</p>
                  <p>• Create visuals in the Visuals tab and link them to components</p>
                  <p>• Each page has its own unique layout</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Layout Summary - All Pages */}
      {layouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Pages Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {layouts.map((layout, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">Page {index + 1}</span>
                  <div className="flex gap-1">
                    {layout.components.map((comp, i) => {
                      const linkedVisual = visuals.find((v: Visual) => v.id === comp.visualId);
                      return (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {comp.count || 1} {comp.type}{linkedVisual ? ` (${linkedVisual.name})` : ''}
                        </Badge>
                      );
                    })}
                    {layout.components.length === 0 && (
                      <span className="text-sm text-muted-foreground">Empty</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LayoutBuilder;
