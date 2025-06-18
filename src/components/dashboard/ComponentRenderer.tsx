
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, TrendingDown, User, TrendingUp, ShoppingCart } from "lucide-react";
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
  const interactivityLevel = config?.interactivity || 'basic';
  const currentTheme = advancedThemes[config?.themeStyle] || advancedThemes.minimal;
  
  // Enhanced tooltip content with theme colors
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded-lg shadow-lg border backdrop-blur-sm"
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
        </div>
      );
    }
    return null;
  };

  const renderKPI = () => {
    const kpi = mockData.kpiData[0]; // Get the first KPI for simplicity
    
    return (
      <div 
        className="flex flex-col justify-between h-full relative group p-4"
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
      </div>
    );
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

  // Improved chart type detection - prioritize component.chartType property
  const getChartType = () => {
    console.log('Component for chart type detection:', component);
    
    // First priority: direct chartType property from component
    if (component.chartType) {
      console.log('Found chartType property:', component.chartType);
      return component.chartType;
    }
    
    // Second priority: linked visual's chartType
    if (visual && visual.chartType) {
      console.log('Found visual chartType:', visual.chartType);
      return visual.chartType;
    }
    
    // Third priority: component name/label analysis
    const componentName = (component.name || component.label || '').toLowerCase();
    const componentType = (component.type || '').toLowerCase();
    const visualType = (component.visualType || '').toLowerCase();
    
    console.log('Chart Type Detection fallback:', {
      componentName,
      componentType,
      visualType,
      component
    });

    // Chart type detection from names
    if (componentName.includes('line') || componentType.includes('line') || visualType.includes('line')) return 'line';
    if (componentName.includes('area') || componentType.includes('area') || visualType.includes('area')) return 'area';
    if (componentName.includes('pie') || componentType.includes('pie') || visualType.includes('pie')) return 'pie';
    if (componentName.includes('donut') || componentType.includes('donut') || visualType.includes('donut')) return 'donut';
    if (componentName.includes('heatmap') || componentType.includes('heatmap') || visualType.includes('heatmap')) return 'heatmap';
    if (componentName.includes('scatter') || componentType.includes('scatter') || visualType.includes('scatter')) return 'scatter';
    if (componentName.includes('funnel') || componentType.includes('funnel') || visualType.includes('funnel')) return 'funnel';
    if (componentName.includes('bar') || componentType.includes('bar') || visualType.includes('bar')) return 'bar';
    
    // Default fallback
    return 'bar';
  };

  const renderChart = () => {
    const chartType = getChartType();
    
    console.log('Final Chart Type for Rendering:', chartType);

    const chartProps = {
      data: mockData.chartData,
      margin: { top: 10, right: 10, left: 10, bottom: 10 }
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

    switch (chartType) {
      case 'bar':
        return (
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
                  <Tooltip content={<CustomTooltip />} />
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
        return (
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
                  <Tooltip content={<CustomTooltip />} />
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
        return (
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
                  <Tooltip content={<CustomTooltip />} />
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
        
        return (
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                {component.name || component.label || 'Pie Chart'}
              </h3>
            </div>
            <div style={{ height: 'calc(100% - 40px)', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
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
        
        return (
          <div className="h-full p-3">
            <div className="mb-2">
              <h3 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                {component.name || component.label || 'Donut Chart'}
              </h3>
            </div>
            <div style={{ height: 'calc(100% - 40px)', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
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
        return (
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
        return (
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
        return (
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

  // Improved detection logic - check for specific chart types
  const isChart = () => {
    // Direct type check first
    if (component.type === 'chart') return true;
    
    const componentName = (component.name || component.label || '').toLowerCase();
    const componentType = (component.type || '').toLowerCase();
    const visualType = (component.visualType || '').toLowerCase();
    
    // Chart types to look for
    const chartTypes = ['bar', 'line', 'area', 'pie', 'donut', 'heatmap', 'scatter', 'funnel'];
    
    // Check if it's explicitly a chart type
    return chartTypes.some(type => 
      componentName.includes(type) || 
      componentType.includes(type) || 
      visualType.includes(type)
    ) || componentName.includes('chart');
  };

  const isTable = () => {
    const componentType = (component.type || '').toLowerCase();
    const visualType = (component.visualType || '').toLowerCase();
    const componentName = (component.name || component.label || '').toLowerCase();
    
    return componentType === 'table' || 
           visualType === 'table' || 
           componentName.includes('table');
  };

  const shouldRenderAsChart = isChart();
  const shouldRenderAsTable = isTable();
  
  console.log('Final Render Decision:', {
    shouldRenderAsChart,
    shouldRenderAsTable,
    componentName: component.name || component.label,
    componentType: component.type,
    chartType: component.chartType,
    visualType: component.visualType
  });

  return (
    <Card 
      className="h-full transition-all duration-200 hover:shadow-lg overflow-hidden"
      style={{ 
        backgroundColor: currentTheme.cardBackground,
        borderColor: currentTheme.cardBorder
      }}
    >
      <CardContent className="p-0 h-full overflow-hidden">
        {shouldRenderAsTable ? renderTable() : 
         shouldRenderAsChart ? renderChart() : 
         renderKPI()}
      </CardContent>
    </Card>
  );
};

export default ComponentRenderer;
