
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

  // Enhanced KPI tooltip for highly interactive mode
  const KPITooltip = ({ kpi }: { kpi: any }) => (
    <div 
      className="absolute z-50 p-8 rounded-xl shadow-2xl border backdrop-blur-sm min-w-[400px] max-w-[500px] -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{ 
        backgroundColor: currentTheme.tooltipBackground,
        borderColor: currentTheme.tooltipBorder,
        color: currentTheme.tooltipText,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{kpi.label}</h3>
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: `${kpi.color.replace('text-', '').replace('-600', '')}20` }}
        >
          <kpi.icon size={32} style={{ color: kpi.color.includes('green') ? currentTheme.positive : 
                                              kpi.color.includes('red') ? currentTheme.negative :
                                              kpi.color.includes('blue') ? currentTheme.info : currentTheme.warning }} />
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <span className="text-4xl font-bold">{kpi.value}</span>
          <span 
            className={`ml-4 text-xl font-medium`}
            style={{ color: kpi.trend === 'up' ? currentTheme.positive : currentTheme.negative }}
          >
            {kpi.change}
          </span>
        </div>
        <div className="text-base opacity-90">
          <p className="font-semibold mb-3">Performance Insight:</p>
          <p className="mb-3 leading-relaxed">
            {kpi.trend === 'up' ? 'Showing positive growth trend with strong momentum and excellent performance indicators' : 'Needs attention for improvement and optimization to meet target objectives'}
          </p>
          <div className="bg-opacity-20 p-4 rounded-lg mt-4" style={{ backgroundColor: currentTheme.info }}>
            <p className="text-base">
              <strong>Key Metrics:</strong> Track daily variations and identify patterns for better decision making and strategic planning.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t" style={{ borderColor: currentTheme.tooltipBorder }}>
          <p className="text-sm opacity-70">Last updated: {new Date().toLocaleString()}</p>
          <p className="text-sm opacity-70 mt-1">Data refreshes every 5 minutes</p>
        </div>
      </div>
    </div>
  );

  // Mini chart data generator
  const generateMiniChartData = (type: string) => {
    const baseData = Array.from({ length: 7 }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20,
      value2: Math.floor(Math.random() * 80) + 10
    }));
    return baseData;
  };

  const renderMiniChart = (type: string, data: any[], colors: string[]) => {
    switch (type) {
      case 'sparkline':
        return (
          <div className="w-full h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors[0]} 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'minibar':
        return (
          <div className="w-full h-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="value" fill={colors[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'lollipop':
        return (
          <div className="w-full h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors[2]} 
                  strokeWidth={3}
                  dot={{ fill: colors[2], strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'area':
        return (
          <div className="w-full h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors[3]} 
                  fill={colors[3]} 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  const renderKPI = () => {
    const kpi = mockData.kpiData[0]; // Get the first KPI for simplicity
    const miniChartData = generateMiniChartData('kpi');
    const chartTypes = ['sparkline', 'minibar', 'lollipop', 'area'];
    const selectedChartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

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
        
        {/* Advanced Level - Progress Bars */}
        {interactivityLevel === 'advanced' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.floor(Math.random() * 100)}%`,
                  background: `linear-gradient(90deg, ${currentTheme.positive}, ${currentTheme.info})`
                }}
              ></div>
            </div>
            <div className="text-xs mt-1" style={{ color: currentTheme.textSecondary }}>
              Performance indicator
            </div>
          </div>
        )}

        {/* Highly Interactive Level - Mini Charts */}
        {interactivityLevel === 'highly-interactive' && (
          <div className="mt-4">
            <div className="mb-2">
              <span className="text-xs font-medium" style={{ color: currentTheme.textSecondary }}>
                Trend ({selectedChartType})
              </span>
            </div>
            {renderMiniChart(selectedChartType, miniChartData, currentTheme.chartColors)}
          </div>
        )}
      </div>
    );
  };

  const renderChart = () => {
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

    // Determine chart type - prioritize visual type, then component visualType, then component type
    let chartType = visual?.type || component.visualType || component.type;
    
    // Clean up chart type naming
    if (chartType && chartType.includes('-')) {
      chartType = chartType.split('-')[0]; // Convert 'bar-charts' to 'bar'
    }

    console.log('Chart Rendering:', {
      visualType: visual?.type,
      componentVisualType: component.visualType,
      componentType: component.type,
      finalChartType: chartType,
      componentName: component.name || component.label
    });

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer {...chartProps}>
            <BarChart data={mockData.chartData} style={{ backgroundColor: currentTheme.chartBackground }}>
              <CartesianGrid {...commonChartStyles.cartesianGrid} />
              <XAxis {...commonChartStyles.xAxis} dataKey="month" />
              <YAxis {...commonChartStyles.yAxis} />
              {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                <Tooltip content={<CustomTooltip />} />
              )}
              <Legend />
              <Bar 
                dataKey="value" 
                fill={currentTheme.chartColors[0]}
                radius={[4, 4, 0, 0]}
                name="Sales Data"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer {...chartProps}>
            <LineChart data={mockData.chartData} style={{ backgroundColor: currentTheme.chartBackground }}>
              <CartesianGrid {...commonChartStyles.cartesianGrid} />
              <XAxis {...commonChartStyles.xAxis} dataKey="month" />
              <YAxis {...commonChartStyles.yAxis} />
              {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                <Tooltip content={<CustomTooltip />} />
              )}
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
        );
      
      case 'area':
        return (
          <ResponsiveContainer {...chartProps}>
            <AreaChart data={mockData.chartData} style={{ backgroundColor: currentTheme.chartBackground }}>
              <CartesianGrid {...commonChartStyles.cartesianGrid} />
              <XAxis {...commonChartStyles.xAxis} dataKey="month" />
              <YAxis {...commonChartStyles.yAxis} />
              {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                <Tooltip content={<CustomTooltip />} />
              )}
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
        );

      case 'pie':
        const pieData = mockData.chartData.map((item: any, index: number) => ({
          name: item.month,
          value: item.value,
          fill: currentTheme.chartColors[index % currentTheme.chartColors.length]
        }));
        
        return (
          <ResponsiveContainer {...chartProps}>
            <PieChart>
              {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                <Tooltip content={<CustomTooltip />} />
              )}
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
        );

      case 'heatmap':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8" style={{ color: currentTheme.textPrimary }}>
            <div className="grid grid-cols-6 gap-2 mb-6">
              {Array.from({ length: 42 }, (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded border"
                  style={{
                    backgroundColor: currentTheme.chartColors[Math.floor(Math.random() * currentTheme.chartColors.length)] + '40',
                    borderColor: currentTheme.cardBorder
                  }}
                />
              ))}
            </div>
            <div className="text-xl font-bold mb-2">Heatmap Visualization</div>
            <div className="text-sm" style={{ color: currentTheme.textSecondary }}>
              Interactive heatmap showing data intensity
            </div>
          </div>
        );

      case 'scatter':
        return (
          <div className="flex items-center justify-center h-full text-center p-8" style={{ color: currentTheme.textPrimary }}>
            <div>
              <div className="text-xl font-bold mb-2">Scatter Plot</div>
              <div className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>
                Data point correlation visualization
              </div>
              <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                <span style={{ color: currentTheme.textMuted }}>Scatter plot data points</span>
              </div>
            </div>
          </div>
        );

      case 'funnel':
        return (
          <div className="flex items-center justify-center h-full text-center p-8" style={{ color: currentTheme.textPrimary }}>
            <div>
              <div className="text-xl font-bold mb-2">Funnel Chart</div>
              <div className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>
                Conversion process visualization
              </div>
              <div className="space-y-2">
                {['100%', '75%', '50%', '25%'].map((width, index) => (
                  <div
                    key={index}
                    className="h-8 rounded"
                    style={{
                      width: width,
                      backgroundColor: currentTheme.chartColors[index % currentTheme.chartColors.length] + '60',
                      margin: '0 auto'
                    }}
                  />
                ))}
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

  // Improved chart detection logic - more specific and reliable
  const isChart = () => {
    const visualType = visual?.type;
    const componentType = component.type;
    const componentVisualType = component.visualType;
    
    console.log('Chart Detection Logic:', {
      visualType,
      componentType,
      componentVisualType,
      componentName: component.name || component.label
    });
    
    // Chart types that should render as charts
    const chartTypes = [
      'bar', 'bar-charts',
      'line', 'line-charts', 
      'area', 'area-charts',
      'pie', 'pie-charts',
      'heatmap', 'heatmaps',
      'scatter', 'scatter-charts',
      'funnel', 'funnel-charts'
    ];
    
    // First check visual type (highest priority)
    if (visualType && chartTypes.includes(visualType)) {
      return true;
    }
    
    // Then check component visual type
    if (componentVisualType && chartTypes.includes(componentVisualType)) {
      return true;
    }    
    
    // Finally check component type
    if (componentType === 'chart' || chartTypes.includes(componentType)) {
      return true;
    }
    
    // Special case: if component has 'chart' in its name or label
    const componentName = (component.name || component.label || '').toLowerCase();
    if (componentName.includes('chart') || componentName.includes('graph')) {
      return true;
    }
    
    return false;
  };

  const shouldRenderAsChart = isChart();
  
  console.log('Final Render Decision:', {
    shouldRenderAsChart,
    componentName: component.name || component.label,
    componentType: component.type,
    visualType: visual?.type
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
        {shouldRenderAsChart ? renderChart() : renderKPI()}
      </CardContent>
    </Card>
  );
};

export default ComponentRenderer;
