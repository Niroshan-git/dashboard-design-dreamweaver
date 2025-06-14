
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, PieChart, Map, Grid3X3, Clock, Filter, Target, Users, DollarSign } from "lucide-react";

interface VisualSelectorProps {
  config: any;
  setConfig: (config: any) => void;
}

const VisualSelector = ({ config, setConfig }: VisualSelectorProps) => {
  const visualComponents = [
    {
      category: "Key Performance Indicators",
      items: [
        { value: "kpi-cards", label: "KPI Cards", icon: Target, description: "Key metrics with trend indicators" },
        { value: "metric-tiles", label: "Metric Tiles", icon: Grid3X3, description: "Compact metric displays" },
        { value: "progress-bars", label: "Progress Indicators", icon: TrendingUp, description: "Goal completion tracking" }
      ]
    },
    {
      category: "Charts & Graphs",
      items: [
        { value: "line-charts", label: "Time Series Charts", icon: TrendingUp, description: "Trend analysis over time" },
        { value: "bar-charts", label: "Bar Charts", icon: BarChart3, description: "Category comparisons" },
        { value: "pie-charts", label: "Pie Charts", icon: PieChart, description: "Proportion visualization" },
        { value: "area-charts", label: "Area Charts", icon: TrendingUp, description: "Volume over time" }
      ]
    },
    {
      category: "Interactive Elements",
      items: [
        { value: "filters", label: "Filter Controls", icon: Filter, description: "Date, category, and custom filters" },
        { value: "time-controls", label: "Time Controls", icon: Clock, description: "Time range selectors" },
        { value: "drill-down", label: "Drill-down Tables", icon: Grid3X3, description: "Detailed data exploration" }
      ]
    },
    {
      category: "Specialized Visuals",
      items: [
        { value: "heatmaps", label: "Heatmaps", icon: Grid3X3, description: "Data density visualization" },
        { value: "geo-maps", label: "Geographic Maps", icon: Map, description: "Location-based analytics" },
        { value: "funnel-charts", label: "Funnel Charts", icon: TrendingUp, description: "Conversion tracking" },
        { value: "scatter-plots", label: "Scatter Plots", icon: Target, description: "Correlation analysis" }
      ]
    }
  ];

  const handleVisualToggle = (visualValue: string, checked: boolean) => {
    if (checked) {
      setConfig(prev => ({ ...prev, visuals: [...prev.visuals, visualValue] }));
    } else {
      setConfig(prev => ({ ...prev, visuals: prev.visuals.filter(v => v !== visualValue) }));
    }
  };

  const getComplexityRecommendations = () => {
    switch (config.complexity) {
      case "simple":
        return ["kpi-cards", "line-charts", "bar-charts"];
      case "moderate":
        return ["kpi-cards", "line-charts", "bar-charts", "pie-charts", "filters", "time-controls"];
      case "complex":
        return ["kpi-cards", "line-charts", "bar-charts", "heatmaps", "geo-maps", "filters", "time-controls", "drill-down"];
      default:
        return [];
    }
  };

  const recommendations = getComplexityRecommendations();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Visual Components Selection
          </CardTitle>
          {config.complexity && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Recommended for {config.complexity} complexity:</span>
              <div className="flex gap-1 flex-wrap">
                {recommendations.map(rec => (
                  <Badge key={rec} variant="secondary" className="text-xs">
                    {visualComponents.flatMap(cat => cat.items).find(item => item.value === rec)?.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {visualComponents.map((category) => (
            <div key={category.category} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item) => {
                  const isSelected = config.visuals.includes(item.value);
                  const isRecommended = recommendations.includes(item.value);
                  const IconComponent = item.icon;
                  
                  return (
                    <Card 
                      key={item.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      } ${isRecommended ? 'border-green-300' : ''}`}
                      onClick={() => handleVisualToggle(item.value, !isSelected)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <IconComponent className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">{item.label}</span>
                              {isRecommended && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Selected Visuals Summary */}
      {config.visuals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Components ({config.visuals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.visuals.map((visual) => {
                const item = visualComponents.flatMap(cat => cat.items).find(item => item.value === visual);
                const isRecommended = recommendations.includes(visual);
                return item ? (
                  <Badge 
                    key={visual} 
                    variant={isRecommended ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    <item.icon className="w-3 h-3" />
                    {item.label}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualSelector;
