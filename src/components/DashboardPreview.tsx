
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileDown, Eye, BarChart3, TrendingUp, PieChart, Map, Grid3X3, Target, Users, DollarSign, Clock, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts';
import { useState } from 'react';

interface DashboardPreviewProps {
  config: any;
  onExport: (format: string) => void;
}

const DashboardPreview = ({ config, onExport }: DashboardPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutDimension, setLayoutDimension] = useState("16:9");

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

  const getFinanceData = () => {
    if (config.dashboardType === 'finance') {
      return {
        kpis: [
          { label: 'Total Revenue', value: '$2,847,392', change: '+12.5%', trend: 'up', detail: 'Monthly recurring revenue increased by 12.5% compared to last quarter' },
          { label: 'Net Profit Margin', value: '18.4%', change: '+2.1%', trend: 'up', detail: 'Profit margin improved due to cost optimization initiatives' },
          { label: 'Operating Expenses', value: '$1,247,238', change: '-5.2%', trend: 'up', detail: 'Reduced operational costs through automation and efficiency improvements' },
          { label: 'Cash Flow', value: '$892,847', change: '+8.7%', trend: 'up', detail: 'Positive cash flow trend with improved collection cycles' }
        ],
        chartData: [
          { month: 'Jan', revenue: 2400000, expenses: 1800000, profit: 600000 },
          { month: 'Feb', revenue: 2200000, expenses: 1700000, profit: 500000 },
          { month: 'Mar', revenue: 2800000, expenses: 1900000, profit: 900000 },
          { month: 'Apr', revenue: 2600000, expenses: 1750000, profit: 850000 },
          { month: 'May', revenue: 3200000, expenses: 2100000, profit: 1100000 },
          { month: 'Jun', revenue: 2900000, expenses: 1950000, profit: 950000 }
        ],
        pieData: [
          { name: 'Product Sales', value: 45, color: '#2563eb' },
          { name: 'Services', value: 30, color: '#7c3aed' },
          { name: 'Subscriptions', value: 20, color: '#059669' },
          { name: 'Other', value: 5, color: '#dc2626' }
        ]
      };
    }
    return {
      kpis: [
        { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', detail: 'Overall revenue performance' },
        { label: 'Active Users', value: '45.2K', change: '+8.3%', trend: 'up', detail: 'Monthly active user growth' },
        { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down', detail: 'Conversion rate needs improvement' },
        { label: 'Customer Satisfaction', value: '94.2%', change: '+5.7%', trend: 'up', detail: 'High customer satisfaction score' }
      ],
      chartData: [
        { month: 'Jan', value: 4000, users: 2400 },
        { month: 'Feb', value: 3000, users: 1398 },
        { month: 'Mar', value: 2000, users: 9800 },
        { month: 'Apr', value: 2780, users: 3908 },
        { month: 'May', value: 1890, users: 4800 },
        { month: 'Jun', value: 2390, users: 3800 }
      ],
      pieData: [
        { name: 'Desktop', value: 45, color: '#2563eb' },
        { name: 'Mobile', value: 35, color: '#7c3aed' },
        { name: 'Tablet', value: 20, color: '#059669' }
      ]
    };
  };

  const mockData = getFinanceData();

  const getDimensionClasses = () => {
    switch (layoutDimension) {
      case "16:9":
        return "aspect-video";
      case "4:3":
        return "aspect-[4/3]";
      case "1:1":
        return "aspect-square";
      case "21:9":
        return "aspect-[21/9]";
      default:
        return "aspect-video";
    }
  };

  const getThemeColors = () => {
    return {
      background: config.themeStyle === 'dark' ? '#1f2937' : '#ffffff',
      cardBackground: config.themeStyle === 'dark' ? '#374151' : '#f8fafc',
      textPrimary: config.themeStyle === 'dark' ? '#ffffff' : '#1f2937',
      textSecondary: config.themeStyle === 'dark' ? '#d1d5db' : '#6b7280',
      chartColors: config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626']
    };
  };

  const themeColors = getThemeColors();

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = (visual: string, index: number) => {
    const chartColor = themeColors.chartColors[index % themeColors.chartColors.length];
    
    switch (visual) {
      case 'line-charts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey={config.dashboardType === 'finance' ? 'revenue' : 'value'} stroke={chartColor} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar-charts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={config.dashboardType === 'finance' ? 'profit' : 'users'} fill={chartColor} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area-charts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={config.dashboardType === 'finance' ? 'expenses' : 'value'} stroke={chartColor} fill={chartColor} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie-charts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={mockData.pieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        const IconComponent = getIconForVisual(visual);
        return (
          <div className="h-32 flex flex-col items-center justify-center">
            <IconComponent className="w-8 h-8 mb-2" style={{ color: chartColor }} />
            <div className="text-sm font-medium text-center opacity-75">
              {visual.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Info with Layout Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Dashboard Preview
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Layout:</span>
                <Select value={layoutDimension} onValueChange={setLayoutDimension}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="21:9">21:9</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {config.pages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">Page {currentPage} of {config.pages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(config.pages, currentPage + 1))}
                    disabled={currentPage === config.pages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{config.dashboardType}</Badge>
            <Badge variant="outline">{config.complexity} complexity</Badge>
            <Badge variant="outline">{config.pages} page{config.pages > 1 ? 's' : ''}</Badge>
            <Badge variant="outline">{config.visuals.length} components</Badge>
            <Badge variant="outline">{layoutDimension} layout</Badge>
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
          <CardTitle>
            {config.pages > 1 ? `Page ${currentPage} Preview` : 'Dashboard Preview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`p-6 rounded-lg ${getDimensionClasses()}`}
            style={{ 
              backgroundColor: themeColors.background,
              color: themeColors.textPrimary,
              border: `1px solid ${themeColors.textSecondary}20`
            }}
          >
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: config.colorPalette[0] }}>
                  {config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1)} Dashboard
                  {config.pages > 1 && ` - Page ${currentPage}`}
                </h2>
                <div className="flex gap-2 mb-4">
                  <div className="text-sm text-gray-500">Background Colors:</div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: themeColors.background }} />
                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: themeColors.cardBackground }} />
                  </div>
                  <div className="text-sm text-gray-500 ml-4">Chart Colors:</div>
                  <div className="flex gap-1">
                    {themeColors.chartColors.map((color: string, index: number) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI Cards with Hover Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {mockData.kpis.slice(0, config.complexity === 'simple' ? 2 : config.complexity === 'moderate' ? 3 : 4).map((kpi, index) => (
                  <div
                    key={index}
                    className="group relative p-4 rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer"
                    style={{ 
                      backgroundColor: themeColors.cardBackground,
                      borderColor: `${themeColors.chartColors[index % themeColors.chartColors.length]}30`
                    }}
                    title={kpi.detail}
                  >
                    <div className="text-sm opacity-75 mb-1" style={{ color: themeColors.textSecondary }}>{kpi.label}</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: themeColors.chartColors[index % themeColors.chartColors.length] }}>
                      {kpi.value}
                    </div>
                    <div className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </div>
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      {kpi.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              {config.visuals.length > 0 && (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.visuals.slice((currentPage - 1) * 4, currentPage * 4).map((visual: string, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border hover:shadow-lg transition-shadow"
                      style={{ 
                        backgroundColor: themeColors.cardBackground,
                        borderColor: `${themeColors.chartColors[index % themeColors.chartColors.length]}30`
                      }}
                    >
                      <div className="text-sm font-medium mb-3" style={{ color: themeColors.textPrimary }}>
                        {visual.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                      {renderChart(visual, index)}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  className="flex items-center gap-2 h-auto p-4 flex-col hover:shadow-md transition-shadow"
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
