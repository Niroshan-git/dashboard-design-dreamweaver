import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Area, AreaChart } from "recharts";
import { DollarSign, Users, TrendingDown, User, TrendingUp, ShoppingCart, LayoutGrid, Image } from "lucide-react";

interface ComponentRendererProps {
  component: any;
  linkedVisual: any;
  themeColors: any;
  mockData: any;
  config: any;
  allComponents?: any[];
  dynamicHeight?: string;
}

const ComponentRenderer = ({ component, linkedVisual, themeColors, mockData, config, allComponents = [], dynamicHeight }: ComponentRendererProps) => {
  // Use exact same KPI data as layout preview but prioritize linked visual
  const getKPIData = () => [
    { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Users', value: '45.2K', change: '+8.3%', trend: 'up', icon: Users, color: 'text-blue-600' },
    { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down', icon: TrendingDown, color: 'text-red-600' },
    { label: 'Customer Satisfaction', value: '94.2%', change: '+5.7%', trend: 'up', icon: User, color: 'text-purple-600' },
    { label: 'Sales Growth', value: '18.4%', change: '+3.2%', trend: 'up', icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Monthly Orders', value: '1,284', change: '+15.8%', trend: 'up', icon: ShoppingCart, color: 'text-indigo-600' }
  ];

  // Get dynamic container height - Always use dynamic height when available
  const getContainerHeight = () => {
    if (dynamicHeight) {
      return { 
        height: dynamicHeight, 
        minHeight: dynamicHeight,
        maxHeight: dynamicHeight 
      };
    }
    return { height: '100%' };
  };

  // For charts, calculate content height more precisely
  const getChartContentHeight = () => {
    if (dynamicHeight) {
      // Subtract header and padding from dynamic height
      return `calc(${dynamicHeight} - 70px)`;
    }
    return '180px';
  };

  // Check if KPI should be enhanced (when it comes after a chart)
  const shouldEnhanceKPI = () => {
    if (!dynamicHeight || component.type !== 'kpi') return false;
    
    const currentRow = component.position?.row || 1;
    const currentCol = component.position?.col || 1;
    
    // Find components in the same row that come before this KPI
    const componentsInRow = allComponents.filter(comp => 
      comp.position?.row === currentRow && (comp.position?.col || 1) < currentCol
    );
    
    // Check if any preceding component is a chart
    return componentsInRow.some(comp => comp.type !== 'kpi');
  };

  const renderKPIComponent = () => {
    // Prioritize linked visual count over component count
    const kpiCount = linkedVisual?.kpiCount || component.kpiCount || linkedVisual?.count || 1;
    const kpiData = getKPIData();
    const kpisToShow = kpiData.slice(0, kpiCount);
    const isEnhanced = shouldEnhanceKPI();

    // For single KPI, just show one card
    if (kpiCount === 1) {
      const kpi = kpisToShow[0];
      const IconComponent = kpi.icon;
      
      const cardContent = (
        <Card 
          className="hover:shadow-md transition-shadow flex flex-col"
          style={{ 
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderColor,
            color: themeColors.textPrimary,
            ...getContainerHeight()
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 flex-shrink-0">
            <CardTitle className={`font-medium ${isEnhanced ? 'text-base' : 'text-sm'}`} style={{ color: themeColors.textSecondary }}>
              {linkedVisual ? linkedVisual.name : kpi.label}
            </CardTitle>
            <IconComponent className={`${isEnhanced ? 'h-6 w-6' : 'h-4 w-4'} ${kpi.color}`} />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center px-4 pb-4">
            <div className={`font-bold mb-2 ${isEnhanced ? 'text-4xl' : 'text-2xl'}`} style={{ color: themeColors.textPrimary }}>
              {kpi.value}
            </div>
            <div className="flex items-center mb-2">
              <Badge variant={kpi.trend === 'up' ? "secondary" : "destructive"} className={isEnhanced ? 'text-sm' : 'text-xs'}>
                {kpi.change}
              </Badge>
              <span className={`ml-2 ${isEnhanced ? 'text-sm' : 'text-xs'}`} style={{ color: themeColors.textSecondary }}>
                vs last period
              </span>
            </div>
            {isEnhanced && (
              <div className="mt-2 text-sm" style={{ color: themeColors.textSecondary }}>
                <div className="flex justify-between mb-1">
                  <span>Target: $3.0M</span>
                  <span>80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );

      if (config.tooltipsEnabled) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {cardContent}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-sm">{linkedVisual ? linkedVisual.description || 'KPI Card' : kpi.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return cardContent;
    }

    // For multiple KPIs, arrange them horizontally (max 4 per row)
    const maxKpisPerRow = Math.min(kpiCount, 4);
    
    return (
      <div className="grid gap-2 w-full" style={{ gridTemplateColumns: `repeat(${maxKpisPerRow}, 1fr)`, ...getContainerHeight() }}>
        {kpisToShow.map((kpi, index) => {
          const IconComponent = kpi.icon;
          
          const cardContent = (
            <Card 
              key={index} 
              className="hover:shadow-md transition-shadow h-full flex flex-col"
              style={{ 
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.borderColor,
                color: themeColors.textPrimary
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3 flex-shrink-0">
                <CardTitle className="text-xs font-medium truncate" style={{ color: themeColors.textSecondary }}>
                  {linkedVisual ? linkedVisual.name : kpi.label}
                </CardTitle>
                <IconComponent className={`h-3 w-3 flex-shrink-0 ${kpi.color}`} />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center px-3 pb-3">
                <div className="text-lg font-bold mb-1" style={{ color: themeColors.textPrimary }}>{kpi.value}</div>
                <div className="flex items-center">
                  <Badge variant={kpi.trend === 'up' ? "secondary" : "destructive"} className="text-xs px-1 py-0">
                    {kpi.change}
                  </Badge>
                  <span className="text-xs ml-1" style={{ color: themeColors.textSecondary }}>vs last</span>
                </div>
              </CardContent>
            </Card>
          );

          if (config.tooltipsEnabled) {
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {cardContent}
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">{linkedVisual ? linkedVisual.description || 'KPI Card' : kpi.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return cardContent;
        })}
      </div>
    );
  };

  const renderChartComponent = () => {
    const chartType = linkedVisual?.chartType || component.chartType || 'bar';
    const chartContentHeight = getChartContentHeight();
    
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 px-3 pt-3 pb-2">
          <CardTitle className="text-sm truncate" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`}
          </CardTitle>
          <CardDescription className="text-xs truncate" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Chart visualization' : 'Performance metrics over time'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-2">
          <div className="flex-1 min-h-0" style={{ height: chartContentHeight, minHeight: chartContentHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Category A', value: 45, color: themeColors.chartColors[0] },
                      { name: 'Category B', value: 30, color: themeColors.chartColors[1] },
                      { name: 'Category C', value: 25, color: themeColors.chartColors[2] }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[0, 1, 2].map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={themeColors.chartColors[i]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              ) : chartType === 'line' ? (
                <LineChart data={mockData.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="value" stroke={themeColors.chartColors[0]} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={mockData.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke={themeColors.chartColors[0]} fill={themeColors.chartColors[0]} fillOpacity={0.3} />
                </AreaChart>
              ) : (
                <BarChart data={mockData.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill={themeColors.chartColors[0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTableComponent = () => {
    const sampleData = [
      { id: 1, name: 'Product A', value: '$1,234', status: 'Active', date: '2024-01-15' },
      { id: 2, name: 'Product B', value: '$2,456', status: 'Pending', date: '2024-01-14' },
      { id: 3, name: 'Product C', value: '$789', status: 'Active', date: '2024-01-13' },
      { id: 4, name: 'Product D', value: '$3,456', status: 'Active', date: '2024-01-12' },
      { id: 5, name: 'Product E', value: '$567', status: 'Pending', date: '2024-01-11' },
    ];

    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Data Table'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Table data' : 'Tabular data representation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-2">
          <div className="flex-1 overflow-auto border rounded" style={{ borderColor: themeColors.borderColor }}>
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ backgroundColor: themeColors.cardBackground }}>
                <tr className="border-b" style={{ borderColor: themeColors.borderColor }}>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Name</th>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Value</th>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Status</th>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50" style={{ borderColor: themeColors.borderColor }}>
                    <td className="p-2" style={{ color: themeColors.textPrimary }}>{row.name}</td>
                    <td className="p-2" style={{ color: themeColors.textPrimary }}>{row.value}</td>
                    <td className="p-2">
                      <Badge variant={row.status === 'Active' ? 'secondary' : 'outline'} className="text-xs">{row.status}</Badge>
                    </td>
                    <td className="p-2 text-xs" style={{ color: themeColors.textSecondary }}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProgressComponent = () => {
    const progressData = [
      { label: 'Sales Target', value: 85, color: 'bg-blue-500' },
      { label: 'Customer Satisfaction', value: 92, color: 'bg-green-500' },
      { label: 'Project Completion', value: 67, color: 'bg-yellow-500' },
      { label: 'Team Performance', value: 78, color: 'bg-purple-500' }
    ];

    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Progress Indicators'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Goal completion tracking' : 'Goal completion tracking'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center px-3 pb-3">
          <div className="space-y-4">
            {progressData.map((item, index) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ color: themeColors.textPrimary }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: themeColors.textPrimary }}>
                    {item.value}%
                  </span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTextComponent = () => {
    const textContent = linkedVisual?.textContent || component.textContent || 'Welcome to your Dashboard! This is your central hub for monitoring key metrics and insights. Navigate through different sections to explore your data and make informed decisions.';
    
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardContent className="p-4 flex flex-col justify-center flex-1">
          <div style={{ color: themeColors.textPrimary }} className="prose max-w-none">
            <h3 className="text-base font-semibold mb-2">
              {linkedVisual ? linkedVisual.name : 'Dashboard Welcome Message'}
            </h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {textContent}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderImageComponent = () => {
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardContent className="p-4 flex items-center justify-center flex-1">
          <div className="text-center" style={{ color: themeColors.textSecondary }}>
            <Image className="w-12 h-12 mx-auto mb-3" />
            <h4 className="font-medium mb-1 text-sm" style={{ color: themeColors.textPrimary }}>
              {linkedVisual ? linkedVisual.name : 'Image Component'}
            </h4>
            <p className="text-xs">
              {linkedVisual ? linkedVisual.description || 'Image placeholder' : 'Image visualization placeholder'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderHeatmapComponent = () => {
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Heatmap Visualization'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Heatmap data visualization' : 'Interactive heatmap display'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-2">
          <div className="grid grid-cols-7 gap-0.5 w-full max-w-full">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor: themeColors.chartColors[i % themeColors.chartColors.length],
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderScatterComponent = () => {
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Scatter Plot'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Scatter plot visualization' : 'Data point correlation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-2">
          <div className="flex-1 min-h-0" style={{ minHeight: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip />
                <Bar dataKey="sales" fill={themeColors.chartColors[0]} />
                <Bar dataKey="users" fill={themeColors.chartColors[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFunnelComponent = () => {
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Funnel Chart'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description ||'Funnel visualization' : 'Conversion funnel analysis'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center p-2">
          <div className="space-y-2">
            {['Visitors', 'Leads', 'Opportunities', 'Customers'].map((stage, index) => {
              const width = 100 - (index * 20);
              return (
                <div key={stage} className="flex items-center gap-2">
                  <div className="w-16 text-xs" style={{ color: themeColors.textPrimary }}>{stage}</div>
                  <div className="flex-1">
                    <div
                      className="h-6 flex items-center justify-center rounded text-xs font-medium"
                      style={{
                        width: `${width}%`,
                        backgroundColor: themeColors.chartColors[index % themeColors.chartColors.length],
                        color: 'white'
                      }}
                    >
                      {1000 - (index * 200)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDefaultComponent = () => {
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardContent className="p-4 flex items-center justify-center flex-1">
          <div className="text-center" style={{ color: themeColors.textSecondary }}>
            <LayoutGrid className="w-8 h-8 mx-auto mb-3" />
            <h4 className="font-medium mb-1 text-sm" style={{ color: themeColors.textPrimary }}>
              {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
            </h4>
            <p className="text-xs">Component preview</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  switch (component.type) {
    case 'kpi':
      return renderKPIComponent();
    case 'chart':
      return renderChartComponent();
    case 'table':
      return renderTableComponent();
    case 'progress':
      return renderProgressComponent();
    case 'text':
      return renderTextComponent();
    case 'image':
      return renderImageComponent();
    case 'heatmap':
      return renderHeatmapComponent();
    case 'scatter':
      return renderScatterComponent();
    case 'funnel':
      return renderFunnelComponent();
    default:
      return renderDefaultComponent();
  }
};

export default ComponentRenderer;
