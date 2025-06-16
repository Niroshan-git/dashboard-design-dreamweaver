import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { DollarSign, Users, TrendingDown, User, TrendingUp, ShoppingCart } from "lucide-react";
import { AdvancedThemeColors, advancedThemes } from "@/utils/advancedThemeSystem";

interface ComponentRendererProps {
  component: any;
  visual: any;
  themeColors: AdvancedThemeColors;
  mockData: any;
  config: any;
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
      className="p-6 rounded-xl shadow-xl border backdrop-blur-sm min-w-[280px]"
      style={{ 
        backgroundColor: currentTheme.tooltipBackground,
        borderColor: currentTheme.tooltipBorder,
        color: currentTheme.tooltipText
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{kpi.label}</h3>
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${kpi.color.replace('text-', '').replace('-600', '')}20` }}
        >
          <kpi.icon size={20} style={{ color: kpi.color.includes('green') ? currentTheme.positive : 
                                              kpi.color.includes('red') ? currentTheme.negative :
                                              kpi.color.includes('blue') ? currentTheme.info : currentTheme.warning }} />
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-2xl font-bold">{kpi.value}</span>
          <span 
            className={`ml-2 text-sm font-medium ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
            style={{ color: kpi.trend === 'up' ? currentTheme.positive : currentTheme.negative }}
          >
            {kpi.change}
          </span>
        </div>
        <div className="text-sm opacity-80">
          <p>Performance Insight:</p>
          <p className="mt-1">
            {kpi.trend === 'up' ? 'Showing positive growth trend' : 'Needs attention for improvement'}
          </p>
        </div>
        <div className="pt-2 border-t" style={{ borderColor: currentTheme.tooltipBorder }}>
          <p className="text-xs opacity-60">Updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  const renderKPI = () => {
    const kpi = mockData.kpiData[0]; // Get the first KPI for simplicity

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
        
        {/* Enhanced Interaction - Tooltip on Hover */}
        {interactivityLevel === 'highly-interactive' && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <KPITooltip kpi={kpi} />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Hover for more insights
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

    // Apply hover effects based on interactivity level
    const hoverProps = interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive' ? {
      onMouseEnter: (data: any, index: number) => {
        // Chart hover effects
      },
      cursor: 'pointer'
    } : {};

    switch (visual?.type) {
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
                {...hoverProps}
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
                {...hoverProps}
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
                {...hoverProps}
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
