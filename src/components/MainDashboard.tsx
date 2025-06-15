import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Area, AreaChart } from "recharts";
import { CircleDot, TrendingUp, TrendingDown, MoreHorizontal, User, Calendar, DollarSign, Activity, ChevronRight, ChevronDown, Filter, Download, Users, ShoppingCart, Package, Clock, LayoutGrid, Table, Type, Image, Target, Grid3X3, Map } from "lucide-react";

interface MainDashboardProps {
  config: any;
  currentPage?: number;
  onExport: (format: string) => void;
}

const MainDashboard = ({ config, currentPage = 0, onExport }: MainDashboardProps) => {
  console.log('MainDashboard - Current page:', currentPage);
  console.log('MainDashboard - Config:', config);
  
  const getCurrentPageLayout = () => {
    if (!config.layouts || !config.layouts[currentPage]) {
      return { pageId: currentPage, components: [] };
    }
    return config.layouts[currentPage];
  };

  const currentLayout = getCurrentPageLayout();
  const visuals = config.visuals || [];

  console.log('MainDashboard - Current layout:', currentLayout);
  console.log('MainDashboard - Available visuals:', visuals);

  const getThemeColors = () => {
    const themeStyle = config.themeStyle;
    const palette = config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626'];
    
    switch (themeStyle) {
      case 'dark':
        return {
          background: '#1f2937',
          cardBackground: '#374151',
          textPrimary: '#ffffff',
          textSecondary: '#d1d5db',
          borderColor: '#4b5563',
          chartColors: palette
        };
      case 'corporate':
        return {
          background: '#f8fafc',
          cardBackground: '#ffffff',
          textPrimary: '#1e293b',
          textSecondary: '#64748b',
          borderColor: '#e2e8f0',
          chartColors: palette
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.9)',
          textPrimary: '#1f2937',
          textSecondary: '#6b7280',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          chartColors: palette
        };
      case 'creative':
        return {
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.95)',
          textPrimary: '#1f2937',
          textSecondary: '#6b7280',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          chartColors: palette
        };
      case 'flat':
        return {
          background: '#ecf0f1',
          cardBackground: '#ffffff',
          textPrimary: '#2c3e50',
          textSecondary: '#7f8c8d',
          borderColor: '#bdc3c7',
          chartColors: palette
        };
      case 'minimal':
      default:
        return {
          background: '#ffffff',
          cardBackground: '#f9fafb',
          textPrimary: '#111827',
          textSecondary: '#6b7280',
          borderColor: '#e5e7eb',
          chartColors: palette
        };
    }
  };

  const themeColors = getThemeColors();

  // Mock data for charts and KPIs
  const getMockData = () => {
    const kpiData = [
      { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600' },
      { label: 'Active Users', value: '45.2K', change: '+8.3%', trend: 'up', icon: Users, color: 'text-blue-600' },
      { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down', icon: TrendingDown, color: 'text-red-600' },
      { label: 'Customer Satisfaction', value: '94.2%', change: '+5.7%', trend: 'up', icon: User, color: 'text-purple-600' },
      { label: 'Sales Growth', value: '18.4%', change: '+3.2%', trend: 'up', icon: TrendingUp, color: 'text-orange-600' },
      { label: 'Monthly Orders', value: '1,284', change: '+15.8%', trend: 'up', icon: ShoppingCart, color: 'text-indigo-600' }
    ];

    const chartData = [
      { month: 'Jan', value: 4000, sales: 2400, users: 1200 },
      { month: 'Feb', value: 3000, sales: 1398, users: 1100 },
      { month: 'Mar', value: 2000, sales: 9800, users: 1500 },
      { month: 'Apr', value: 2780, sales: 3908, users: 1300 },
      { month: 'May', value: 1890, sales: 4800, users: 1700 },
      { month: 'Jun', value: 2390, sales: 3800, users: 1400 }
    ];

    return { kpiData, chartData };
  };

  const mockData = getMockData();

  const renderKPIComponent = (component: any, linkedVisual: any) => {
    const kpiCount = linkedVisual?.kpiCount || component.kpiCount || 1;
    const kpisToShow = mockData.kpiData.slice(0, kpiCount);
    
    const getKpiGridCols = (count: number, span: number) => {
      if (span >= 12) return Math.min(count, 6);
      if (span >= 8) return Math.min(count, 4);
      if (span >= 6) return Math.min(count, 3);
      return Math.min(count, 2);
    };

    const gridCols = getKpiGridCols(kpiCount, component.span);

    return (
      <div 
        className="grid gap-4" 
        style={{ 
          gridTemplateColumns: `repeat(${gridCols}, 1fr)` 
        }}
      >
        {kpisToShow.map((kpi, index) => {
          const IconComponent = kpi.icon;
          
          const cardContent = (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow"
              style={{ 
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.borderColor,
                color: themeColors.textPrimary
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>
                  {linkedVisual ? linkedVisual.name : kpi.label}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: themeColors.textPrimary }}>{kpi.value}</div>
                <div className="flex items-center pt-1">
                  <Badge variant={kpi.trend === 'up' ? "secondary" : "destructive"} className="text-xs">
                    {kpi.change}
                  </Badge>
                  <span className="text-xs ml-2" style={{ color: themeColors.textSecondary }}>vs last period</span>
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

  const renderChartComponent = (component: any, linkedVisual: any) => {
    const chartType = component.chartType || linkedVisual?.chartType || 'bar';
    const chartCount = component.count || 1;
    
    return (
      <div className={`grid gap-4 ${chartCount > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} h-full`}>
        {Array.from({ length: chartCount }, (_, index) => (
          <Card key={index} className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardHeader>
              <CardTitle style={{ color: themeColors.textPrimary }}>
                {linkedVisual ? linkedVisual.name : `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart ${chartCount > 1 ? index + 1 : ''}`}
              </CardTitle>
              <CardDescription style={{ color: themeColors.textSecondary }}>
                {linkedVisual ? linkedVisual.description || 'Chart visualization' : 'Performance metrics over time'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
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
                      outerRadius={80}
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
                  <LineChart data={mockData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={themeColors.chartColors[0]} strokeWidth={2} />
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={mockData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="value" stroke={themeColors.chartColors[0]} fill={themeColors.chartColors[0]} fillOpacity={0.3} />
                  </AreaChart>
                ) : (
                  <BarChart data={mockData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="value" fill={themeColors.chartColors[0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTableComponent = (component: any, linkedVisual: any) => {
    const sampleData = [
      { id: 1, name: 'Product A', value: '$1,234', status: 'Active', date: '2024-01-15' },
      { id: 2, name: 'Product B', value: '$2,456', status: 'Pending', date: '2024-01-14' },
      { id: 3, name: 'Product C', value: '$789', status: 'Active', date: '2024-01-13' },
      { id: 4, name: 'Product D', value: '$3,456', status: 'Active', date: '2024-01-12' },
      { id: 5, name: 'Product E', value: '$567', status: 'Pending', date: '2024-01-11' },
    ];

    return (
      <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
        <CardHeader>
          <CardTitle style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Data Table'}
          </CardTitle>
          <CardDescription style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Table data' : 'Tabular data representation'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: themeColors.borderColor }}>
                  <th className="text-left p-2" style={{ color: themeColors.textPrimary }}>Name</th>
                  <th className="text-left p-2" style={{ color: themeColors.textPrimary }}>Value</th>
                  <th className="text-left p-2" style={{ color: themeColors.textPrimary }}>Status</th>
                  <th className="text-left p-2" style={{ color: themeColors.textPrimary }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50" style={{ borderColor: themeColors.borderColor }}>
                    <td className="p-2" style={{ color: themeColors.textPrimary }}>{row.name}</td>
                    <td className="p-2" style={{ color: themeColors.textPrimary }}>{row.value}</td>
                    <td className="p-2">
                      <Badge variant={row.status === 'Active' ? 'secondary' : 'outline'}>{row.status}</Badge>
                    </td>
                    <td className="p-2" style={{ color: themeColors.textSecondary }}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderHeatmapComponent = (component: any, linkedVisual: any) => {
    const heatmapData = Array.from({ length: 7 }, (_, week) =>
      Array.from({ length: 5 }, (_, day) => ({
        week,
        day,
        value: Math.floor(Math.random() * 100)
      }))
    ).flat();

    return (
      <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
        <CardHeader>
          <CardTitle style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Activity Heatmap'}
          </CardTitle>
          <CardDescription style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Activity patterns visualization' : 'Weekly activity patterns'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {heatmapData.map((item, index) => (
              <div
                key={index}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor: `rgba(${themeColors.chartColors[0].replace('#', '')}, ${item.value / 100})`
                }}
                title={`Week ${item.week + 1}, Day ${item.day + 1}: ${item.value}%`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFunnelComponent = (component: any, linkedVisual: any) => {
    const funnelData = [
      { stage: 'Visitors', value: 10000, percentage: 100 },
      { stage: 'Leads', value: 5000, percentage: 50 },
      { stage: 'Prospects', value: 2500, percentage: 25 },
      { stage: 'Customers', value: 1000, percentage: 10 }
    ];

    return (
      <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
        <CardHeader>
          <CardTitle style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Conversion Funnel'}
          </CardTitle>
          <CardDescription style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Conversion tracking' : 'Sales funnel analysis'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span style={{ color: themeColors.textPrimary }}>{stage.stage}</span>
                  <span className="text-sm" style={{ color: themeColors.textSecondary }}>
                    {stage.value.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4" style={{ width: `${100 - index * 15}%` }}>
                  <div
                    className="h-4 rounded-full"
                    style={{
                      backgroundColor: themeColors.chartColors[index % themeColors.chartColors.length],
                      width: `${stage.percentage}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProgressComponent = (component: any, linkedVisual: any) => {
    const progressData = [
      { label: 'Sales Target', value: 85, color: 'bg-blue-500' },
      { label: 'Customer Satisfaction', value: 92, color: 'bg-green-500' },
      { label: 'Project Completion', value: 67, color: 'bg-yellow-500' },
      { label: 'Team Performance', value: 78, color: 'bg-purple-500' }
    ];

    return (
      <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
        <CardHeader>
          <CardTitle style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Progress Indicators'}
          </CardTitle>
          <CardDescription style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Goal completion tracking' : 'Goal completion tracking'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

  const renderTextComponent = (component: any, linkedVisual: any) => {
    const textContent = linkedVisual?.textContent || component.textContent || 'Welcome to Dashboard';
    
    return (
      <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
        <CardContent className="p-6">
          <div style={{ color: themeColors.textPrimary }} className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">
              {linkedVisual ? linkedVisual.name : 'Welcome Message'}
            </h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {textContent}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComponent = (component: any, index: number) => {
    const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
    
    console.log('Rendering component:', component.type, 'with visual:', linkedVisual?.name);
    
    switch (component.type) {
      case 'kpi':
        return renderKPIComponent(component, linkedVisual);
      case 'chart':
        return renderChartComponent(component, linkedVisual);
      case 'table':
        return renderTableComponent(component, linkedVisual);
      case 'heatmap':
        return renderHeatmapComponent(component, linkedVisual);
      case 'funnel':
        return renderFunnelComponent(component, linkedVisual);
      case 'progress':
        return renderProgressComponent(component, linkedVisual);
      case 'scatter':
        return (
          <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardHeader>
              <CardTitle style={{ color: themeColors.textPrimary }}>
                {linkedVisual ? linkedVisual.name : 'Scatter Plot'}
              </CardTitle>
              <CardDescription style={{ color: themeColors.textSecondary }}>
                {linkedVisual ? linkedVisual.description || 'Correlation analysis' : 'Data correlation visualization'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center" style={{ color: themeColors.textSecondary }}>
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Scatter plot visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'filter':
        return (
          <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardHeader>
              <CardTitle style={{ color: themeColors.textPrimary }}>
                {linkedVisual ? linkedVisual.name : 'Filters'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Date Range</Button>
                <Button variant="outline" size="sm">Category</Button>
                <Button variant="outline" size="sm">Status</Button>
                <Button variant="outline" size="sm">Region</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'text':
        return renderTextComponent(component, linkedVisual);
      case 'image':
        return (
          <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <div className="text-center" style={{ color: themeColors.textSecondary }}>
                <Image className="w-12 h-12 mx-auto mb-4" />
                <h4 className="font-medium mb-2" style={{ color: themeColors.textPrimary }}>
                  {linkedVisual ? linkedVisual.name : 'Image Placeholder'}
                </h4>
                <p className="text-sm">Image content will appear here</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <div className="text-center" style={{ color: themeColors.textSecondary }}>
                <LayoutGrid className="w-12 h-12 mx-auto mb-4" />
                <h4 className="font-medium mb-2" style={{ color: themeColors.textPrimary }}>
                  Unknown Component
                </h4>
                <p className="text-sm">Component type not recognized</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  if (currentLayout.components.length === 0) {
    return (
      <div className="p-6 h-full flex items-center justify-center" style={{ background: themeColors.background }}>
        <div className="text-center">
          <LayoutGrid className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: themeColors.textSecondary }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.textPrimary }}>
            Page {currentPage + 1} is Empty
          </h3>
          <p style={{ color: themeColors.textSecondary }}>
            Add components in the Layout Builder to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen" style={{ background: themeColors.background, color: themeColors.textPrimary }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: themeColors.textPrimary }}>
            Page {currentPage + 1}
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            {currentLayout.components.length} component{currentLayout.components.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Dynamic Layout Grid - 12 Column System */}
      <div className="grid grid-cols-12 gap-6 auto-rows-min">
        {currentLayout.components
          .sort((a: any, b: any) => {
            if (a.position && b.position) {
              if (a.position.row !== b.position.row) {
                return a.position.row - b.position.row;
              }
              return a.position.col - b.position.col;
            }
            return a.id.localeCompare(b.id);
          })
          .map((component: any, index: number) => (
            <div
              key={component.id}
              className="flex flex-col"
              style={{ 
                gridColumn: `span ${Math.min(component.span, 12)} / span ${Math.min(component.span, 12)}`,
                minHeight: component.type === 'kpi' ? 'auto' : '300px'
              }}
            >
              {renderComponent(component, index)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainDashboard;
