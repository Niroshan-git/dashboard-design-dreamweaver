import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Area, AreaChart } from "recharts";
import { CircleDot, TrendingUp, TrendingDown, MoreHorizontal, User, Calendar, DollarSign, Activity, ChevronRight, ChevronDown, Filter, Download, Users, ShoppingCart, Package, Clock } from "lucide-react";

interface MainDashboardProps {
  config: any;
  onExport: (format: string) => void;
}

const MainDashboard = ({ config, onExport }: MainDashboardProps) => {
  const isDarkTheme = config.themeStyle === 'dark';
  const chartColors = config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626'];
  
  const getFinanceData = () => {
    if (config.dashboardType === 'finance') {
      return {
        kpis: [
          { 
            label: 'Total Revenue', 
            value: '$2,847,392', 
            change: '+12.5%', 
            trend: 'up', 
            detail: 'Monthly recurring revenue increased by 12.5% compared to last quarter',
            icon: DollarSign,
            color: 'text-green-600'
          },
          { 
            label: 'Net Profit Margin', 
            value: '18.4%', 
            change: '+2.1%', 
            trend: 'up', 
            detail: 'Profit margin improved due to cost optimization initiatives',
            icon: TrendingUp,
            color: 'text-blue-600'
          },
          { 
            label: 'Operating Expenses', 
            value: '$1,247,238', 
            change: '-5.2%', 
            trend: 'up', 
            detail: 'Reduced operational costs through automation and efficiency improvements',
            icon: Activity,
            color: 'text-purple-600'
          },
          { 
            label: 'Cash Flow', 
            value: '$892,847', 
            change: '+8.7%', 
            trend: 'up', 
            detail: 'Positive cash flow trend with improved collection cycles',
            icon: CircleDot,
            color: 'text-orange-600'
          }
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
        ],
        recentTransactions: [
          { id: 1, description: 'Q4 Sales Commission', amount: '+$45,280', type: 'income', date: '2024-01-15' },
          { id: 2, description: 'Office Rent Payment', amount: '-$8,500', type: 'expense', date: '2024-01-14' },
          { id: 3, description: 'Client Retainer Fee', amount: '+$12,000', type: 'income', date: '2024-01-13' },
          { id: 4, description: 'Software Subscriptions', amount: '-$2,340', type: 'expense', date: '2024-01-12' },
          { id: 5, description: 'Consulting Revenue', amount: '+$8,750', type: 'income', date: '2024-01-11' }
        ],
        performanceMetrics: [
          { name: 'Customer Acquisition Cost', value: '$125', status: 'positive', change: '-8%' },
          { name: 'Customer Lifetime Value', value: '$2,450', status: 'positive', change: '+15%' },
          { name: 'Monthly Churn Rate', value: '2.3%', status: 'negative', change: '+0.5%' },
          { name: 'Average Order Value', value: '$189', status: 'positive', change: '+12%' }
        ]
      };
    }
    return {
      kpis: [
        { 
          label: 'Total Revenue', 
          value: '$2.4M', 
          change: '+12.5%', 
          trend: 'up', 
          detail: 'Overall revenue performance across all channels',
          icon: DollarSign,
          color: 'text-green-600'
        },
        { 
          label: 'Active Users', 
          value: '45.2K', 
          change: '+8.3%', 
          trend: 'up', 
          detail: 'Monthly active users showing consistent growth',
          icon: Users,
          color: 'text-blue-600'
        },
        { 
          label: 'Conversion Rate', 
          value: '3.24%', 
          change: '-2.1%', 
          trend: 'down', 
          detail: 'Conversion rate needs optimization and attention',
          icon: TrendingDown,
          color: 'text-red-600'
        },
        { 
          label: 'Customer Satisfaction', 
          value: '94.2%', 
          change: '+5.7%', 
          trend: 'up', 
          detail: 'High customer satisfaction indicates strong product-market fit',
          icon: User,
          color: 'text-purple-600'
        }
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
      ],
      recentTransactions: [
        { id: 1, description: 'Product Sales', amount: '+$1,280', type: 'income', date: '2024-01-15' },
        { id: 2, description: 'Marketing Expense', amount: '-$500', type: 'expense', date: '2024-01-14' },
        { id: 3, description: 'Service Revenue', amount: '+$750', type: 'income', date: '2024-01-13' }
      ],
      performanceMetrics: [
        { name: 'Bounce Rate', value: '32%', status: 'positive', change: '-5%' },
        { name: 'Session Duration', value: '4m 32s', status: 'positive', change: '+18%' },
        { name: 'Page Views', value: '128K', status: 'positive', change: '+22%' }
      ]
    };
  };

  const mockData = getFinanceData();

  const getThemeColors = () => {
    return {
      background: config.themeStyle === 'dark' ? '#1f2937' : '#ffffff',
      cardBackground: config.themeStyle === 'dark' ? '#374151' : '#f8fafc',
      textPrimary: config.themeStyle === 'dark' ? '#ffffff' : '#1f2937',
      textSecondary: config.themeStyle === 'dark' ? '#d1d5db' : '#6b7280',
      chartColors: config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626']
    };
  };

  const themeColors = getThemeColors();

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
    const IconComponent = kpi.icon;
    
    const cardContent = (
      <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {kpi.label}
          </CardTitle>
          <IconComponent className={`h-4 w-4 ${kpi.color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpi.value}</div>
          <div className="flex items-center pt-1">
            <Badge variant={kpi.trend === 'up' ? "secondary" : "destructive"} className="text-xs">
              {kpi.change}
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">vs last period</span>
          </div>
        </CardContent>
      </Card>
    );

    if (config.tooltipsEnabled) {
      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              {cardContent}
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-sm">{kpi.detail}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return cardContent;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to your {config.dashboardType} dashboard. Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockData.kpis.map((kpi, index) => renderKPICard(kpi, index))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{config.dashboardType === 'finance' ? 'Revenue Trend' : 'Performance Trend'}</span>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              {config.dashboardType === 'finance' 
                ? 'Monthly revenue performance over the last 6 months' 
                : 'Key metrics performance over time'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={config.dashboardType === 'finance' ? 'revenue' : 'value'} 
                  stroke={themeColors.chartColors[0]} 
                  strokeWidth={2}
                  name={config.dashboardType === 'finance' ? 'Revenue' : 'Value'}
                />
                {config.dashboardType === 'finance' && (
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke={themeColors.chartColors[1]} 
                    strokeWidth={2}
                    name="Profit"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {config.dashboardType === 'finance' ? 'Revenue Distribution' : 'Traffic Sources'}
            </CardTitle>
            <CardDescription>
              Breakdown by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent {config.dashboardType === 'finance' ? 'Transactions' : 'Activity'}</CardTitle>
            <CardDescription>
              Latest {config.dashboardType === 'finance' ? 'financial transactions' : 'system activity'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentTransactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Transactions
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.performanceMetrics.map((metric: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.value}</span>
                    <Badge variant={metric.status === 'positive' ? "secondary" : "destructive"} className="text-xs">
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainDashboard;
