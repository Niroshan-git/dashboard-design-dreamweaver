
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { DollarSign, Users, TrendingDown, User, TrendingUp, ShoppingCart } from "lucide-react";
import { AdvancedThemeColors, advancedThemes } from "@/utils/advancedThemeSystem";

interface ComponentRendererProps {
  component: any;
  linkedVisual: any;
  themeColors: AdvancedThemeColors;
  mockData: any;
  config: any;
}

const ComponentRenderer = ({ component, linkedVisual, themeColors, mockData, config }: ComponentRendererProps) => {
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
      className="p-6 rounded-xl shadow-xl border backdrop-blur-sm min-w-[320px]"
      style={{ 
        backgroundColor: currentTheme.tooltipBackground,
        borderColor: currentTheme.tooltipBorder,
        color: currentTheme.tooltipText
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{kpi.label}</h3>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${kpi.color.replace('text-', '').replace('-600', '')}20` }}
        >
          <kpi.icon size={24} style={{ color: kpi.color.includes('green') ? currentTheme.positive : 
                                              kpi.color.includes('red') ? currentTheme.negative :
                                              kpi.color.includes('blue') ? currentTheme.info : currentTheme.warning }} />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-3xl font-bold">{kpi.value}</span>
          <span 
            className={`ml-3 text-lg font-medium ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
            style={{ color: kpi.trend === 'up' ? currentTheme.positive : currentTheme.negative }}
          >
            {kpi.change}
          </span>
        </div>
        <div className="text-sm opacity-80">
          <p className="font-semibold mb-2">Performance Insight:</p>
          <p className="mb-2">
            {kpi.trend === 'up' ? 'Showing positive growth trend with strong momentum' : 'Needs attention for improvement and optimization'}
          </p>
          <div className="bg-opacity-20 p-3 rounded-lg mt-3" style={{ backgroundColor: currentTheme.info }}>
            <p className="text-sm">
              <strong>Key Metrics:</strong> Track daily variations and identify patterns for better decision making.
            </p>
          </div>
        </div>
        <div className="pt-3 border-t" style={{ borderColor: currentTheme.tooltipBorder }}>
          <p className="text-xs opacity-60">Last updated: {new Date().toLocaleString()}</p>
          <p className="text-xs opacity-60 mt-1">Data refreshes every 5 minutes</p>
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

  // Progress bar variants for advanced level
  const getProgressBarVariant = (index: number) => {
    const variants = [
      { type: 'gradient', colors: [currentTheme.positive, currentTheme.info] },
      { type: 'striped', color: currentTheme.warning },
      { type: 'animated', color: currentTheme.negative },
      { type: 'segmented', colors: [currentTheme.positive, currentTheme.warning, currentTheme.negative] }
    ];
    return variants[index % variants.length];
  };

  const renderMiniChart = (type: string, data: any[], colors: string[]) => {
    switch (type) {
      case 'sparkline':
        return (
          <ResponsiveContainer width="100%" height={40}>
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
        );
      case 'minibar':
        return (
          <ResponsiveContainer width="100%" height={40}>
            <BarChart data={data}>
              <Bar dataKey="value" fill={colors[1]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'lollipop':
        return (
          <ResponsiveContainer width="100%" height={40}>
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
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={40}>
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
        className="flex flex-col justify-between h-full"
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
            className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
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
        
        {/* Enhanced Interaction - Tooltip on Hover */}
        {interactivityLevel === 'highly-interactive' && (
          <div className="relative group">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
              <KPITooltip kpi={kpi} />
            </div>
            <div className="text-sm mt-2" style={{ color: currentTheme.textMuted }}>
              Hover for detailed insights
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChart = () => {
    const chartProps = {
      data: mockData.chartData,
      width: "100%",
      height: 300,
      style: { backgroundColor: currentTheme.chartBackground }
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

    switch (linkedVisual?.type) {
      case 'bar':
        return (
          <ResponsiveContainer {...chartProps}>
            <BarChart data={mockData.chartData}>
              <CartesianGrid {...commonChartStyles.cartesianGrid} />
              <XAxis {...commonChartStyles.xAxis} dataKey="month" />
              <YAxis {...commonChartStyles.yAxis} />
              {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                <Tooltip content={<CustomTooltip />} />
              )}
              <Bar 
                dataKey="value" 
                fill={currentTheme.chartColors[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer {...chartProps}>
            <LineChart data={mockData.chartData}>
              <CartesianGrid {...commonChartStyles.cartesianGrid} />
              <XAxis {...commonChartStyles.xAxis} dataKey="month" />
              <YAxis {...commonChartStyles.yAxis} />
              {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                <Tooltip content={<CustomTooltip />} />
              )}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={currentTheme.chartColors[1]}
                strokeWidth={3}
                dot={{ fill: currentTheme.chartColors[1], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: currentTheme.chartColors[1], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer {...chartProps}>
            <AreaChart data={mockData.chartData}>
              <CartesianGrid {...commonChartStyles.cartesianGrid} />
              <XAxis {...commonChartStyles.xAxis} dataKey="month" />
              <YAxis {...commonChartStyles.yAxis} />
              {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                <Tooltip content={<CustomTooltip />} />
              )}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={currentTheme.chartColors[2]}
                fill={currentTheme.chartColors[2]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div className="text-center py-8" style={{ color: currentTheme.textMuted }}>Chart preview</div>;
    }
  };

  return (
    <Card 
      className="h-full transition-all duration-200 hover:shadow-lg"
      style={{ 
        backgroundColor: currentTheme.cardBackground,
        borderColor: currentTheme.cardBorder
      }}
    >
      <CardContent className="p-6 h-full">
        {component.type === 'chart' ? renderChart() : renderKPI()}
      </CardContent>
    </Card>
  );
};

export default ComponentRenderer;
