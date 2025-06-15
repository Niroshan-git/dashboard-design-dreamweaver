
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutGrid, Plus, Minus, BarChart3, PieChart, TrendingUp, 
  Table, Filter, Type, Image, Layers, Move, Maximize2
} from "lucide-react";

interface LayoutBuilderProps {
  config: any;
  setConfig: (config: any) => void;
}

interface PageComponent {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'filter' | 'text' | 'image' | 'tabs';
  count?: number;
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'map';
  span: number;
  position: { row: number; col: number };
}

interface PageLayout {
  pageId: number;
  components: PageComponent[];
  preset?: string;
}

const LayoutBuilder = ({ config, setConfig }: LayoutBuilderProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [layouts, setLayouts] = useState<PageLayout[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const componentTypes = [
    { type: 'kpi', label: 'KPI Cards', icon: LayoutGrid, color: 'bg-blue-50 border-blue-200' },
    { type: 'chart', label: 'Charts', icon: BarChart3, color: 'bg-green-50 border-green-200' },
    { type: 'table', label: 'Tables', icon: Table, color: 'bg-purple-50 border-purple-200' },
    { type: 'filter', label: 'Filters', icon: Filter, color: 'bg-orange-50 border-orange-200' },
    { type: 'text', label: 'Text Block', icon: Type, color: 'bg-gray-50 border-gray-200' },
    { type: 'image', label: 'Image/Logo', icon: Image, color: 'bg-yellow-50 border-yellow-200' },
    { type: 'tabs', label: 'Tab Container', icon: Layers, color: 'bg-indigo-50 border-indigo-200' }
  ];

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'area', label: 'Area Chart', icon: TrendingUp },
    { value: 'map', label: 'Map Chart', icon: LayoutGrid }
  ];

  const presetLayouts = {
    simple: [
      { name: "KPI Focus", components: [
        { type: 'kpi', count: 4, span: 12 },
        { type: 'chart', count: 1, span: 12, chartType: 'line' }
      ]},
      { name: "Chart Heavy", components: [
        { type: 'kpi', count: 2, span: 6 },
        { type: 'chart', count: 2, span: 6, chartType: 'bar' }
      ]}
    ],
    moderate: [
      { name: "Balanced View", components: [
        { type: 'kpi', count: 4, span: 12 },
        { type: 'chart', count: 2, span: 6, chartType: 'line' },
        { type: 'table', count: 1, span: 12 }
      ]},
      { name: "Analytics Focus", components: [
        { type: 'kpi', count: 3, span: 9 },
        { type: 'filter', count: 1, span: 3 },
        { type: 'chart', count: 3, span: 4, chartType: 'bar' }
      ]}
    ],
    complex: [
      { name: "Executive Dashboard", components: [
        { type: 'kpi', count: 6, span: 12 },
        { type: 'chart', count: 4, span: 3, chartType: 'mixed' },
        { type: 'table', count: 1, span: 8 },
        { type: 'filter', count: 1, span: 4 }
      ]},
      { name: "Full Analytics", components: [
        { type: 'kpi', count: 4, span: 8 },
        { type: 'filter', count: 1, span: 4 },
        { type: 'chart', count: 6, span: 2, chartType: 'mixed' }
      ]}
    ]
  };

  const initializeLayouts = () => {
    const newLayouts: PageLayout[] = [];
    for (let i = 0; i < config.pages; i++) {
      newLayouts.push({
        pageId: i,
        components: [],
        preset: undefined
      });
    }
    setLayouts(newLayouts);
  };

  const addComponent = (type: string) => {
    const newComponent: PageComponent = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      count: type === 'kpi' ? 4 : type === 'chart' ? 1 : 1,
      chartType: type === 'chart' ? 'bar' : undefined,
      span: type === 'kpi' ? 12 : type === 'chart' ? 6 : type === 'table' ? 12 : 4,
      position: { row: 0, col: 0 }
    };

    const updatedLayouts = [...layouts];
    if (!updatedLayouts[currentPageIndex]) {
      updatedLayouts[currentPageIndex] = { pageId: currentPageIndex, components: [] };
    }
    updatedLayouts[currentPageIndex].components.push(newComponent);
    setLayouts(updatedLayouts);
    
    // Update main config
    setConfig(prev => ({ ...prev, layouts: updatedLayouts }));
  };

  const removeComponent = (componentId: string) => {
    const updatedLayouts = [...layouts];
    if (updatedLayouts[currentPageIndex]) {
      updatedLayouts[currentPageIndex].components = 
        updatedLayouts[currentPageIndex].components.filter(c => c.id !== componentId);
      setLayouts(updatedLayouts);
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
        setLayouts(updatedLayouts);
        setConfig(prev => ({ ...prev, layouts: updatedLayouts }));
      }
    }
  };

  const applyPreset = (preset: any) => {
    const newComponents: PageComponent[] = preset.components.map((comp: any, index: number) => ({
      id: `${comp.type}-${Date.now()}-${index}`,
      type: comp.type,
      count: comp.count,
      chartType: comp.chartType,
      span: comp.span,
      position: { row: Math.floor(index / 3), col: (index % 3) * 4 }
    }));

    const updatedLayouts = [...layouts];
    updatedLayouts[currentPageIndex] = {
      pageId: currentPageIndex,
      components: newComponents,
      preset: preset.name
    };
    setLayouts(updatedLayouts);
    setConfig(prev => ({ ...prev, layouts: updatedLayouts }));
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
                <p>Drag components here or use presets</p>
              </div>
            </div>
          ) : (
            currentLayout.components.map((component) => {
              const componentType = componentTypes.find(t => t.type === component.type);
              const IconComponent = componentType?.icon || LayoutGrid;
              
              return (
                <div
                  key={component.id}
                  className={`${componentType?.color} border rounded p-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow`}
                  style={{ gridColumn: `span ${Math.min(component.span, 12)}` }}
                  onClick={() => setSelectedComponent(component.id)}
                >
                  <IconComponent className="w-4 h-4 mb-1" />
                  <span className="text-xs font-medium">{componentType?.label}</span>
                  {component.count && component.count > 1 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {component.count}
                    </Badge>
                  )}
                  {component.chartType && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {component.chartType}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-4 w-4 p-0"
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

  // Initialize layouts if empty
  if (layouts.length !== config.pages) {
    initializeLayouts();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            Interactive Layout Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Design each page layout by adding components and arranging them in a responsive grid
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Page Selector */}
          <div className="flex items-center gap-4">
            <Label className="font-semibold">Page:</Label>
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

          <Tabs defaultValue="build" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="build">Build Layout</TabsTrigger>
              <TabsTrigger value="presets">Use Presets</TabsTrigger>
              <TabsTrigger value="preview">Preview Grid</TabsTrigger>
            </TabsList>

            <TabsContent value="build" className="space-y-4">
              {/* Component Palette */}
              <div>
                <Label className="font-semibold mb-3 block">Add Components</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {componentTypes.map((componentType) => {
                    const IconComponent = componentType.icon;
                    return (
                      <Button
                        key={componentType.type}
                        variant="outline"
                        className="h-20 flex flex-col items-center gap-2"
                        onClick={() => addComponent(componentType.type)}
                      >
                        <IconComponent className="w-6 h-6" />
                        <span className="text-xs">{componentType.label}</span>
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
                              value={component.count?.toString()}
                              onValueChange={(value) => updateComponent(selectedComponent, { count: parseInt(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[2, 3, 4, 5, 6, 8, 10].map(num => (
                                  <SelectItem key={num} value={num.toString()}>{num} Cards</SelectItem>
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
                                value={component.count?.toString()}
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
                                value={component.chartType}
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
                      </div>
                    );
                  })()}
                </Card>
              )}
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div>
                <Label className="font-semibold mb-3 block">Quick Layout Presets</Label>
                <div className="grid gap-4">
                  {Object.entries(presetLayouts).map(([complexity, presets]) => (
                    <div key={complexity}>
                      <h4 className="font-medium mb-2 capitalize">{complexity} Layouts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {presets.map((preset, index) => (
                          <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyPreset(preset)}>
                            <h5 className="font-medium mb-2">{preset.name}</h5>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {preset.components.map((comp, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {comp.count} {comp.type}
                                </Badge>
                              ))}
                            </div>
                            <Button size="sm" className="w-full">Apply Layout</Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div>
                <Label className="font-semibold mb-3 block">Page {currentPageIndex + 1} Layout Preview</Label>
                {renderGridPreview()}
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>• Click components to select and edit properties</p>
                  <p>• Use the minus button to remove components</p>
                  <p>• Grid shows 16:9 aspect ratio preview</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Layout Summary */}
      {layouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Layout Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {layouts.map((layout, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">Page {index + 1}</span>
                  <div className="flex gap-1">
                    {layout.components.map((comp, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {comp.count || 1} {comp.type}
                      </Badge>
                    ))}
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
