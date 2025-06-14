
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  progress?: number;
  target?: string;
  chartData?: any[];
  chartType?: 'line' | 'area' | 'bar';
  icon?: any;
  color?: string;
}

interface AdvancedKPICardProps {
  data: KPIData;
  themeColors: any;
  size?: 'small' | 'medium' | 'large';
  showChart?: boolean;
  showProgress?: boolean;
}

const AdvancedKPICard = ({ 
  data, 
  themeColors, 
  size = 'medium', 
  showChart = true, 
  showProgress = false 
}: AdvancedKPICardProps) => {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" style={{ color: themeColors.positive }} />;
      case 'down':
        return <TrendingDown className="w-4 h-4" style={{ color: themeColors.negative }} />;
      default:
        return <Minus className="w-4 h-4" style={{ color: themeColors.warning }} />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return themeColors.positive;
      case 'down':
        return themeColors.negative;
      default:
        return themeColors.warning;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-32';
      case 'large':
        return 'h-48';
      default:
        return 'h-40';
    }
  };

  const renderMiniChart = () => {
    if (!showChart || !data.chartData) return null;

    const chartHeight = size === 'small' ? 40 : size === 'large' ? 80 : 60;

    switch (data.chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={data.chartData}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={getTrendColor()}
                fill={getTrendColor()}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data.chartData}>
              <Bar 
                dataKey="value" 
                fill={getTrendColor()}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={data.chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={getTrendColor()}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card 
      className={`${getSizeClasses()} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
      style={{ 
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.cardBorder,
        color: themeColors.textPrimary
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = themeColors.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = themeColors.cardBackground;
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>
          {data.label}
        </CardTitle>
        <div className="flex items-center gap-2">
          {data.icon && <data.icon className="h-4 w-4" style={{ color: data.color || themeColors.info }} />}
          {getTrendIcon()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold" style={{ color: themeColors.textPrimary }}>
            {data.value}
          </div>
          <Badge 
            variant={data.trend === 'up' ? "secondary" : data.trend === 'down' ? "destructive" : "outline"}
            className="text-xs"
          >
            {data.change}
          </Badge>
        </div>

        {data.target && (
          <div className="text-xs" style={{ color: themeColors.textMuted }}>
            Target: {data.target}
          </div>
        )}

        {showProgress && data.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs" style={{ color: themeColors.textSecondary }}>
              <span>Progress</span>
              <span>{data.progress}%</span>
            </div>
            <Progress 
              value={data.progress} 
              className="h-2"
              style={{
                backgroundColor: themeColors.progressBackground
              }}
            />
          </div>
        )}

        {renderMiniChart()}
      </CardContent>
    </Card>
  );
};

export default AdvancedKPICard;
