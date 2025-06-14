import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from "recharts";
import { CircleDot, TrendingUp, TrendingDown, MoreHorizontal, User, Calendar, DollarSign, Activity, ChevronRight, ChevronDown, Filter, Download, Users, ShoppingCart, Package, Clock } from "lucide-react";

interface MainDashboardProps {
  config: any;
  onExport: (format: string) => void;
}

const MainDashboard = ({ config, onExport }: MainDashboardProps) => {
  const isDarkTheme = config.themeStyle === 'dark';
  const chartColors = config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626'];
  
  const getDataForDashboardType = () => {
    if (config.dashboardType === 'finance') {
      return {
        summary: {
          revenue: { value: '$2,847,392', change: '+12.5%', trend: 'up' },
          profit: { value: '$892,847', change: '+8.7%', trend: 'up' },
          expenses: { value: '$1,247,238', change: '-5.2%', trend: 'up' },
          customers: { value: '8,942', change: '+15.3%', trend: 'up' }
        },
        timeData: [
          { name: 'Jan', revenue: 2400000, expenses: 1800000, profit: 600000 },
          { name: 'Feb', revenue: 2200000, expenses: 1700000, profit: 500000 },
          { name: 'Mar', revenue: 2800000, expenses: 1900000, profit: 900000 },
          { name: 'Apr', revenue: 2600000, expenses: 1750000, profit: 850000 },
          { name: 'May', revenue: 3200000, expenses: 2100000, profit: 1100000 },
          { name: 'Jun', revenue: 2900000, expenses: 1950000, profit: 950000 }
        ],
        distributionData: [
          { name: 'Product Sales', value: 45, color: chartColors[0] },
          { name: 'Services', value: 30, color: chartColors[1] },
          { name: 'Subscriptions', value: 20, color: chartColors[2] },
          { name: 'Other', value: 5, color: chartColors[3] }
        ],
        metricRows: [
          { name: 'Operating Expenses', value: '$1,247,238', change: '-5.2%', status: 'positive' },
          { name: 'Net Profit Margin', value: '18.4%', change: '+2.1%', status: 'positive' },
          { name: 'Cash Flow', value: '$892,847', change: '+8.7%', status: 'positive' },
          { name: 'Average Order Value', value: '$942', change: '+4.3%', status: 'positive' }
        ]
      };
    } else if (config.dashboardType === 'ecommerce') {
      return {
        summary: {
          revenue: { value: '$584,246', change: '+8.2%', trend: 'up' },
          profit: { value: '$172,391', change: '+12.1%', trend: 'up' },
          expenses: { value: '$231,578', change: '+3.4%', trend: 'up' },
          customers: { value: '14,827', change: '+24.6%', trend: 'up' }
        },
        timeData: [
          { name: 'Jan', sales: 890, orders: 432, visitors: 12400 },
          { name: 'Feb', sales: 782, orders: 387, visitors: 10900 },
          { name: 'Mar', sales: 1290, orders: 598, visitors: 17800 },
          { name: 'Apr', sales: 1430, orders: 649, visitors: 19200 },
          { name: 'May', sales: 1580, orders: 701, visitors: 21400 },
          { name: 'Jun', sales: 1420, orders: 653, visitors: 18900 }
        ],
        distributionData: [
          { name: 'Electronics', value: 35, color: chartColors[0] },
          { name: 'Clothing', value: 25, color: chartColors[1] },
          { name: 'Home Goods', value: 20, color: chartColors[2] },
          { name: 'Other', value: 20, color: chartColors[3] }
        ],
        metricRows: [
          { name: 'Conversion Rate', value: '3.8%', change: '+0.7%', status: 'positive' },
          { name: 'Avg. Session Duration', value: '4:32', change: '+0:18', status: 'positive' },
          { name: 'Cart Abandonment', value: '21.4%', change: '-2.3%', status: 'positive' },
          { name: 'Return Rate', value: '3.2%', change: '-0.5%', status: 'positive' }
        ]
      };
    } else {
      // Default data for other dashboard types
      return {
        summary: {
          revenue: { value: '$847,392', change: '+10.5%', trend: 'up' },
          profit: { value: '$192,847', change: '+7.7%', trend: 'up' },
          expenses: { value: '$347,238', change: '+2.2%', trend: 'up' },
          customers: { value: '2,942', change: '+9.3%', trend: 'up' }
        },
        timeData: [
          { name: 'Jan', value: 4000, users: 2400 },
          { name: 'Feb', value: 3000, users: 1398 },
          { name: 'Mar', value: 2000, users: 9800 },
          { name: 'Apr', value: 2780, users: 3908 },
          { name: 'May', value: 1890, users: 4800 },
          { name: 'Jun', value: 2390, users: 3800 }
        ],
        distributionData: [
          { name: 'Category A', value: 45, color: chartColors[0] },
          { name: 'Category B', value: 35, color: chartColors[1] },
          { name: 'Category C', value: 20, color: chartColors[2] }
        ],
        metricRows: [
          { name: 'Metric 1', value: '45.2%', change: '+5.7%', status: 'positive' },
          { name: 'Metric 2', value: '12,847', change: '+832', status: 'positive' },
          { name: 'Metric 3', value: '3.8', change: '+0.4', status: 'positive' },
          { name: 'Metric 4', value: '98.3%', change: '+1.2%', status: 'positive' }
        ]
      };
    }
  };

  const data = getDataForDashboardType();
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' 
                ? entry.value.toLocaleString(undefined, {
                    style: config.dashboardType === 'finance' ? 'currency' : 'decimal',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {config.dashboardType 
              ? `${config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1)} Dashboard` 
              : "Dashboard Overview"}
          </h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar size={14} />
            <span>Last 30 Days</span>
            <ChevronDown size={14} />
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => onExport('png')}>
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: chartColors[0] }}>
              {data.summary.revenue.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.summary.revenue.trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span className={data.summary.revenue.trend === 'up' ? "text-emerald-500" : "text-rose-500"}>
                {data.summary.revenue.change}
              </span>
              <span className="ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: chartColors[1] }}>
              {data.summary.expenses.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.summary.expenses.trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span className={data.summary.expenses.trend === 'up' ? "text-emerald-500" : "text-rose-500"}>
                {data.summary.expenses.change}
              </span>
              <span className="ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: chartColors[2] }}>
              {data.summary.profit.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.summary.profit.trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span className={data.summary.profit.trend === 'up' ? "text-emerald-500" : "text-rose-500"}>
                {data.summary.profit.change}
              </span>
              <span className="ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: chartColors[3] || chartColors[0] }}>
              {data.summary.customers.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.summary.customers.trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span className={data.summary.customers.trend === 'up' ? "text-emerald-500" : "text-rose-500"}>
                {data.summary.customers.change}
              </span>
              <span className="ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>{config.dashboardType === 'finance' ? 'Financial Performance' : 'Performance Trends'}</CardTitle>
              <CardDescription>
                {config.dashboardType === 'finance' 
                  ? 'Revenue, expenses and profit over time' 
                  : 'Key metrics over time'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {config.dashboardType === 'finance' ? (
                <AreaChart data={data.timeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#374151" : "#f1f5f9"} />
                  <XAxis dataKey="name" stroke={isDarkTheme ? "#9ca3af" : "#64748b"} />
                  <YAxis 
                    stroke={isDarkTheme ? "#9ca3af" : "#64748b"}
                    tickFormatter={(value) => 
                      value >= 1000000 
                        ? `$${(value / 1000000).toFixed(1)}M` 
                        : `$${(value / 1000).toFixed(0)}K`
                    } 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke={chartColors[0]} 
                    fill={`${chartColors[0]}40`} 
                    activeDot={{ r: 6 }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    name="Expenses" 
                    stroke={chartColors[1]} 
                    fill={`${chartColors[1]}30`} 
                    activeDot={{ r: 6 }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit" 
                    stroke={chartColors[2]} 
                    fill={`${chartColors[2]}30`} 
                    activeDot={{ r: 6 }} 
                  />
                </AreaChart>
              ) : config.dashboardType === 'ecommerce' ? (
                <LineChart data={data.timeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#374151" : "#f1f5f9"} />
                  <XAxis dataKey="name" stroke={isDarkTheme ? "#9ca3af" : "#64748b"} />
                  <YAxis stroke={isDarkTheme ? "#9ca3af" : "#64748b"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name="Sales" stroke={chartColors[0]} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="orders" name="Orders" stroke={chartColors[1]} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="visitors" name="Visitors" stroke={chartColors[2]} activeDot={{ r: 6 }} />
                </LineChart>
              ) : (
                <BarChart data={data.timeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkTheme ? "#374151" : "#f1f5f9"} />
                  <XAxis dataKey="name" stroke={isDarkTheme ? "#9ca3af" : "#64748b"} />
                  <YAxis stroke={isDarkTheme ? "#9ca3af" : "#64748b"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Value" fill={chartColors[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="users" name="Users" fill={chartColors[1]} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Distribution/Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{config.dashboardType === 'finance' ? 'Revenue Distribution' : 'Distribution'}</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data.distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  align="center" 
                  verticalAlign="bottom" 
                  layout="horizontal"
                  formatter={(value, entry, index) => {
                    return <span style={{ color: isDarkTheme ? "#e5e7eb" : "#1f2937" }}>{value}</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {config.dashboardType === 'finance' 
                ? 'Key Financial Metrics' 
                : config.dashboardType === 'ecommerce'
                ? 'E-commerce Performance'
                : 'Key Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.metricRows.map((metric, i) => (
                <div key={i} className="flex items-center justify-between border-b py-2 last:border-0">
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
          <CardFooter>
            <Button variant="ghost" size="sm" className="ml-auto flex items-center gap-1">
              <span>View Details</span>
              <ChevronRight size={14} />
            </Button>
          </CardFooter>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {config.dashboardType === 'finance' ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <DollarSign size={14} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Large transaction detected</p>
                      <p className="text-xs text-muted-foreground">Payment of $24,500 received from Client #3281</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/10 rounded-full p-2">
                      <Activity size={14} className="text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Expense report approved</p>
                      <p className="text-xs text-muted-foreground">Q2 Marketing expenses approved by Finance</p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>
                </>
              ) : config.dashboardType === 'ecommerce' ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <ShoppingCart size={14} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New order received</p>
                      <p className="text-xs text-muted-foreground">Order #38291 - $342.00 from Customer Jane</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/10 rounded-full p-2">
                      <Package size={14} className="text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order shipped</p>
                      <p className="text-xs text-muted-foreground">Order #38124 shipped via Express Delivery</p>
                      <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <User size={14} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">User ID #1283 created an account</p>
                      <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/10 rounded-full p-2">
                      <Clock size={14} className="text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System update completed</p>
                      <p className="text-xs text-muted-foreground">Database maintenance finished successfully</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>
                </>
              )}
              
              <Button variant="outline" className="w-full text-sm h-8">View All Activity</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainDashboard;
