import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Area, AreaChart } from "recharts";
import { DollarSign, Users, TrendingDown, User, TrendingUp, ShoppingCart, LayoutGrid, Image } from "lucide-react";

interface ComponentRendererProps {
  component: any;
  linkedVisual: any;
  themeColors: any;
  mockData: any;
  config: any;
  allComponents?: any[];
  containerHeight?: string;
  gridStructure?: any;
}

const ComponentRenderer = ({ component, linkedVisual, themeColors, mockData, config, allComponents = [], containerHeight, gridStructure }: ComponentRendererProps) => {
  // Get interactivity level from config - ensure proper fallback
  const interactivityLevel = config?.interactivityLevel || config?.interactivity || 'basic';
  
  console.log('ComponentRenderer - Interactivity Level:', interactivityLevel);
  console.log('ComponentRenderer - Full Config:', config);

  // Use exact same KPI data as layout preview but prioritize linked visual
  const getKPIData = () => [
    { 
      label: 'Total Revenue', 
      value: '$2.4M', 
      change: '+12.5%', 
      trend: 'up', 
      icon: DollarSign, 
      color: 'text-green-600',
      progress: 85,
      sparklineData: [
        { value: 400 }, { value: 300 }, { value: 500 }, { value: 280 }, { value: 590 }, { value: 320 }, { value: 400 }
      ]
    },
    { 
      label: 'Active Users', 
      value: '45.2K', 
      change: '+8.3%', 
      trend: 'up', 
      icon: Users, 
      color: 'text-blue-600',
      progress: 72,
      sparklineData: [
        { value: 200 }, { value: 400 }, { value: 300 }, { value: 500 }, { value: 280 }, { value: 400 }, { value: 450 }
      ]
    },
    { 
      label: 'Conversion Rate', 
      value: '3.24%', 
      change: '-2.1%', 
      trend: 'down', 
      icon: TrendingDown, 
      color: 'text-red-600',
      progress: 45,
      sparklineData: [
        { value: 100 }, { value: 80 }, { value: 120 }, { value: 90 }, { value: 70 }, { value: 85 }, { value: 75 }
      ]
    },
    { 
      label: 'Customer Satisfaction', 
      value: '94.2%', 
      change: '+5.7%', 
      trend: 'up', 
      icon: User, 
      color: 'text-purple-600',
      progress: 94,
      sparklineData: [
        { value: 350 }, { value: 370 }, { value: 390 }, { value: 360 }, { value: 410 }, { value: 400 }, { value: 420 }
      ]
    },
    { 
      label: 'Sales Growth', 
      value: '18.4%', 
      change: '+3.2%', 
      trend: 'up', 
      icon: TrendingUp, 
      color: 'text-orange-600',
      progress: 78,
      sparklineData: [
        { value: 150 }, { value: 180 }, { value: 220 }, { value: 190 }, { value: 240 }, { value: 210 }, { value: 260 }
      ]
    },
    { 
      label: 'Monthly Orders', 
      value: '1,284', 
      change: '+15.8%', 
      trend: 'up', 
      icon: ShoppingCart, 
      color: 'text-indigo-600',
      progress: 88,
      sparklineData: [
        { value: 80 }, { value: 120 }, { value: 100 }, { value: 140 }, { value: 110 }, { value: 130 }, { value: 128 }
      ]
    }
  ];

  // Get container height - ensure full utilization
  const getContainerHeight = () => {
    return { height: '100%', minHeight: '100%', maxHeight: '100%' };
  };

  // Calculate chart configuration based on component type and available space
  const getChartConfig = () => {
    if (component.type === 'kpi') {
      return null; // KPIs don't use chart config
    }

    const currentRow = component.position?.row || 1;
    const currentRowHeight = gridStructure?.rowHeights?.[currentRow];
    
    // Check if this is an enhanced row (has increased height)
    const isEnhancedRow = currentRowHeight && (currentRowHeight.includes('1.2') || currentRowHeight.includes('1.4'));
    
    // Base configuration for different chart types
    const baseConfig = {
      margins: { top: 10, right: 15, left: 20, bottom: 25 },
      tickFontSize: 11,
      gridSpacing: 3,
      contentPadding: 12
    };

    if (isEnhancedRow) {
      // Enhanced charts get more generous spacing
      return {
        margins: { top: 15, right: 25, left: 30, bottom: 35 },
        tickFontSize: 12,
        gridSpacing: 4,
        contentPadding: 16
      };
    }
    
    return baseConfig;
  };

  const renderKPIComponent = () => {
    // Prioritize linked visual count over component count
    const kpiCount = linkedVisual?.kpiCount || component.kpiCount || linkedVisual?.count || 1;
    const kpiData = getKPIData();
    const kpisToShow = kpiData.slice(0, kpiCount);

    // For single KPI, just show one card
    if (kpiCount === 1) {
      const kpi = kpisToShow[0];
      const IconComponent = kpi.icon;
      
      const cardContent = (
        <Card 
          className={`flex flex-col h-full transition-shadow ${
            interactivityLevel === 'basic' ? '' : 'hover:shadow-md'
          } ${
            interactivityLevel === 'highly-interactive' ? 'hover:scale-105 transition-transform duration-200' : ''
          }`}
          style={{ 
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.borderColor,
            color: themeColors.textPrimary,
            ...getContainerHeight()
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 flex-shrink-0">
            <CardTitle className="font-medium text-sm" style={{ color: themeColors.textSecondary }}>
              {linkedVisual ? linkedVisual.name : kpi.label}
            </CardTitle>
            <IconComponent className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center px-4 pb-4 space-y-3">
            <div className="font-bold mb-2 text-2xl" style={{ color: themeColors.textPrimary }}>
              {kpi.value}
            </div>
            <div className="flex items-center mb-2">
              <Badge variant={kpi.trend === 'up' ? "secondary" : "destructive"} className="text-xs">
                {kpi.change}
              </Badge>
              <span className="ml-2 text-xs" style={{ color: themeColors.textSecondary }}>
                vs last period
              </span>
            </div>
            
            {/* Progress bar for advanced and highly-interactive levels */}
            {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs" style={{ color: themeColors.textSecondary }}>
                  <span>Target Progress</span>
                  <span>{kpi.progress}%</span>
                </div>
                <Progress value={kpi.progress} className="h-2" />
              </div>
            )}
            
            {/* Sparkline for highly interactive level only */}
            {interactivityLevel === 'highly-interactive' && kpi.sparklineData && (
              <div className="mt-2">
                <div className="text-xs mb-1" style={{ color: themeColors.textSecondary }}>7-day trend</div>
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={kpi.sparklineData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={themeColors.chartColors[0]} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      );

      // Add tooltip for highly interactive mode only
      if (interactivityLevel === 'highly-interactive') {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {cardContent}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{linkedVisual ? linkedVisual.name : kpi.label}</p>
                  <p className="text-xs text-muted-foreground">Current: {kpi.value}</p>
                  <p className="text-xs text-muted-foreground">Change: {kpi.change}</p>
                  <p className="text-xs text-muted-foreground">Progress: {kpi.progress}%</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return cardContent;
    }

    // For multiple KPIs, arrange them horizontally (max 4 per row)
    const maxKpisPerRow = Math.min(kpiCount, 4);
    
    return (
      <div className="grid gap-2 w-full h-full" style={{ gridTemplateColumns: `repeat(${maxKpisPerRow}, 1fr)` }}>
        {kpisToShow.map((kpi, index) => {
          const IconComponent = kpi.icon;
          
          const cardContent = (
            <Card 
              key={index} 
              className={`h-full flex flex-col transition-shadow ${
                interactivityLevel === 'basic' ? '' : 'hover:shadow-md'
              } ${
                interactivityLevel === 'highly-interactive' ? 'hover:scale-105 transition-transform duration-200' : ''
              }`}
              style={{ 
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.borderColor,
                color: themeColors.textPrimary
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3 flex-shrink-0">
                <CardTitle className="text-xs font-medium truncate" style={{ color: themeColors.textSecondary }}>
                  {linkedVisual ? linkedVisual.name : kpi.label}
                </CardTitle>
                <IconComponent className={`h-3 w-3 flex-shrink-0 ${kpi.color}`} />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center px-3 pb-3 space-y-2">
                <div className="text-lg font-bold mb-1" style={{ color: themeColors.textPrimary }}>{kpi.value}</div>
                <div className="flex items-center mb-1">
                  <Badge variant={kpi.trend === 'up' ? "secondary" : "destructive"} className="text-xs px-1 py-0">
                    {kpi.change}
                  </Badge>
                  <span className="text-xs ml-1" style={{ color: themeColors.textSecondary }}>vs last</span>
                </div>
                
                {/* Progress bar for advanced and highly-interactive levels */}
                {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                  <div className="space-y-1">
                    <Progress value={kpi.progress} className="h-1" />
                    <div className="text-xs text-center" style={{ color: themeColors.textMuted }}>
                      {kpi.progress}%
                    </div>
                  </div>
                )}
                
                {/* Mini bar chart or sparkline for highly interactive only - vary by index */}
                {interactivityLevel === 'highly-interactive' && (
                  <div className="mt-1">
                    <ResponsiveContainer width="100%" height={25}>
                      {index % 2 === 0 ? (
                        <BarChart data={kpi.sparklineData}>
                          <Bar 
                            dataKey="value" 
                            fill={themeColors.chartColors[index % themeColors.chartColors.length]}
                            radius={[1, 1, 0, 0]}
                          />
                        </BarChart>
                      ) : (
                        <LineChart data={kpi.sparklineData}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={themeColors.chartColors[index % themeColors.chartColors.length]} 
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          );

          // Add tooltip for highly interactive mode only
          if (interactivityLevel === 'highly-interactive') {
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {cardContent}
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{linkedVisual ? linkedVisual.name : kpi.label}</p>
                      <p className="text-xs text-muted-foreground">Current: {kpi.value}</p>
                      <p className="text-xs text-muted-foreground">Change: {kpi.change}</p>
                      <p className="text-xs text-muted-foreground">Progress: {kpi.progress}%</p>
                    </div>
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

  const renderChartComponent = () => {
    const chartType = linkedVisual?.chartType || component.chartType || 'bar';
    const chartConfig = getChartConfig();
    
    return (
      <Card 
        className={`flex flex-col overflow-hidden ${
          interactivityLevel === 'basic' ? '' : 'hover:shadow-lg transition-shadow duration-300'
        }`}
        style={{ 
          backgroundColor: themeColors.cardBackground, 
          borderColor: themeColors.borderColor, 
          ...getContainerHeight() 
        }}
      >
        <CardHeader className="flex-shrink-0 px-3 pt-3 pb-2">
          <CardTitle className="text-sm font-medium truncate" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`}
          </CardTitle>
          <CardDescription className="text-xs truncate" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Chart visualization' : 'Performance metrics over time'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-2 min-h-0 overflow-hidden">
          <div className="w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart margin={chartConfig.margins}>
                  <Pie
                    data={[
                      { name: 'Category A', value: 45, color: themeColors.chartColors[0] },
                      { name: 'Category B', value: 30, color: themeColors.chartColors[1] },
                      { name: 'Category C', value: 25, color: themeColors.chartColors[2] }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[0, 1, 2].map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={themeColors.chartColors[i]} />
                    ))}
                  </Pie>
                  {/* Show tooltip for advanced and highly-interactive levels only */}
                  {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: themeColors.cardBackground,
                        border: `1px solid ${themeColors.borderColor}`,
                        borderRadius: '6px',
                        boxShadow: interactivityLevel === 'highly-interactive' ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                </PieChart>
              ) : chartType === 'donut' ? (
                <PieChart margin={chartConfig.margins}>
                  <Pie
                    data={[
                      { name: 'Category A', value: 45, color: themeColors.chartColors[0] },
                      { name: 'Category B', value: 30, color: themeColors.chartColors[1] },
                      { name: 'Category C', value: 25, color: themeColors.chartColors[2] }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[0, 1, 2].map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={themeColors.chartColors[i]} />
                    ))}
                  </Pie>
                  {/* Show tooltip for advanced and highly-interactive levels only */}
                  {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: themeColors.cardBackground,
                        border: `1px solid ${themeColors.borderColor}`,
                        borderRadius: '6px',
                        boxShadow: interactivityLevel === 'highly-interactive' ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                </PieChart>
              ) : chartType === 'line' ? (
                <LineChart data={mockData.chartData} margin={chartConfig.margins}>
                  <CartesianGrid strokeDasharray={`${chartConfig.gridSpacing} ${chartConfig.gridSpacing}`} stroke={themeColors.borderColor} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }} 
                    axisLine={{ stroke: themeColors.borderColor }}
                    height={30}
                  />
                  <YAxis 
                    tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }}
                    axisLine={{ stroke: themeColors.borderColor }}
                    width={40}
                  />
                  {/* Show tooltip for advanced and highly-interactive levels only */}
                  {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: themeColors.cardBackground,
                        border: `1px solid ${themeColors.borderColor}`,
                        borderRadius: '6px',
                        boxShadow: interactivityLevel === 'highly-interactive' ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={themeColors.chartColors[0]} 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: themeColors.chartColors[0] }}
                    activeDot={{ r: interactivityLevel === 'highly-interactive' ? 6 : 5, fill: themeColors.chartColors[0] }}
                  />
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={mockData.chartData} margin={chartConfig.margins}>
                  <CartesianGrid strokeDasharray={`${chartConfig.gridSpacing} ${chartConfig.gridSpacing}`} stroke={themeColors.borderColor} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }}
                    axisLine={{ stroke: themeColors.borderColor }}
                    height={30}
                  />
                  <YAxis 
                    tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }}
                    axisLine={{ stroke: themeColors.borderColor }}
                    width={40}
                  />
                  {/* Show tooltip for advanced and highly-interactive levels only */}
                  {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: themeColors.cardBackground,
                        border: `1px solid ${themeColors.borderColor}`,
                        borderRadius: '6px',
                        boxShadow: interactivityLevel === 'highly-interactive' ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={themeColors.chartColors[0]} 
                    fill={themeColors.chartColors[0]} 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              ) : (
                <BarChart data={mockData.chartData} margin={chartConfig.margins}>
                  <CartesianGrid strokeDasharray={`${chartConfig.gridSpacing} ${chartConfig.gridSpacing}`} stroke={themeColors.borderColor} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }}
                    axisLine={{ stroke: themeColors.borderColor }}
                    height={30}
                  />
                  <YAxis 
                    tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }}
                    axisLine={{ stroke: themeColors.borderColor }}
                    width={40}
                  />
                  {/* Show tooltip for advanced and highly-interactive levels only */}
                  {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: themeColors.cardBackground,
                        border: `1px solid ${themeColors.borderColor}`,
                        borderRadius: '6px',
                        boxShadow: interactivityLevel === 'highly-interactive' ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                  <Bar 
                    dataKey="value" 
                    fill={themeColors.chartColors[0]}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTableComponent = () => {
    const sampleData = [
      { id: 1, name: 'Product A', value: '$1,234', status: 'Active', date: '2024-01-15' },
      { id: 2, name: 'Product B', value: '$2,456', status: 'Pending', date: '2024-01-14' },
      { id: 3, name: 'Product C', value: '$789', status: 'Active', date: '2024-01-13' },
      { id: 4, name: 'Product D', value: '$3,456', status: 'Active', date: '2024-01-12' },
      { id: 5, name: 'Product E', value: '$567', status: 'Pending', date: '2024-01-11' },
    ];

    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Data Table'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Table data' : 'Tabular data representation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-2">
          <div className="flex-1 overflow-auto border rounded" style={{ borderColor: themeColors.borderColor }}>
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ backgroundColor: themeColors.cardBackground }}>
                <tr className="border-b" style={{ borderColor: themeColors.borderColor }}>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Name</th>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Value</th>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Status</th>
                  <th className="text-left p-2 font-medium" style={{ color: themeColors.textPrimary }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50" style={{ borderColor: themeColors.borderColor }}>
                    <td className="p-2" style={{ color: themeColors.textPrimary }}>{row.name}</td>
                    <td className="p-2" style={{ color: themeColors.textPrimary }}>{row.value}</td>
                    <td className="p-2">
                      <Badge variant={row.status === 'Active' ? 'secondary' : 'outline'} className="text-xs">{row.status}</Badge>
                    </td>
                    <td className="p-2 text-xs" style={{ color: themeColors.textSecondary }}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProgressComponent = () => {
    const progressData = [
      { label: 'Sales Target', value: 85, color: 'bg-blue-500' },
      { label: 'Customer Satisfaction', value: 92, color: 'bg-green-500' },
      { label: 'Project Completion', value: 67, color: 'bg-yellow-500' },
      { label: 'Team Performance', value: 78, color: 'bg-purple-500' }
    ];

    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-1 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Progress Indicators'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Goal completion tracking' : 'Goal completion tracking'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center px-3 pb-3">
          <div className="space-y-4">
            {progressData.map((item, index) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ color: themeColors.textPrimary }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: themeColors.textPrimary }}>
                    {item.value}%
                  </span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTextComponent = () => {
    const textContent = linkedVisual?.textContent || component.textContent || 'Welcome to your Dashboard! This is your central hub for monitoring key metrics and insights. Navigate through different sections to explore your data and make informed decisions.';
    
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardContent className="p-4 flex flex-col justify-center flex-1">
          <div style={{ color: themeColors.textPrimary }} className="prose max-w-none">
            <h3 className="text-base font-semibold mb-2">
              {linkedVisual ? linkedVisual.name : 'Dashboard Welcome Message'}
            </h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {textContent}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderImageComponent = () => {
    return (
      <Card className="flex flex-col" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardContent className="p-4 flex items-center justify-center flex-1">
          <div className="text-center" style={{ color: themeColors.textSecondary }}>
            <Image className="w-12 h-12 mx-auto mb-3" />
            <h4 className="font-medium mb-1 text-sm" style={{ color: themeColors.textPrimary }}>
              {linkedVisual ? linkedVisual.name : 'Image Component'}
            </h4>
            <p className="text-xs">
              {linkedVisual ? linkedVisual.description || 'Image placeholder' : 'Image visualization placeholder'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderHeatmapComponent = () => {
    const chartConfig = getChartConfig();
    
    return (
      <Card className="flex flex-col overflow-hidden" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-2 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Heatmap Visualization'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Heatmap data visualization' : 'Interactive heatmap display'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-3 min-h-0">
          <div className="grid grid-cols-7 gap-1 w-full h-full max-w-full">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm min-h-0"
                style={{
                  backgroundColor: themeColors.chartColors[i % themeColors.chartColors.length],
                  opacity: Math.random() * 0.8 + 0.2,
                  height: 'auto',
                  minHeight: '15px'
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderScatterComponent = () => {
    const chartConfig = getChartConfig();
    
    return (
      <Card className="flex flex-col overflow-hidden" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-2 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Scatter Plot'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description || 'Scatter plot visualization' : 'Data point correlation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-2 overflow-hidden">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.chartData} margin={chartConfig.margins}>
                <CartesianGrid strokeDasharray={`${chartConfig.gridSpacing} ${chartConfig.gridSpacing}`} stroke={themeColors.borderColor} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }} 
                  height={30}
                />
                <YAxis 
                  tick={{ fontSize: chartConfig.tickFontSize, fill: themeColors.textSecondary }} 
                  width={40}
                />
                {(interactivityLevel === 'advanced' || interactivityLevel === 'highly-interactive') && (
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: themeColors.cardBackground,
                      border: `1px solid ${themeColors.borderColor}`,
                      borderRadius: '6px'
                    }}
                  />
                )}
                <Bar dataKey="value" fill={themeColors.chartColors[0]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFunnelComponent = () => {
    const chartConfig = getChartConfig();
    
    return (
      <Card className="flex flex-col overflow-hidden" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardHeader className="flex-shrink-0 pb-2 px-3 pt-3">
          <CardTitle className="text-sm" style={{ color: themeColors.textPrimary }}>
            {linkedVisual ? linkedVisual.name : 'Funnel Chart'}
          </CardTitle>
          <CardDescription className="text-xs" style={{ color: themeColors.textSecondary }}>
            {linkedVisual ? linkedVisual.description ||'Funnel visualization' : 'Conversion funnel analysis'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center p-3 min-h-0 overflow-hidden">
          <div className="space-y-3 h-full flex flex-col justify-center">
            {['Visitors', 'Leads', 'Opportunities', 'Customers'].map((stage, index) => {
              const width = 100 - (index * 20);
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium flex-shrink-0" style={{ color: themeColors.textPrimary }}>{stage}</div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="h-8 flex items-center justify-center rounded text-sm font-bold transition-all"
                      style={{
                        width: `${width}%`,
                        backgroundColor: themeColors.chartColors[index % themeColors.chartColors.length],
                        color: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {1000 - (index * 200)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDefaultComponent = () => {
    return (
      <Card className="flex flex-col h-full" style={{ backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, ...getContainerHeight() }}>
        <CardContent className="p-4 flex items-center justify-center flex-1">
          <div className="text-center" style={{ color: themeColors.textSecondary }}>
            <LayoutGrid className="w-8 h-8 mx-auto mb-3" />
            <h4 className="font-medium mb-1 text-sm" style={{ color: themeColors.textPrimary }}>
              {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
            </h4>
            <p className="text-xs">Component preview</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  switch (component.type) {
    case 'kpi':
      return renderKPIComponent();
    case 'chart':
      return renderChartComponent();
    case 'table':
      return renderTableComponent();
    case 'progress':
      return renderProgressComponent();
    case 'text':
      return renderTextComponent();
    case 'image':
      return renderImageComponent();
    case 'heatmap':
      return renderHeatmapComponent();
    case 'scatter':
      return renderScatterComponent();
    case 'funnel':
      return renderFunnelComponent();
    default:
      return renderDefaultComponent();
  }
};

export default ComponentRenderer;
