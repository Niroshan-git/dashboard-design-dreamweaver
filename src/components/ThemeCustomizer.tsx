
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";

interface ThemeCustomizerProps {
  config: any;
  setConfig: (config: any) => void;
  themeStyles: any[];
}

const ThemeCustomizer = ({ config, setConfig, themeStyles }: ThemeCustomizerProps) => {
  const generateRandomPalette = () => {
    const colors = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      ['#96CEB4', '#FFEAA7', '#DDA0DD'],
      ['#74B9FF', '#A29BFE', '#FD79A8'],
      ['#00B894', '#FDCB6E', '#E17055'],
      ['#6C5CE7', '#A29BFE', '#FD79A8'],
      ['#00CEC9', '#55A3FF', '#FDCB6E']
    ];
    const randomPalette = colors[Math.floor(Math.random() * colors.length)];
    setConfig(prev => ({ ...prev, colorPalette: randomPalette }));
    toast.success("New color palette generated!");
  };

  const copyPalette = () => {
    navigator.clipboard.writeText(config.colorPalette.join(', '));
    toast.success("Color palette copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Style Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme Style</Label>
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
          </div>

          <Separator />

          {/* Color Palette */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Color Palette</Label>
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
                  onClick={copyPalette}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {config.colorPalette.map((color: string, index: number) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm">Color {index + 1}</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                    <Input
                      value={color}
                      onChange={(e) => {
                        const newPalette = [...config.colorPalette];
                        newPalette[index] = e.target.value;
                        setConfig(prev => ({ ...prev, colorPalette: newPalette }));
                      }}
                      className="font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Theme Preview */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme Preview</Label>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: config.colorPalette[0] }}>
                  Dashboard Preview
                </h3>
                <div className="flex gap-2">
                  {config.colorPalette.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: config.colorPalette[0] }}
                >
                  KPI Card
                </div>
                <div 
                  className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: config.colorPalette[1] }}
                >
                  Chart Area
                </div>
                <div 
                  className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: config.colorPalette[2] }}
                >
                  Filter Panel
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeCustomizer;
