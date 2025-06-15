
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Area, AreaChart } from "recharts";
import { CircleDot, TrendingUp, TrendingDown, MoreHorizontal, User, Calendar, DollarSign, Activity, ChevronRight, ChevronDown, Filter, Download, Users, ShoppingCart, Package, Clock, LayoutGrid, Table, Type, Image } from "lucide-react";

interface MainDashboardProps {
  config: any;
  currentPage?: number;
  onExport: (format: string) => void;
}

const MainDashboard = ({ config, currentPage = 0, onExport }: MainDashboardProps) => {
  const isDarkTheme = config.themeStyle === 'dark';
  const chartColors = config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626'];
  
  const getCurrentPageLayout = () => {
    if (!config.layouts || !config.layouts[currentPage]) {
      return { pageId: currentPage, components: [] };
    }
    return config.layouts[currentPage];
  };

  const currentLayout = getCurrentPageLayout();
  const visuals = config.visuals || [];

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
  const getMockData = (type: string) => {
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

  const mockData = getMockData(config.dashboardType);

  const renderKPIComponent = (component: any, linkedVisual: any) => {
    const kpiCount = component.count || 4;
    const kpisToShow = mockData.kpiData.slice(0, kpiCount);

    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(kpiCount, 4)}, 1fr)` }}>
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
      <div className={`grid gap-4 ${chartCount > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {Array.from({ length: chartCount }, (_, index) => (
          <Card key={index} style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardHeader>
              <CardTitle style={{ color: themeColors.textPrimary }}>
                {linkedVisual ? linkedVisual.name : `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart ${index + 1}`}
              </CardTitle>
              <CardDescription style={{ color: themeColors.textSecondary }}>
                {linkedVisual ? linkedVisual.description || 'Chart visualization' : 'Performance metrics over time'}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
    ];

    return (
      <Card style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
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
                  <tr key={row.id} className="border-b" style={{ borderColor: themeColors.borderColor }}>
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

  const renderComponent = (component: any) => {
    const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
    
    switch (component.type) {
      case 'kpi':
        return renderKPIComponent(component, linkedVisual);
      case 'chart':
        return renderChartComponent(component, linkedVisual);
      case 'table':
        return renderTableComponent(component, linkedVisual);
      case 'filter':
        return (
          <Card style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardHeader>
              <CardTitle style={{ color: themeColors.textPrimary }}>
                {linkedVisual ? linkedVisual.name : 'Filters'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Date Range</Button>
                <Button variant="outline" size="sm">Category</Button>
                <Button variant="outline" size="sm">Status</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'text':
        return (
          <Card style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardContent className="p-4">
              <div style={{ color: themeColors.textPrimary }}>
                {linkedVisual ? linkedVisual.name : 'Text content goes here. This is a sample text block that can contain important information, descriptions, or any other textual content.'}
              </div>
            </CardContent>
          </Card>
        );
      case 'image':
        return (
          <Card style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardContent className="p-4 flex items-center justify-center h-32">
              <div className="text-center" style={{ color: themeColors.textSecondary }}>
                <Image className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{linkedVisual ? linkedVisual.name : 'Image Placeholder'}</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor }}>
            <CardContent className="p-4 flex items-center justify-center h-32">
              <div className="text-center" style={{ color: themeColors.textSecondary }}>
                <LayoutGrid className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Unknown Component</p>
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
    <div className="p-6 space-y-6" style={{ background: themeColors.background, color: themeColors.textPrimary }}>
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

      {/* Dynamic Layout Grid */}
      <div className="grid grid-cols-12 gap-6">
        {currentLayout.components.map((component: any) => (
          <div
            key={component.id}
            className={`col-span-12`}
            style={{ gridColumn: `span ${Math.min(component.span, 12)}` }}
          >
            {renderComponent(component)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
