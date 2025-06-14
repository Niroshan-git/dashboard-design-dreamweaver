
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileDown, Eye, BarChart3, TrendingUp, PieChart, Map, Grid3X3, Target, Users, DollarSign, Clock, Filter } from "lucide-react";

interface DashboardPreviewProps {
  config: any;
  onExport: (format: string) => void;
}

const DashboardPreview = ({ config, onExport }: DashboardPreviewProps) => {
  const getIconForVisual = (visual: string) => {
    const iconMap: { [key: string]: any } = {
      'kpi-cards': Target,
      'metric-tiles': Grid3X3,
      'progress-bars': TrendingUp,
      'line-charts': TrendingUp,
      'bar-charts': BarChart3,
      'pie-charts': PieChart,
      'area-charts': TrendingUp,
      'filters': Filter,
      'time-controls': Clock,
      'drill-down': Grid3X3,
      'heatmaps': Grid3X3,
      'geo-maps': Map,
      'funnel-charts': TrendingUp,
      'scatter-plots': Target
    };
    return iconMap[visual] || BarChart3;
  };

  const generateMockData = () => {
    const mockKPIs = [
      { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up' },
      { label: 'Active Users', value: '45.2K', change: '+8.3%', trend: 'up' },
      { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down' },
      { label: 'Customer Satisfaction', value: '94.2%', change: '+5.7%', trend: 'up' }
    ];
    return mockKPIs.slice(0, config.complexity === 'simple' ? 2 : config.complexity === 'moderate' ? 3 : 4);
  };

  const mockKPIs = generateMockData();

  const getThemeClasses = () => {
    switch (config.themeStyle) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'minimal':
        return 'bg-white text-gray-900';
      case 'corporate':
        return 'bg-blue-50 text-blue-900';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-900';
      case 'creative':
        return 'bg-gradient-to-br from-yellow-100 to-red-100 text-red-900';
      case 'flat':
        return 'bg-emerald-50 text-emerald-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  if (!config.dashboardType || !config.complexity || !config.themeStyle) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Dashboard Preview</p>
            <p className="text-sm">Complete the configuration to see your dashboard preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Dashboard Preview
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{config.dashboardType}</Badge>
            <Badge variant="outline">{config.complexity} complexity</Badge>
            <Badge variant="outline">{config.pages} page{config.pages > 1 ? 's' : ''}</Badge>
            <Badge variant="outline">{config.visuals.length} components</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{config.pages}</div>
              <div className="text-sm text-gray-500">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{config.visuals.length}</div>
              <div className="text-sm text-gray-500">Components</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{config.colorPalette.length}</div>
              <div className="text-sm text-gray-500">Colors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{config.exportFormats.length}</div>
              <div className="text-sm text-gray-500">Export Formats</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-6 rounded-lg ${getThemeClasses()}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: config.colorPalette[0] }}>
                {config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1)} Dashboard
              </h2>
              <div className="flex gap-2">
                {config.colorPalette.map((color: string, index: number) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {mockKPIs.map((kpi, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-white/20 backdrop-blur-sm"
                  style={{ backgroundColor: `${config.colorPalette[index % config.colorPalette.length]}20` }}
                >
                  <div className="text-sm opacity-75 mb-1">{kpi.label}</div>
                  <div className="text-2xl font-bold" style={{ color: config.colorPalette[index % config.colorPalette.length] }}>
                    {kpi.value}
                  </div>
                  <div className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Components */}
            {config.visuals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.visuals.slice(0, 6).map((visual: string, index: number) => {
                  const IconComponent = getIconForVisual(visual);
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-white/20 backdrop-blur-sm h-32 flex flex-col items-center justify-center"
                      style={{ backgroundColor: `${config.colorPalette[index % config.colorPalette.length]}15` }}
                    >
                      <IconComponent 
                        className="w-8 h-8 mb-2" 
                        style={{ color: config.colorPalette[index % config.colorPalette.length] }} 
                      />
                      <div className="text-sm font-medium text-center opacity-75">
                        {visual.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      {config.exportFormats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="w-5 h-5" />
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {config.exportFormats.map((format: string) => (
                <Button
                  key={format}
                  variant="outline"
                  onClick={() => onExport(format)}
                  className="flex items-center gap-2 h-auto p-4 flex-col"
                >
                  <FileDown className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPreview;
