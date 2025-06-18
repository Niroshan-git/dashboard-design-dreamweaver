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
import { advancedThemes, generateColorPalette, getNavigationThemeDefaults } from "@/utils/advancedThemeSystem";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ThemeCustomizerProps {
  config: any;
  setConfig: (config: any) => void;
  themeStyles: any[];
}

const ThemeCustomizer = ({ config, setConfig, themeStyles }: ThemeCustomizerProps) => {
  const baseTheme = advancedThemes[config.themeStyle] || advancedThemes.minimal;
  const currentTheme = getNavigationThemeDefaults(config.navigationStyle || 'left-full', baseTheme);

  // Sample data for charts
  const sampleChartData = [
    { name: 'Jan', value: 400, sales: 240 },
    { name: 'Feb', value: 300, sales: 139 },
    { name: 'Mar', value: 200, sales: 980 },
    { name: 'Apr', value: 278, sales: 390 },
    { name: 'May', value: 189, sales: 480 },
  ];

  const samplePieData = [
    { name: 'Product A', value: 400, color: currentTheme.chartColors[0] },
    { name: 'Product B', value: 300, color: currentTheme.chartColors[1] },
    { name: 'Product C', value: 300, color: currentTheme.chartColors[2] },
    { name: 'Product D', value: 200, color: currentTheme.chartColors[3] },
  ];

  // Sample filter options
  const sampleFilters = [
    { id: 'category', label: 'Category', type: 'select', options: ['All', 'Sales', 'Marketing', 'Finance'] },
    { id: 'dateRange', label: 'Date Range', type: 'select', options: ['Last 7 days', 'Last 30 days', 'Last 90 days'] },
    { id: 'status', label: 'Status', type: 'checkbox', options: ['Active', 'Pending', 'Completed'] },
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
    setConfig(prev => ({ ...prev, colorPalette: extendedPalette }));
    toast.success("New advanced color palette generated!");
  };

  const copyThemeConfig = () => {
    const themeConfig = {
      style: config.themeStyle,
      colors: currentTheme,
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
                        style={{ backgroundColor: currentTheme[key as keyof typeof currentTheme] as string }}
                      />
                      <Label className="text-xs capitalize">{key}</Label>
                      <Input
                        value={currentTheme[key as keyof typeof currentTheme] as string}
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
                        style={{ backgroundColor: currentTheme[key as keyof typeof currentTheme] as string }}
                      />
                      <Label className="text-xs capitalize">{key}</Label>
                      <Input
                        value={currentTheme[key as keyof typeof currentTheme] as string}
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
                  Navigation Colors for {config.navigationStyle?.replace('-', ' ').toUpperCase() || 'LEFT FULL'}
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Navigation Base</Label>
                    {['navigationBackground', 'navigationBorder', 'navigationText'].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: currentTheme[key as keyof typeof currentTheme] as string }}
                        />
                        <Label className="text-xs">{key.replace('navigation', '')}</Label>
                        <Input
                          value={currentTheme[key as keyof typeof currentTheme] as string}
                          onChange={(e) => updateThemeColor(key, e.target.value)}
                          className="text-xs font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Navigation States</Label>
                    {['navigationTextSecondary', 'navigationHover', 'navigationActive'].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: currentTheme[key as keyof typeof currentTheme] as string }}
                        />
                        <Label className="text-xs">{key.replace('navigation', '')}</Label>
                        <Input
                          value={currentTheme[key as keyof typeof currentTheme] as string}
                          onChange={(e) => updateThemeColor(key, e.target.value)}
                          className="text-xs font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Filter Preview */}
                <div className="mt-6">
                  <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4" />
                    Sample Filters Preview
                  </Label>
                  <Card style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.cardBorder }}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sampleFilters.map(renderSampleFilter)}
                      </div>
                    </CardContent>
                  </Card>
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
                          style={{ backgroundColor: currentTheme[key as keyof typeof currentTheme] as string }}
                        />
                        <Label className="text-xs capitalize">{key.replace('button', '').replace('input', '')}</Label>
                        <Input
                          value={currentTheme[key as keyof typeof currentTheme] as string}
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
                      {(currentTheme.badgeColors || []).map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                          />
                          <Input
                            value={color}
                            onChange={(e) => {
                              const newBadges = [...(currentTheme.badgeColors || [])];
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
                    Generate
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
                {(config.colorPalette || currentTheme.chartColors).map((color: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div 
                      className="w-full h-16 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                    <Input
                      value={color}
                      onChange={(e) => {
                        const newPalette = [...(config.colorPalette || currentTheme.chartColors)];
                        newPalette[index] = e.target.value;
                        setConfig(prev => ({ ...prev, colorPalette: newPalette }));
                      }}
                      className="font-mono text-xs"
                      placeholder="#000000"
                    />
                  </div>
                ))}
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
                  <Card style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.cardBorder }}>
                    <CardHeader>
                      <CardTitle style={{ color: currentTheme.textPrimary }}>KPI Card Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" style={{ color: currentTheme.positive }}>$45,280</div>
                      <div className="text-sm" style={{ color: currentTheme.textSecondary }}>+12.5% vs last month</div>
                      <div className="mt-2 h-2 rounded" style={{ backgroundColor: currentTheme.progressBackground }}>
                        <div 
                          className="h-full w-3/4 rounded" 
                          style={{ backgroundColor: currentTheme.progressFill }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.cardBorder }}>
                    <CardHeader>
                      <CardTitle style={{ color: currentTheme.textPrimary }}>Navigation Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="p-3 rounded mb-3"
                        style={{ backgroundColor: currentTheme.navigationBackground, borderColor: currentTheme.navigationBorder }}
                      >
                        <div className="flex items-center justify-between">
                          <span style={{ color: currentTheme.navigationText }} className="font-medium">Dashboard</span>
                          <span style={{ color: currentTheme.navigationTextSecondary }} className="text-sm">Navigation</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: currentTheme.buttonPrimary, color: 'white' }}
                        >
                          Primary
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          style={{ backgroundColor: currentTheme.buttonSecondary, color: 'white' }}
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
                    <Card style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.cardBorder }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: currentTheme.textPrimary }}>Bar Chart</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sampleChartData}>
                              <XAxis dataKey="name" fontSize={10} stroke={currentTheme.chartAxes} />
                              <YAxis fontSize={10} stroke={currentTheme.chartAxes} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: currentTheme.tooltipBackground,
                                  border: `1px solid ${currentTheme.tooltipBorder}`,
                                  color: currentTheme.tooltipText
                                }}
                              />
                              <Bar dataKey="value" fill={currentTheme.chartColors[0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Line Chart */}
                    <Card style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.cardBorder }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: currentTheme.textPrimary }}>Line Chart</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sampleChartData}>
                              <XAxis dataKey="name" fontSize={10} stroke={currentTheme.chartAxes} />
                              <YAxis fontSize={10} stroke={currentTheme.chartAxes} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: currentTheme.tooltipBackground,
                                  border: `1px solid ${currentTheme.tooltipBorder}`,
                                  color: currentTheme.tooltipText
                                }}
                              />
                              <Line type="monotone" dataKey="sales" stroke={currentTheme.chartColors[1]} strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.cardBorder }}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: currentTheme.textPrimary }}>Pie Chart</CardTitle>
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
                                  backgroundColor: currentTheme.tooltipBackground,
                                  border: `1px solid ${currentTheme.tooltipBorder}`,
                                  color: currentTheme.tooltipText
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
                    {Object.entries(currentTheme).filter(([key]) => 
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
                    {(currentTheme.chartColors || []).map((color, i) => (
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
