
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
          className="p-4 rounded-lg shadow-lg border backdrop-blur-sm"
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
        className="flex flex-col justify-between h-full relative group"
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
      <div className="h-full overflow-auto">
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

  const renderChart = () => {
    // Get chart type from component configuration
    let chartType = component.visualType || component.type || 'bar';
    
    // Clean up chart type naming
    if (chartType && chartType.includes('-')) {
      chartType = chartType.split('-')[0];
    }
    
    console.log('Rendering Chart Type:', chartType, 'Component:', component);

    const chartProps = {
      data: mockData.chartData,
      width: "100%",
      height: 300
    };

    const commonChartStyles = {
      cartesianGrid: { 
        strokeDasharray: "3 3", 
        stroke: currentTheme.chartGridLines,
        strokeOpacity: 0.3
      },
      xAxis: { 
        stroke: currentTheme.chartAxes,
        fontSize: 12,
        fontWeight: 500
      },
      yAxis: { 
        stroke: currentTheme.chartAxes,
        fontSize: 12,
        fontWeight: 500
      }
    };

    switch (chartType.toLowerCase()) {
      case 'bar':
        return (
          <div className="h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
                Bar Chart
              </h3>
            </div>
            <ResponsiveContainer {...chartProps}>
              <BarChart data={mockData.chartData}>
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
        );
      
      case 'line':
        return (
          <div className="h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
                Line Chart
              </h3>
            </div>
            <ResponsiveContainer {...chartProps}>
              <LineChart data={mockData.chartData}>
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
        );
      
      case 'area':
        return (
          <div className="h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
                Area Chart
              </h3>
            </div>
            <ResponsiveContainer {...chartProps}>
              <AreaChart data={mockData.chartData}>
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
        );

      case 'pie':
        const pieData = mockData.chartData.map((item: any, index: number) => ({
          name: item.month,
          value: item.value,
          fill: currentTheme.chartColors[index % currentTheme.chartColors.length]
        }));
        
        return (
          <div className="h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
                Pie Chart
              </h3>
            </div>
            <ResponsiveContainer {...chartProps}>
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
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
        );

      case 'heatmap':
        return (
          <div className="h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
                Heatmap Visualization
              </h3>
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="grid grid-cols-8 gap-1 mb-6">
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
              <div className="text-sm" style={{ color: currentTheme.textSecondary }}>
                Interactive heatmap showing data intensity patterns
              </div>
            </div>
          </div>
        );

      case 'scatter':
        return (
          <div className="h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
                Scatter Plot Analysis
              </h3>
            </div>
            <div className="flex items-center justify-center flex-1">
              <div className="w-full h-48 rounded flex items-center justify-center relative" style={{ backgroundColor: currentTheme.chartBackground }}>
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
            <div className="text-sm mt-4 text-center" style={{ color: currentTheme.textSecondary }}>
              Data point correlation visualization
            </div>
          </div>
        );

      case 'funnel':
        return (
          <div className="h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.textPrimary }}>
                Funnel Analysis
              </h3>
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="space-y-3 w-full max-w-md">
                {['100% - Initial Stage', '85% - Qualified Leads', '65% - Proposals', '40% - Negotiations', '25% - Closed Deals'].map((label, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div
                      className="h-8 rounded flex items-center justify-center text-white text-xs font-medium"
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
              <div className="text-sm mt-4" style={{ color: currentTheme.textSecondary }}>
                Conversion process visualization
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full text-center" style={{ color: currentTheme.textMuted }}>
            <div>
              <div className="text-lg font-medium mb-2">Chart Preview</div>
              <div className="text-sm">Type: {chartType || 'Unknown'}</div>
              <div className="text-xs mt-2">Component: {component.name || component.label || 'Unnamed'}</div>
            </div>
          </div>
        );
    }
  };

  // Improved chart detection logic - check component type and visual configuration
  const isChart = () => {
    // Check component type first
    const componentType = (component.type || '').toLowerCase();
    const visualType = (component.visualType || '').toLowerCase();
    const componentName = (component.name || component.label || '').toLowerCase();
    
    console.log('Chart Detection:', {
      componentType,
      visualType,
      componentName,
      component
    });
    
    // Chart types to look for
    const chartTypes = ['bar', 'line', 'area', 'pie', 'heatmap', 'scatter', 'funnel', 'chart'];
    
    // Check if it's explicitly a chart type
    if (chartTypes.some(type => 
      componentType.includes(type) || 
      visualType.includes(type) || 
      componentName.includes(type)
    )) {
      return true;
    }
    
    // Check if component type is 'chart'
    if (componentType === 'chart' || visualType === 'chart') {
      return true;
    }
    
    return false;
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
    visualType: component.visualType
  });

  return (
    <Card 
      className="h-full transition-all duration-200 hover:shadow-lg"
      style={{ 
        backgroundColor: currentTheme.cardBackground,
        borderColor: currentTheme.cardBorder
      }}
    >
      <CardContent className="p-6 h-full">
        {shouldRenderAsTable ? renderTable() : 
         shouldRenderAsChart ? renderChart() : 
         renderKPI()}
      </CardContent>
    </Card>
  );
};

export default ComponentRenderer;
