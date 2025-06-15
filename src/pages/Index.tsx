import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileDown, Eye, Palette, BarChart3, TrendingUp, Map, Grid3X3, Clock, Filter, Zap, Navigation, Monitor, Tablet, Smartphone, LayoutGrid } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import LayoutBuilder from "@/components/LayoutBuilder";

const Dashboard = () => {
  const [config, setConfig] = useState({
    dashboardType: "",
    complexity: "",
    pages: 1,
    visuals: [],
    interactivity: "",
    themeStyle: "",
    colorPalette: ["#2563eb", "#7c3aed", "#059669"],
    exportFormats: [],
    navigationPosition: "left",
    tooltipsEnabled: true,
    layoutDimension: "16:9",
    layouts: [] // Add layouts to config
  });

  const [activeTab, setActiveTab] = useState("configure");

  const dashboardTypes = [
    { value: "finance", label: "Finance & Analytics", icon: "📊" },
    { value: "ecommerce", label: "E-commerce", icon: "🛒" },
    { value: "logistics", label: "Logistics & Supply Chain", icon: "🚛" },
    { value: "sales", label: "Sales Performance", icon: "💰" },
    { value: "executive", label: "Executive Summary", icon: "🎯" },
    { value: "healthcare", label: "Healthcare", icon: "🏥" },
    { value: "custom", label: "Custom Dashboard", icon: "⚙️" }
  ];

  const complexityLevels = [
    { value: "simple", label: "Simple", description: "2-4 key metrics, basic charts" },
    { value: "moderate", label: "Moderate", description: "5-8 metrics, mixed visualizations" },
    { value: "complex", label: "Complex", description: "10+ metrics, advanced interactions" }
  ];

  const interactivityLevels = [
    { value: "basic", label: "Basic", description: "Static visuals with hover effects" },
    { value: "advanced", label: "Advanced", description: "Filters, drill-downs, time controls" },
    { value: "highly-interactive", label: "Highly Interactive", description: "Real-time updates, custom interactions" }
  ];

  const themeStyles = [
    { value: "minimal", label: "Minimal", preview: "bg-gradient-to-r from-gray-50 to-white" },
    { value: "corporate", label: "Corporate", preview: "bg-gradient-to-r from-blue-50 to-indigo-50" },
    { value: "gradient", label: "Gradient", preview: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" },
    { value: "dark", label: "Dark Mode", preview: "bg-gradient-to-r from-gray-900 to-black" },
    { value: "creative", label: "Creative", preview: "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" },
    { value: "flat", label: "Flat Design", preview: "bg-gradient-to-r from-emerald-400 to-cyan-400" }
  ];

  const exportFormats = [
    { value: "figma", label: "Figma Design", icon: "🎨" },
    { value: "powerbi", label: "Power BI Template", icon: "📊" },
    { value: "json", label: "Theme JSON", icon: "🔧" },
    { value: "png", label: "PNG Preview", icon: "🖼️" }
  ];

  const navigationPositions = [
    { value: "left", label: "Left Sidebar", icon: "📱", description: "Traditional sidebar navigation" },
    { value: "top", label: "Top Navigation", icon: "🔝", description: "Horizontal navigation bar" }
  ];

  const layoutDimensions = [
    { value: "16:9", label: "16:9 Widescreen", icon: Monitor, description: "Standard widescreen format" },
    { value: "4:3", label: "4:3 Standard", icon: Monitor, description: "Traditional screen ratio" },
    { value: "1:1", label: "1:1 Square", icon: Tablet, description: "Perfect square layout" },
    { value: "21:9", label: "21:9 Ultrawide", icon: Monitor, description: "Ultra-wide format" }
  ];

  const handleGenerate = () => {
    if (!config.dashboardType || !config.complexity || !config.themeStyle) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Dashboard generated successfully!", {
      description: `Created ${config.pages} page(s) with configured layouts`
    });
    
    setActiveTab("preview");
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting as ${format.toUpperCase()}...`, {
      description: "Your dashboard template will be ready shortly"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create beautiful, interactive dashboards with customizable themes and professional layouts. 
            Export to Figma, Power BI, or download as templates.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5" />
                  Dashboard Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dashboard Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Dashboard Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {dashboardTypes.map((type) => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          config.dashboardType === type.value 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, dashboardType: type.value }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="text-sm font-medium">{type.label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Complexity & Pages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Complexity Level</Label>
                    <Select value={config.complexity} onValueChange={(value) => setConfig(prev => ({ ...prev, complexity: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {complexityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-sm text-gray-500">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Number of Pages</Label>
                    <Select value={config.pages.toString()} onValueChange={(value) => setConfig(prev => ({ ...prev, pages: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pages" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} Page{i > 0 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Layout Dimension */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Dashboard Layout Size</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {layoutDimensions.map((dimension) => {
                      const IconComponent = dimension.icon;
                      return (
                        <Card 
                          key={dimension.value}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            config.layoutDimension === dimension.value 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setConfig(prev => ({ ...prev, layoutDimension: dimension.value }))}
                        >
                          <CardContent className="p-4 flex items-center space-x-3">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                            <div>
                              <div className="font-medium">{dimension.label}</div>
                              <div className="text-sm text-gray-500">{dimension.description}</div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Navigation Position */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Navigation Position</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {navigationPositions.map((position) => (
                      <Card 
                        key={position.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          config.navigationPosition === position.value 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, navigationPosition: position.value }))}
                      >
                        <CardContent className="p-4 flex items-center space-x-3">
                          <div className="text-2xl">{position.icon}</div>
                          <div>
                            <div className="font-medium">{position.label}</div>
                            <div className="text-sm text-gray-500">{position.description}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Interactivity */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Interactivity Level</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {interactivityLevels.map((level) => (
                      <Card 
                        key={level.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          config.interactivity === level.value 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, interactivity: level.value }))}
                      >
                        <CardContent className="p-4">
                          <div className="font-medium mb-1">{level.label}</div>
                          <div className="text-sm text-gray-500">{level.description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Additional Features */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Additional Features</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tooltips"
                        checked={config.tooltipsEnabled}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, tooltipsEnabled: Boolean(checked) }))}
                      />
                      <Label htmlFor="tooltips" className="cursor-pointer">
                        Enable tooltips for KPI cards and visuals
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Export Formats */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Export Formats</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {exportFormats.map((format) => (
                      <div key={format.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={format.value}
                          checked={config.exportFormats.includes(format.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setConfig(prev => ({ ...prev, exportFormats: [...prev.exportFormats, format.value] }));
                            } else {
                              setConfig(prev => ({ ...prev, exportFormats: prev.exportFormats.filter(f => f !== format.value) }));
                            }
                          }}
                        />
                        <Label htmlFor={format.value} className="flex items-center gap-2 cursor-pointer">
                          <span>{format.icon}</span>
                          {format.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout">
            <LayoutBuilder 
              config={config} 
              setConfig={setConfig}
            />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeCustomizer 
              config={config} 
              setConfig={setConfig} 
              themeStyles={themeStyles}
            />
          </TabsContent>

          <TabsContent value="preview">
            <DashboardPreview config={config} onExport={handleExport} />
          </TabsContent>
        </Tabs>

        {/* Generate Button */}
        {activeTab !== "preview" && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleGenerate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              <Zap className="w-5 h-5 mr-2" />
              Generate Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
