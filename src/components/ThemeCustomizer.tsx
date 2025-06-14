
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, RefreshCw, Copy, Paintbrush, Eye } from "lucide-react";
import { toast } from "sonner";
import { advancedThemes, generateColorPalette } from "@/utils/advancedThemeSystem";

interface ThemeCustomizerProps {
  config: any;
  setConfig: (config: any) => void;
  themeStyles: any[];
}

const ThemeCustomizer = ({ config, setConfig, themeStyles }: ThemeCustomizerProps) => {
  const currentTheme = advancedThemes[config.themeStyle] || advancedThemes.minimal;

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="styles">Styles</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
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
                        style={{ background: currentTheme[key as keyof typeof currentTheme] }}
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
                        style={{ backgroundColor: currentTheme[key as keyof typeof currentTheme] }}
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
                      <CardTitle style={{ color: currentTheme.textPrimary }}>Chart Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-3">
                        {currentTheme.chartColors.slice(0, 4).map((color: string, i: number) => (
                          <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <div style={{ color: currentTheme.textSecondary }} className="text-sm">
                        Chart colors and theme integration
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Color Swatches */}
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeCustomizer;
