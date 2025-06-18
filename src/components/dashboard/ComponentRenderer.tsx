import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, TrendingDown, User, TrendingUp, ShoppingCart, Info, Filter, Image as ImageIcon } from "lucide-react";
import { AdvancedThemeColors, advancedThemes } from "@/utils/advancedThemeSystem";

interface ComponentRendererProps {
  component: any;
  visual: any;
  themeColors: AdvancedThemeColors;
  mockData: any;
  config: any;
  allComponents: any[];
  containerHeight: any;
  gridStructure: any;
}

const ComponentRenderer = ({ component, visual, themeColors, mockData, config }: ComponentRendererProps) => {
  const [editableText, setEditableText] = useState(component.text || 'Click to edit text');
  const [isEditing, setIsEditing] = useState(false);
  
  const interactivityLevel = config?.interactivity || 'basic';
  const currentTheme = advancedThemes[config?.themeStyle] || advancedThemes.minimal;
  
  // Enhanced tooltip content with theme colors
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isAdvanced = interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive';
      
      return (
        <div 
          className={`p-3 rounded-lg shadow-lg border backdrop-blur-sm ${isAdvanced ? 'min-w-[200px]' : ''}`}
          style={{ 
            backgroundColor: currentTheme.tooltipBackground,
            borderColor: currentTheme.tooltipBorder,
            color: currentTheme.tooltipText
          }}
        >
          <p className="font-semibold mb-2" style={{ color: currentTheme.tooltipText }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium">{entry.name}:</span>
              <span className="text-sm font-bold">{entry.value}</span>
            </div>
          ))}
          {interactivityLevel === 'highly-interactive' && (
            <div className="mt-2 pt-2 border-t" style={{ borderColor: currentTheme.tooltipBorder }}>
              <div className="text-xs opacity-75">
                <div>Trend: +15.3% vs last period</div>
                <div>Forecast: Expected growth</div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderProgressBar = () => {
    const progressValue = Math.floor(Math.random() * 100);
    
    return (
      <div className="flex flex-col justify-center h-full p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
              {component.name || 'Progress Indicator'}
            </h3>
            <span className="text-sm font-medium" style={{ color: currentTheme.textSecondary }}>
              {progressValue}%
            </span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-3 w-full"
          />
        </div>
        <div className="text-sm" style={{ color: currentTheme.textMuted }}>
          Current progress towards target goal
        </div>
      </div>
    );
  };

  const renderFilter = () => {
    return (
      <div className="flex flex-col justify-center h-full p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.textPrimary }}>
            <Filter className="w-5 h-5 inline mr-2" />
            {component.name || 'Data Filter'}
          </h3>
        </div>
        <div className="space-y-3">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="w-full">Apply Filters</Button>
        </div>
      </div>
    );
  };

  const renderTextBlock = () => {
    return (
      <div className="flex flex-col justify-center h-full p-4">
        {isEditing ? (
          <Input
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false);
              }
            }}
            autoFocus
            className="text-lg font-medium border-none shadow-none p-0 h-auto"
            style={{ color: currentTheme.textPrimary }}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer text-lg font-medium hover:opacity-75 transition-opacity"
            style={{ color: currentTheme.textPrimary }}
          >
            {editableText}
          </div>
        )}
        <div className="text-xs mt-2" style={{ color: currentTheme.textMuted }}>
          Click to edit text
        </div>
      </div>
    );
  };

  const renderImageLogo = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center mb-3"
          style={{ backgroundColor: currentTheme.cardBorder }}
        >
          <ImageIcon className="w-8 h-8" style={{ color: currentTheme.textSecondary }} />
        </div>
        <div className="text-sm font-medium text-center" style={{ color: currentTheme.textPrimary }}>
          {component.name || 'Company Logo'}
        </div>
        <div className="text-xs mt-1 text-center" style={{ color: currentTheme.textMuted }}>
          Upload your logo here
        </div>
      </div>
    );
  };

  const renderKPI = () => {
    const kpi = mockData.kpiData[0];
    const showProgress = interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive';
    const showSparkline = interactivityLevel === 'highly-interactive';
    
    const kpiCard = (
      <div 
        className={`flex flex-col justify-between h-full relative group p-4 ${
          interactivityLevel !== 'basic' ? 'transition-all duration-200 hover:shadow-lg' : ''
        }`}
        style={{ color: currentTheme.textPrimary }}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{kpi.label}</h3>
            <div 
              className="p-2 rounded-md"
              style={{ backgroundColor: `${kpi.color.replace('text-', '').replace('-600', '')}20` }}
            >
              <kpi.icon size={20} style={{ color: kpi.color.includes('green') ? currentTheme.positive : 
                                                  kpi.color.includes('red') ? currentTheme.negative :
                                                  kpi.color.includes('blue') ? currentTheme.info : currentTheme.warning }} />
            </div>
          </div>
          <div className="text-3xl font-bold">{kpi.value}</div>
          <div 
            className="text-sm font-medium"
            style={{ color: kpi.trend === 'up' ? currentTheme.positive : currentTheme.negative }}
          >
            {kpi.change}
          </div>
        </div>
        
        {showProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: currentTheme.textSecondary }}>
              <span>Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}
        
        {showSparkline && (
          <div className="mt-3" style={{ height: '40px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.chartData.slice(-6)}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={currentTheme.chartColors[0]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );

    if (interactivityLevel === 'basic') {
      return kpiCard;
    } else if (interactivityLevel === 'advanced') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {kpiCard}
            </TooltipTrigger>
            <TooltipContent>
              <div className="p-2">
                <div className="font-semibold">{kpi.label}</div>
                <div className="text-sm">Current: {kpi.value}</div>
                <div className="text-sm">Change: {kpi.change}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            {kpiCard}
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">{kpi.label}</h4>
                <p className="text-sm text-muted-foreground">Detailed performance metrics</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Current: <span className="font-medium">{kpi.value}</span></div>
                <div>Change: <span className="font-medium">{kpi.change}</span></div>
                <div>Target: <span className="font-medium">$3.0M</span></div>
                <div>Achievement: <span className="font-medium">80%</span></div>
              </div>
              <div className="pt-2">
                <div className="text-xs mb-1">Last 6 months trend:</div>
                <div style={{ height: '60px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData.chartData}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={currentTheme.chartColors[0]}
                        fill={currentTheme.chartColors[0]}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    }
  };

  const getChartType = () => {
    console.log('Component for chart type detection:', component);
    
    if (component.chartType) {
      console.log('Found chartType property:', component.chartType);
      return component.chartType;
    }
    
    if (visual && visual.chartType) {
      console.log('Found visual chartType:', visual.chartType);
      return visual.chartType;
    }
    
    const componentName = (component.name || component.label || '').toLowerCase();
    const componentType = (component.type || '').toLowerCase();
    const visualType = (component.visualType || '').toLowerCase();
    
    console.log('Chart Type Detection fallback:', {
      componentName,
      componentType,
      visualType,
      component
    });

    if (componentName.includes('line') || componentType.includes('line') || visualType.includes('line')) return 'line';
    if (componentName.includes('area') || componentType.includes('area') || visualType.includes('area')) return 'area';
    if (componentName.includes('pie') || componentType.includes('pie') || visualType.includes('pie')) return 'pie';
    if (componentName.includes('donut') || componentType.includes('donut') || visualType.includes('donut')) return 'donut';
    if (componentName.includes('heatmap') || componentType.includes('heatmap') || visualType.includes('heatmap')) return 'heatmap';
    if (componentName.includes('scatter') || componentType.includes('scatter') || visualType.includes('scatter')) return 'scatter';
    if (componentName.includes('funnel') || componentType.includes('funnel') || visualType.includes('funnel')) return 'funnel';
    if (componentName.includes('bar') || componentType.includes('bar') || visualType.includes('bar')) return 'bar';
    
    return 'bar';
  };

  const renderChart = () => {
    const chartType = getChartType();
    
    console.log('Final Chart Type for Rendering:', chartType);

    const chartProps = {
      data: mockData.chartData,
      margin: { top: 20, right: 20, left: 20, bottom: 20 }
    };

    const commonChartStyles = {
      cartesianGrid: { 
        strokeDasharray: "3 3", 
        stroke: currentTheme.chartGridLines,
        strokeOpacity: 0.3
      },
      xAxis: { 
        stroke: currentTheme.chartAxes,
        fontSize: 11,
        fontWeight: 500
      },
      yAxis: { 
        stroke: currentTheme.chartAxes,
        fontSize: 11,
        fontWeight: 500
      }
    };

    // Enhanced tooltip for charts based on interactivity level
    const ChartTooltip = interactivityLevel === 'basic' ? 
      RechartsTooltip : 
      <RechartsTooltip content={<CustomTooltip />} />;

    const chartWithInfo = (chart: React.ReactNode) => {
      if (interactivityLevel === 'highly-interactive') {
        return (
          <div className="h-full relative">
            <div className="absolute top-2 right-2 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-2 text-xs">
                      <div>Chart Type: {chartType}</div>
                      <div>Data Points: {mockData.chartData.length}</div>
                      <div>Interactive Features: Enabled</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {chart}
          </div>
        );
      }
      return chart;
    };

    switch (chartType) {
      case 'bar':
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                {component.name || component.label || 'Bar Chart'}
              </h3>
            </div>
            <div style={{ height: 'calc(100% - 40px)', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart {...chartProps}>
                  <CartesianGrid {...commonChartStyles.cartesianGrid} />
                  <XAxis {...commonChartStyles.xAxis} dataKey="month" />
                  <YAxis {...commonChartStyles.yAxis} />
                  {ChartTooltip}
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill={currentTheme.chartColors[0]}
                    radius={[4, 4, 0, 0]}
                    name="Sales Data"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'line':
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                {component.name || component.label || 'Line Chart'}
              </h3>
            </div>
            <div style={{ height: 'calc(100% - 40px)', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart {...chartProps}>
                  <CartesianGrid {...commonChartStyles.cartesianGrid} />
                  <XAxis {...commonChartStyles.xAxis} dataKey="month" />
                  <YAxis {...commonChartStyles.yAxis} />
                  {ChartTooltip}
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={currentTheme.chartColors[1]}
                    strokeWidth={3}
                    dot={{ fill: currentTheme.chartColors[1], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: currentTheme.chartColors[1], strokeWidth: 2 }}
                    name="Trend Line"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      
      case 'area':
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                {component.name || component.label || 'Area Chart'}
              </h3>
            </div>
            <div style={{ height: 'calc(100% - 40px)', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart {...chartProps}>
                  <CartesianGrid {...commonChartStyles.cartesianGrid} />
                  <XAxis {...commonChartStyles.xAxis} dataKey="month" />
                  <YAxis {...commonChartStyles.yAxis} />
                  {ChartTooltip}
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={currentTheme.chartColors[2]}
                    fill={currentTheme.chartColors[2]}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Area Data"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'pie':
        const pieData = mockData.chartData.map((item: any, index: number) => ({
          name: item.month,
          value: item.value,
          fill: currentTheme.chartColors[index % currentTheme.chartColors.length]
        }));
        
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                {component.name || component.label || 'Pie Chart'}
              </h3>
            </div>
            <div style={{ height: 'calc(100% - 40px)', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {ChartTooltip}
                  <Legend />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={Math.min(80, 60)}
                    innerRadius={0}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'donut':
        const donutData = mockData.chartData.map((item: any, index: number) => ({
          name: item.month,
          value: item.value,
          fill: currentTheme.chartColors[index % currentTheme.chartColors.length]
        }));
        
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                {component.name || component.label || 'Donut Chart'}
              </h3>
            </div>
            <div style={{ height: 'calc(100% - 40px)', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {ChartTooltip}
                  <Legend />
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={Math.min(80, 60)}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {donutData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'heatmap':
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                Heatmap Visualization
              </h3>
            </div>
            <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100% - 40px)' }}>
              <div className="grid grid-cols-8 gap-1 mb-4">
                {Array.from({ length: 56 }, (_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded border flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: currentTheme.chartColors[Math.floor(Math.random() * currentTheme.chartColors.length)] + '60',
                      borderColor: currentTheme.cardBorder,
                      color: currentTheme.textPrimary
                    }}
                  >
                    {Math.floor(Math.random() * 100)}
                  </div>
                ))}
              </div>
              <div className="text-xs" style={{ color: currentTheme.textSecondary }}>
                Interactive heatmap showing data intensity patterns
              </div>
            </div>
          </div>
        );

      case 'scatter':
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                Scatter Plot Analysis
              </h3>
            </div>
            <div className="flex items-center justify-center" style={{ height: 'calc(100% - 40px)' }}>
              <div className="w-full h-full rounded flex items-center justify-center relative" style={{ backgroundColor: currentTheme.chartBackground }}>
                {Array.from({ length: 15 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: currentTheme.chartColors[i % currentTheme.chartColors.length],
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                      color: 'white'
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'funnel':
        return chartWithInfo(
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                Funnel Analysis
              </h3>
            </div>
            <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100% - 40px)' }}>
              <div className="space-y-2 w-full max-w-md">
                {['100% - Initial Stage', '85% - Qualified Leads', '65% - Proposals', '40% - Negotiations', '25% - Closed Deals'].map((label, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div
                      className="h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${100 - index * 15}%`,
                        backgroundColor: currentTheme.chartColors[index % currentTheme.chartColors.length],
                        minWidth: '120px'
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs mt-2" style={{ color: currentTheme.textSecondary }}>
                Conversion process visualization
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full text-center p-4" style={{ color: currentTheme.textMuted }}>
            <div>
              <div className="text-lg font-medium mb-2">Chart Preview</div>
              <div className="text-sm">Type: {chartType || 'Unknown'}</div>
              <div className="text-xs mt-2">Component: {component.name || component.label || 'Unnamed'}</div>
            </div>
          </div>
        );
    }
  };

  // Component type detection
  const getComponentType = () => {
    const componentType = (component.type || '').toLowerCase();
    const componentName = (component.name || component.label || '').toLowerCase();
    const visualType = (component.visualType || '').toLowerCase();
    
    // Check for specific component types
    if (componentType === 'progress' || componentName.includes('progress')) return 'progress';
    if (componentType === 'filter' || componentName.includes('filter')) return 'filter';
    if (componentType === 'text' || componentName.includes('text')) return 'text';
    if (componentType === 'image' || componentName.includes('image') || componentName.includes('logo')) return 'image';
    if (componentType === 'table' || visualType === 'table' || componentName.includes('table')) return 'table';
    
    // Chart types
    const chartTypes = ['bar', 'line', 'area', 'pie', 'donut', 'heatmap', 'scatter', 'funnel'];
    const isChart = componentType === 'chart' || 
                   chartTypes.some(type => 
                     componentName.includes(type) || 
                     componentType.includes(type) || 
                     visualType.includes(type)
                   ) || componentName.includes('chart');
    
    if (isChart) return 'chart';
    
    // Default to KPI
    return 'kpi';
  };

  const renderTable = () => {
    const tableData = [
      { month: 'January', revenue: '$45,000', orders: 156, growth: '+12%' },
      { month: 'February', revenue: '$52,000', orders: 189, growth: '+15%' },
      { month: 'March', revenue: '$48,000', orders: 167, growth: '+8%' },
      { month: 'April', revenue: '$61,000', orders: 203, growth: '+22%' },
      { month: 'May', revenue: '$55,000', orders: 178, growth: '+18%' },
      { month: 'June', revenue: '$67,000', orders: 234, growth: '+25%' }
    ];

    return (
      <div className="h-full overflow-auto p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
            Data Table
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: currentTheme.cardBorder }}>
                <th className="text-left p-3 font-semibold" style={{ color: currentTheme.textPrimary }}>Month</th>
                <th className="text-left p-3 font-semibold" style={{ color: currentTheme.textPrimary }}>Revenue</th>
                <th className="text-left p-3 font-semibold" style={{ color: currentTheme.textPrimary }}>Orders</th>
                <th className="text-left p-3 font-semibold" style={{ color: currentTheme.textPrimary }}>Growth</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b" style={{ borderColor: currentTheme.cardBorder }}>
                  <td className="p-3" style={{ color: currentTheme.textPrimary }}>{row.month}</td>
                  <td className="p-3 font-semibold" style={{ color: currentTheme.textPrimary }}>{row.revenue}</td>
                  <td className="p-3" style={{ color: currentTheme.textPrimary }}>{row.orders}</td>
                  <td className="p-3 font-semibold" style={{ color: currentTheme.positive }}>{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Main render logic
  const componentType = getComponentType();
  
  console.log('Final Component Type:', componentType, {
    componentName: component.name || component.label,
    componentType: component.type,
    visualType: component.visualType
  });

  const renderContent = () => {
    switch (componentType) {
      case 'progress':
        return renderProgressBar();
      case 'filter':
        return renderFilter();
      case 'text':
        return renderTextBlock();
      case 'image':
        return renderImageLogo();
      case 'table':
        return renderTable();
      case 'chart':
        return renderChart();
      default:
        return renderKPI();
    }
  };

  return (
    <Card 
      className="h-full transition-all duration-200 overflow-hidden"
      style={{ 
        backgroundColor: currentTheme.cardBackground,
        borderColor: currentTheme.cardBorder,
        boxShadow: interactivityLevel !== 'basic' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : undefined
      }}
    >
      <CardContent className="p-0 h-full overflow-hidden">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ComponentRenderer;
