import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Palette, RefreshCw, Copy, Paintbrush, Eye, Navigation, Zap, Square, 
  BarChart3, TrendingUp, Filter, Calendar, Users 
} from "lucide-react";
import { toast } from "sonner";
import { 
  advancedThemes, 
  generateColorPalette, 
  getNavigationThemeDefaults, 
  updateThemeFromPalette,
  filterLayouts,
  getFilterLayoutComponent 
} from "@/utils/advancedThemeSystem";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ThemeCustomizerProps {
  config: any;
  setConfig: (config: any) => void;
  themeStyles: any[];
}

const ThemeCustomizer = ({ config, setConfig, themeStyles }: ThemeCustomizerProps) => {
  const baseTheme = advancedThemes[config.themeStyle] || advancedThemes.minimal;
  const currentTheme = getNavigationThemeDefaults(config.navigationStyle || 'left-full', baseTheme);

  // Apply custom theme updates if they exist
  const finalTheme = config.customTheme ? { ...currentTheme, ...config.customTheme } : currentTheme;

  // Sample data for charts
  const sampleChartData = [
    { name: 'Jan', value: 400, sales: 240 },
    { name: 'Feb', value: 300, sales: 139 },
    { name: 'Mar', value: 200, sales: 980 },
    { name: 'Apr', value: 278, sales: 390 },
    { name: 'May', value: 189, sales: 480 },
  ];

  const samplePieData = [
    { name: 'Product A', value: 400, color: finalTheme.chartColors[0] },
    { name: 'Product B', value: 300, color: finalTheme.chartColors[1] },
    { name: 'Product C', value: 300, color: finalTheme.chartColors[2] },
    { name: 'Product D', value: 200, color: finalTheme.chartColors[3] },
  ];

  const generateRandomPalette = () => {
    const colorSets = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      ['#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894'],
      ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00CEC9'],
      ['#00CEC9', '#55A3FF', '#FDCB6E', '#FF7675', '#6C5CE7'],
      ['#E17055', '#00B894', '#FDCB6E', '#74B9FF', '#A29BFE']
    ];
    const randomPalette = colorSets[Math.floor(Math.random() * colorSets.length)];
    const extendedPalette = generateColorPalette(randomPalette);
    
    // Update both color palette and component colors based on palette
    const updatedTheme = updateThemeFromPalette(extendedPalette, finalTheme);
    
    setConfig(prev => ({ 
      ...prev, 
      colorPalette: extendedPalette,
      customTheme: {
        ...prev.customTheme,
        ...updatedTheme
      }
    }));
    
    toast.success("Color palette and component colors updated!");
  };

  const copyThemeConfig = () => {
    const themeConfig = {
      style: config.themeStyle,
      colors: finalTheme,
      palette: config.colorPalette
    };
    navigator.clipboard.writeText(JSON.stringify(themeConfig, null, 2));
    toast.success("Theme configuration copied to clipboard!");
  };

  const updateThemeColor = (colorKey: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      customTheme: {
        ...prev.customTheme,
        [colorKey]: value
      }
    }));
  };

  const renderNavigationPreview = (navStyle: string) => {
    const navTheme = getNavigationThemeDefaults(navStyle, baseTheme);
    
    return (
      <div className="space-y-2">
        <div 
          className="p-3 rounded border"
          style={{ 
            backgroundColor: navTheme.navigationBackground,
            borderColor: navTheme.navigationBorder 
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: navTheme.navigationText }} className="font-medium">
              Dashboard
            </span>
            <span style={{ color: navTheme.navigationTextSecondary }} className="text-sm">
              {navStyle.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <div 
              className="px-2 py-1 rounded text-xs"
              style={{ 
                backgroundColor: navTheme.navigationActive,
                color: navTheme.navigationText 
              }}
            >
              Active
            </div>
            <div 
              className="px-2 py-1 rounded text-xs"
              style={{ 
                backgroundColor: navTheme.navigationHover,
                color: navTheme.navigationTextSecondary 
              }}
            >
              Hover
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSampleFilter = (filter: any) => {
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm" style={{ color: currentTheme.textSecondary }}>{filter.label}</Label>
            <Select>
              <SelectTrigger 
                className="w-full h-8 text-sm"
                style={{ 
                  backgroundColor: currentTheme.inputBackground,
                  borderColor: currentTheme.inputBorder,
                  color: currentTheme.textPrimary
                }}
              >
                <SelectValue placeholder={filter.options[0]} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option: string) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm" style={{ color: currentTheme.textSecondary }}>{filter.label}</Label>
            <div className="space-y-1">
              {filter.options.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={`${filter.id}-${option}`} />
                  <Label 
                    htmlFor={`${filter.id}-${option}`} 
                    className="text-xs"
                    style={{ color: currentTheme.textPrimary }}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="w-5 h-5" />
            Advanced Theme System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="styles" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="styles">Styles</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="palette">Palette</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="styles" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {themeStyles.map((theme) => (
                  <Card 
                    key={theme.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      config.themeStyle === theme.value 
                        ? 'ring-2 ring-blue-500' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, themeStyle: theme.value }))}
                  >
                    <CardContent className="p-4">
                      <div className={`w-full h-16 rounded-lg mb-3 ${theme.preview}`} />
                      <div className="text-sm font-medium text-center">{theme.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Background Colors */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Background Colors</Label>
                  {['primary', 'secondary', 'surface', 'background'].map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: finalTheme[key as keyof typeof finalTheme] as string }}
                      />
                      <Label className="text-xs capitalize">{key}</Label>
                      <Input
                        value={finalTheme[key as keyof typeof finalTheme] as string}
                        onChange={(e) => updateThemeColor(key, e.target.value)}
                        className="text-xs font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  ))}
                </div>

                {/* State Colors */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">State Colors</Label>
                  {['positive', 'negative', 'warning', 'info'].map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: finalTheme[key as keyof typeof finalTheme] as string }}
                      />
                      <Label className="text-xs capitalize">{key}</Label>
                      <Input
                        value={finalTheme[key as keyof typeof finalTheme] as string}
                        onChange={(e) => updateThemeColor(key, e.target.value)}
                        className="text-xs font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Navigation Styles Preview
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['top-wide', 'top-tabs', 'top-minimal', 'left-full'].map((style) => (
                    <div key={style} className="space-y-2">
                      <Label className="text-sm font-medium capitalize">
                        {style.replace('-', ' ')}
                      </Label>
                      {renderNavigationPreview(style)}
                    </div>
                  ))}
                </div>

                {/* Filter Layouts Preview */}
                <div className="mt-6">
                  <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4" />
                    Filter Layouts (Select One)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filterLayouts.map((layout) => (
                      <Card 
                        key={layout.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          config.selectedFilterLayout === layout.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, selectedFilterLayout: layout.id }))}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium text-sm mb-1">{layout.name}</div>
                          <div className="text-xs text-gray-500 mb-2">{layout.description}</div>
                          <Badge variant="outline" className="text-xs">
                            {layout.preview}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {config.selectedFilterLayout && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                      Selected: <strong>{filterLayouts.find(l => l.id === config.selectedFilterLayout)?.name}</strong>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Component Colors
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Buttons & Inputs</Label>
                    {['buttonPrimary', 'buttonSecondary', 'buttonHover', 'inputBackground', 'inputBorder', 'inputFocus'].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: finalTheme[key as keyof typeof finalTheme] as string }}
                        />
                        <Label className="text-xs capitalize">{key.replace('button', '').replace('input', '')}</Label>
                        <Input
                          value={finalTheme[key as keyof typeof finalTheme] as string}
                          onChange={(e) => updateThemeColor(key, e.target.value)}
                          className="text-xs font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Badge Colors</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(finalTheme.badgeColors || []).map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                          />
                          <Input
                            value={color}
                            onChange={(e) => {
                              const newBadges = [...(finalTheme.badgeColors || [])];
                              newBadges[index] = e.target.value;
                              setConfig(prev => ({ ...prev, customTheme: { ...prev.customTheme, badgeColors: newBadges } }));
                            }}
                            className="text-xs font-mono"
                            placeholder="#000000"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="palette" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Chart Color Palette</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomPalette}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate & Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyThemeConfig}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Config
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {(config.colorPalette || finalTheme.chartColors).map((color: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div 
                      className="w-full h-16 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                    <Input
                      value={color}
                      onChange={(e) => {
                        const newPalette = [...(config.colorPalette || finalTheme.chartColors)];
                        newPalette[index] = e.target.value;
                        const updatedTheme = updateThemeFromPalette(newPalette, finalTheme);
                        setConfig(prev => ({ 
                          ...prev, 
                          colorPalette: newPalette,
                          customTheme: {
                            ...prev.customTheme,
                            ...updatedTheme
                          }
                        }));
                      }}
                      className="font-mono text-xs"
                      placeholder="#000000"
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded">
                <strong>Note:</strong> Changing colors here will also update button colors, focus colors, and other component colors automatically.
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Live Theme Preview
                </Label>
                
                {/* Theme Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card style={{ backgroundColor: finalTheme.cardBackground, borderColor: finalTheme.cardBorder }}>
                    <CardHeader>
                      <CardTitle style={{ color: finalTheme.textPrimary }}>KPI Card Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" style={{ color: finalTheme.positive }}>$45,280</div>
                      <div className="text-sm" style={{ color: finalTheme.textSecondary }}>+12.5% vs last month</div>
                      <div className="mt-2 h-2 rounded" style={{ backgroundColor: finalTheme.progressBackground }}>
                        <div 
                          className="h-full w-3/4 rounded" 
                          style={{ backgroundColor: finalTheme.progressFill }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ backgroundColor: finalTheme.cardBackground, borderColor: finalTheme.cardBorder }}>
                    <CardHeader>
                      <CardTitle style={{ color: finalTheme.textPrimary }}>Navigation Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="p-3 rounded mb-3"
                        style={{ backgroundColor: finalTheme.navigationBackground, borderColor: finalTheme.navigationBorder }}
                      >
                        <div className="flex items-center justify-between">
                          <span style={{ color: finalTheme.navigationText }} className="font-medium">Dashboard</span>
                          <span style={{ color: finalTheme.navigationTextSecondary }} className="text-sm">Navigation</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: finalTheme.buttonPrimary, color: 'white' }}
                        >
                          Primary
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          style={{ backgroundColor: finalTheme.buttonSecondary, color: 'white' }}
                        >
                          Secondary
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sample Charts Preview */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Sample Charts with Current Theme</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Bar Chart */}
                    <Card style={{ backgroundColor: finalTheme.cardBackground, borderColor: finalTheme.cardBorder }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: finalTheme.textPrimary }}>Bar Chart</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sampleChartData}>
                              <XAxis dataKey="name" fontSize={10} stroke={finalTheme.chartAxes} />
                              <YAxis fontSize={10} stroke={finalTheme.chartAxes} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: finalTheme.tooltipBackground,
                                  border: `1px solid ${finalTheme.tooltipBorder}`,
                                  color: finalTheme.tooltipText
                                }}
                              />
                              <Bar dataKey="value" fill={finalTheme.chartColors[0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Line Chart */}
                    <Card style={{ backgroundColor: finalTheme.cardBackground, borderColor: finalTheme.cardBorder }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: finalTheme.textPrimary }}>Line Chart</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleChartData}>
                              <XAxis dataKey="name" fontSize={10} stroke={finalTheme.chartAxes} />
                              <YAxis fontSize={10} stroke={finalTheme.chartAxes} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: finalTheme.tooltipBackground,
                                  border: `1px solid ${finalTheme.tooltipBorder}`,
                                  color: finalTheme.tooltipText
                                }}
                              />
                              <Line type="monotone" dataKey="sales" stroke={finalTheme.chartColors[1]} strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card style={{ backgroundColor: finalTheme.cardBackground, borderColor: finalTheme.cardBorder }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: finalTheme.textPrimary }}>Pie Chart</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={samplePieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={50}
                                dataKey="value"
                              >
                                {samplePieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: finalTheme.tooltipBackground,
                                  border: `1px solid ${finalTheme.tooltipBorder}`,
                                  color: finalTheme.tooltipText
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Enhanced Color Swatches */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Color Swatches</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(finalTheme).filter(([key]) => 
                      ['positive', 'negative', 'warning', 'info'].includes(key)
                    ).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div 
                          className="w-full h-12 rounded-lg mb-2 border"
                          style={{ backgroundColor: color as string }}
                        />
                        <Label className="text-xs capitalize">{key}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <Label className="text-xs font-semibold col-span-4">Chart Colors</Label>
                    {(finalTheme.chartColors || []).map((color, i) => (
                      <div key={i} className="h-8 rounded border" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeCustomizer;
