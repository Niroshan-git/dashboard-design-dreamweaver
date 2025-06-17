
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

    // Get chart type from visual or component
    let chartType = visual?.type || component.visualType || component.type;
    
    // Clean up chart type naming
    if (chartType && chartType.includes('-')) {
      chartType = chartType.split('-')[0]; // Convert 'bar-charts' to 'bar'
    }

    console.log('Rendering Chart:', {
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
            <div className="text-xl font-bold mb-4">Heatmap Visualization</div>
            <div className="grid grid-cols-8 gap-1 mb-6">
              {Array.from({ length: 56 }, (_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded border"
                  style={{
                    backgroundColor: currentTheme.chartColors[Math.floor(Math.random() * currentTheme.chartColors.length)] + '60',
                    borderColor: currentTheme.cardBorder
                  }}
                />
              ))}
            </div>
            <div className="text-sm" style={{ color: currentTheme.textSecondary }}>
              Interactive heatmap showing data intensity patterns
            </div>
          </div>
        );

      case 'scatter':
        return (
          <div className="flex items-center justify-center h-full text-center p-8" style={{ color: currentTheme.textPrimary }}>
            <div>
              <div className="text-xl font-bold mb-4">Scatter Plot Analysis</div>
              <div className="w-full h-48 rounded flex items-center justify-center relative" style={{ backgroundColor: currentTheme.chartBackground }}>
                {Array.from({ length: 15 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: currentTheme.chartColors[i % currentTheme.chartColors.length],
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`
                    }}
                  />
                ))}
              </div>
              <div className="text-sm mt-4" style={{ color: currentTheme.textSecondary }}>
                Data point correlation visualization
              </div>
            </div>
          </div>
        );

      case 'funnel':
        return (
          <div className="flex items-center justify-center h-full text-center p-8" style={{ color: currentTheme.textPrimary }}>
            <div>
              <div className="text-xl font-bold mb-4">Funnel Analysis</div>
              <div className="space-y-3">
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

  // Fixed chart detection logic - prioritize visual type and component type
  const isChart = () => {
    // First check if visual exists and has a chart type
    if (visual && visual.type) {
      const visualType = visual.type.toLowerCase();
      console.log('Visual type detected:', visualType);
      
      // Check if visual type is a chart type
      if (visualType.includes('chart') || 
          ['bar', 'line', 'area', 'pie', 'heatmap', 'scatter', 'funnel'].includes(visualType) ||
          visualType.includes('bar') || visualType.includes('line') || 
          visualType.includes('area') || visualType.includes('pie') ||
          visualType.includes('heatmap') || visualType.includes('scatter') ||
          visualType.includes('funnel')) {
        return true;
      }
    }
    
    // Then check component properties
    if (component.visualType) {
      const componentVisualType = component.visualType.toLowerCase();
      console.log('Component visual type detected:', componentVisualType);
      
      if (componentVisualType.includes('chart') || 
          ['bar', 'line', 'area', 'pie', 'heatmap', 'scatter', 'funnel'].includes(componentVisualType) ||
          componentVisualType.includes('bar') || componentVisualType.includes('line') || 
          componentVisualType.includes('area') || componentVisualType.includes('pie') ||
          componentVisualType.includes('heatmap') || componentVisualType.includes('scatter') ||
          componentVisualType.includes('funnel')) {
        return true;
      }
    }
    
    // Check component type
    if (component.type) {
      const componentType = component.type.toLowerCase();
      console.log('Component type detected:', componentType);
      
      if (componentType === 'chart' || 
          ['bar', 'line', 'area', 'pie', 'heatmap', 'scatter', 'funnel'].includes(componentType) ||
          componentType.includes('chart') || componentType.includes('graph')) {
        return true;
      }
    }
    
    // Check component name/label for chart keywords
    const componentName = (component.name || component.label || '').toLowerCase();
    if (componentName.includes('chart') || componentName.includes('graph') ||
        componentName.includes('heatmap') || componentName.includes('funnel') ||
        componentName.includes('scatter')) {
      console.log('Chart detected by name:', componentName);
      return true;
    }
    
    // Default to KPI if no chart indicators found
    console.log('No chart indicators found, defaulting to KPI');
    return false;
  };

  const shouldRenderAsChart = isChart();
  
  console.log('Final Render Decision:', {
    shouldRenderAsChart,
    componentName: component.name || component.label,
    componentType: component.type,
    visualType: visual?.type,
    componentVisualType: component.visualType
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
