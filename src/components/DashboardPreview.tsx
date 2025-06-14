import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileDown, Eye, PieChart, Map, Grid3X3, Target, Users, DollarSign, Clock, Filter, ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, ArrowUpRight, ArrowDownRight, Table } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts';
import DashboardNavigation from './DashboardNavigation';
import DashboardTopNav from './DashboardTopNav';
import MainDashboard from './MainDashboard';
import TopNavigation from './TopNavigation';
import SmartPageNavigation from './SmartPageNavigation';
import DataTable from './DataTable';
import { layoutTemplates, getLayoutForPage, getLayoutForComplexity } from '../utils/layoutTemplates';
import { assignChartsToLayout, getTableDataForType } from '../utils/chartPlacementLogic';

interface DashboardPreviewProps {
  config: any;
  onExport: (format: string) => void;
}

const DashboardPreview = ({ config, onExport }: DashboardPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getIconForVisual = (visual: string) => {
    const iconMap: { [key: string]: any } = {
      'kpi-cards': Target,
      'metric-tiles': Grid3X3,
      'progress-bars': LayoutDashboard,
      'line-charts': LayoutDashboard,
      'bar-charts': LayoutDashboard,
      'pie-charts': PieChart,
      'area-charts': LayoutDashboard,
      'data-tables': Table,
      'transaction-tables': Table,
      'summary-tables': Table,
      'filters': Filter,
      'time-controls': Clock,
      'drill-down': Grid3X3,
      'heatmaps': Grid3X3,
      'geo-maps': Map,
      'funnel-charts': LayoutDashboard,
      'scatter-plots': Target
    };
    return iconMap[visual] || LayoutDashboard;
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
    switch (config.layoutDimension) {
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
    const themeStyle = config.themeStyle;
    const palette = config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626'];
    
    switch (themeStyle) {
      case 'dark':
        return {
          background: '#0f172a',
          cardBackground: '#1e293b',
          textPrimary: '#f8fafc',
          textSecondary: '#cbd5e1',
          borderColor: '#334155',
          chartColors: palette
        };
      case 'corporate':
        return {
          background: '#f8fafc',
          cardBackground: '#ffffff',
          textPrimary: '#0f172a',
          textSecondary: '#475569',
          borderColor: '#cbd5e1',
          chartColors: palette
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.95)',
          textPrimary: '#1f2937',
          textSecondary: '#4b5563',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          chartColors: palette
        };
      case 'creative':
        return {
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.98)',
          textPrimary: '#1f2937',
          textSecondary: '#4b5563',
          borderColor: 'rgba(255, 255, 255, 0.4)',
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

  const renderKPICard = (kpi: any, index: number) => {
    const isPositive = kpi.trend === 'up';
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
    const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <Card 
        key={index}
        className="hover:shadow-lg transition-shadow duration-200"
        style={{ 
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.borderColor,
          color: themeColors.textPrimary
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>
                {kpi.label}
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: themeColors.textPrimary }}>
                {kpi.value}
              </p>
            </div>
            <div className={`flex items-center ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium ml-1">{kpi.change}</span>
            </div>
          </div>
          {config.tooltipsEnabled && (
            <p className="text-xs mt-2" style={{ color: themeColors.textSecondary }}>
              {kpi.detail}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderChart = (visual: string, index: number) => {
    const chartColor = themeColors.chartColors[index % themeColors.chartColors.length];
    
    // Handle table components
    if (visual.includes('table')) {
      const tableData = getTableDataForType(visual, config.dashboardType);
      return (
        <DataTable
          title={visual.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          headers={tableData.headers}
          rows={tableData.rows}
          themeColors={themeColors}
          showBadges={true}
        />
      );
    }

    switch (visual) {
      case 'line-charts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.borderColor} />
              <XAxis dataKey="month" stroke={themeColors.textSecondary} />
              <YAxis stroke={themeColors.textSecondary} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey={config.dashboardType === 'finance' ? 'revenue' : 'value'} stroke={chartColor} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar-charts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.borderColor} />
              <XAxis dataKey="month" stroke={themeColors.textSecondary} />
              <YAxis stroke={themeColors.textSecondary} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={config.dashboardType === 'finance' ? 'profit' : 'users'} fill={chartColor} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area-charts':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeColors.borderColor} />
              <XAxis dataKey="month" stroke={themeColors.textSecondary} />
              <YAxis stroke={themeColors.textSecondary} />
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

  const renderGridBasedLayout = (pageIndex: number) => {
    // Use complexity-based layout selection
    const layout = getLayoutForPage(pageIndex, config.pages, config.visuals.length, config.complexity);
    const chartAssignments = assignChartsToLayout(config.visuals, layout);
    
    console.log(`Page ${pageIndex}: Using layout "${layout.name}" (${layout.complexity}) for ${config.complexity} complexity`);
    
    return (
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.textPrimary }}>
            {pageIndex === 0 ? 'Dashboard Overview' : `${layout.name} - Page ${pageIndex + 1}`}
          </h1>
          <p className="text-lg" style={{ color: themeColors.textSecondary }}>
            {pageIndex === 0 ? `Comprehensive ${config.complexity} complexity overview` : layout.description}
          </p>
          <Badge variant="outline" className="mt-2">
            {layout.complexity.charAt(0).toUpperCase() + layout.complexity.slice(1)} Layout
          </Badge>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-12 gap-4 auto-rows-min">
          {/* KPI Cards */}
          {layout.kpiLayout.map((kpiPos, index) => (
            <div 
              key={`kpi-${index}`}
              className={`col-span-${kpiPos.colSpan} row-span-${kpiPos.rowSpan}`}
              style={{ 
                gridColumn: `${kpiPos.col} / span ${kpiPos.colSpan}`,
                gridRow: `${kpiPos.row} / span ${kpiPos.rowSpan}`
              }}
            >
              {mockData.kpis[index % mockData.kpis.length] && 
                renderKPICard(mockData.kpis[index % mockData.kpis.length], index)
              }
            </div>
          ))}

          {/* Charts and Tables */}
          {chartAssignments.map((assignment, index) => (
            <div 
              key={`chart-${index}`}
              className="col-span-full"
              style={{ 
                gridColumn: `${assignment.placement.position.col} / span ${assignment.placement.position.colSpan}`,
                gridRow: `${assignment.placement.position.row} / span ${assignment.placement.position.rowSpan}`
              }}
            >
              {assignment.visual.includes('table') ? (
                renderChart(assignment.visual, index)
              ) : (
                <Card 
                  className="hover:shadow-lg transition-shadow duration-200 h-full"
                  style={{ 
                    backgroundColor: themeColors.cardBackground,
                    borderColor: themeColors.borderColor,
                    color: themeColors.textPrimary
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ color: themeColors.textPrimary }}>
                      {assignment.visual.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderChart(assignment.visual, index)}
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Complexity Summary */}
        {pageIndex === 0 && (
          <Card 
            className="mt-8"
            style={{ 
              backgroundColor: themeColors.cardBackground,
              borderColor: themeColors.borderColor,
              color: themeColors.textPrimary
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: themeColors.textPrimary }}>
                Dashboard Summary - {config.complexity.charAt(0).toUpperCase() + config.complexity.slice(1)} Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{config.pages}</div>
                  <div className="text-sm" style={{ color: themeColors.textSecondary }}>Total Pages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{config.visuals.length}</div>
                  <div className="text-sm" style={{ color: themeColors.textSecondary }}>Visual Components</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{layout.name}</div>
                  <div className="text-sm" style={{ color: themeColors.textSecondary }}>Active Layout</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{config.complexity}</div>
                  <div className="text-sm" style={{ color: themeColors.textSecondary }}>Complexity Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderMainDashboard = () => {
    return (
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.textPrimary }}>
            {config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1)} Dashboard
          </h1>
          <p className="text-lg" style={{ color: themeColors.textSecondary }}>
            Comprehensive overview of your key metrics and insights
          </p>
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {mockData.kpis.map((kpi, index) => renderKPICard(kpi, index))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.visuals.slice(0, 4).map((visual: string, index: number) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow duration-200"
              style={{ 
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.borderColor,
                color: themeColors.textPrimary
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: themeColors.textPrimary }}>
                  {visual.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart(visual, index)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Section */}
        <Card 
          className="mt-8"
          style={{ 
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderColor,
            color: themeColors.textPrimary
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: themeColors.textPrimary }}>
              Dashboard Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{config.pages}</div>
                <div className="text-sm" style={{ color: themeColors.textSecondary }}>Total Pages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{config.visuals.length}</div>
                <div className="text-sm" style={{ color: themeColors.textSecondary }}>Visual Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{config.complexity}</div>
                <div className="text-sm" style={{ color: themeColors.textSecondary }}>Complexity Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPageContent = (pageIndex: number) => {
    if (pageIndex === 0) {
      return renderMainDashboard();
    }

    // For other pages, show a mix of KPI cards and charts
    const startIndex = (pageIndex - 1) * 4;
    const pageVisuals = config.visuals.slice(startIndex, startIndex + 4);
    
    // If no visuals for this page, use default charts
    const defaultVisuals = ['line-charts', 'bar-charts', 'pie-charts', 'area-charts'];
    const visualsToShow = pageVisuals.length > 0 ? pageVisuals : defaultVisuals.slice(0, 4);

    return (
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.textPrimary }}>
            Page {pageIndex} - Analytics Details
          </h2>
          <p style={{ color: themeColors.textSecondary }}>
            Detailed metrics and insights for advanced analysis
          </p>
        </div>

        {/* KPI Cards for each page */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {mockData.kpis.slice(0, 4).map((kpi, index) => renderKPICard({
            ...kpi,
            label: `${kpi.label} (P${pageIndex})`,
            value: `${kpi.value}${pageIndex > 1 ? ` +${pageIndex * 5}%` : ''}`
          }, index))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visualsToShow.map((visual: string, index: number) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow duration-200"
              style={{ 
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.borderColor,
                color: themeColors.textPrimary
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: themeColors.textPrimary }}>
                  {visual.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Page {pageIndex}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart(visual, index + pageIndex)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboardLayout = () => {
    const layoutStyle = {
      background: themeColors.background,
      color: themeColors.textPrimary,
      minHeight: '100vh'
    };

    if (config.navigationPosition === 'top') {
      return (
        <div className="h-full flex flex-col overflow-hidden" style={layoutStyle}>
          <TopNavigation 
            config={config}
            onPageSelect={setCurrentPage}
            currentPage={currentPage}
            title={currentPage === 0 ? "Dashboard Overview" : `Page ${currentPage + 1}`}
          />
          
          <div className="flex-1 overflow-auto">
            {renderGridBasedLayout(currentPage)}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex overflow-hidden" style={layoutStyle}>
        <DashboardNavigation 
          config={config}
          onPageSelect={setCurrentPage}
          currentPage={currentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardTopNav 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={currentPage === 0 ? "Dashboard Overview" : `Page ${currentPage + 1}`}
          />
          
          <div className="flex-1 overflow-auto">
            {renderGridBasedLayout(currentPage)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Dashboard Preview
            </div>
            {config.pages > 1 && (
              <SmartPageNavigation
                currentPage={currentPage}
                totalPages={config.pages}
                onPageSelect={setCurrentPage}
                config={config}
              />
            )}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{config.dashboardType}</Badge>
            <Badge variant="outline">{config.complexity} complexity</Badge>
            <Badge variant="outline">{config.pages} page{config.pages > 1 ? 's' : ''}</Badge>
            <Badge variant="outline">{config.visuals.length} components</Badge>
            <Badge variant="outline">{config.layoutDimension} layout</Badge>
            <Badge variant="outline">{config.navigationPosition} navigation</Badge>
            {config.tooltipsEnabled && <Badge variant="outline">Tooltips enabled</Badge>}
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
              <div className="text-2xl font-bold text-purple-600">{layoutTemplates.filter(t => t.complexity === config.complexity).length}</div>
              <div className="text-sm text-gray-500">{config.complexity.charAt(0).toUpperCase() + config.complexity.slice(1)} Layouts</div>
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
            {config.pages > 1 ? `Page ${currentPage + 1} Preview` : 'Dashboard Preview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`p-0 rounded-lg border ${getDimensionClasses()}`}
            style={{ 
              background: themeColors.background,
              color: themeColors.textPrimary,
              borderColor: themeColors.borderColor
            }}
          >
            {renderDashboardLayout()}
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
