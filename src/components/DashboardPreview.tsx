
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  BarChart3, PieChart, TrendingUp, Users, DollarSign, 
  Activity, Clock, Target, ArrowUpRight, ArrowDownRight,
  Download, FileDown, Image, FileText, Settings, Filter,
  Calendar, MapPin, Zap, Eye, Shield, AlertTriangle
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import DashboardNavigation from "./DashboardNavigation";
import TopNavigation from "./TopNavigation";
import DashboardTopNavigation from "./DashboardTopNavigation";
import { assignChartsToLayout, getVisualsForDashboardType } from "@/utils/chartPlacementLogic";

interface DashboardPreviewProps {
  config: any;
  onExport: (format: string) => void;
}

const DashboardPreview = ({ config, onExport }: DashboardPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Generate different data sets for different pages
  const generatePageData = (pageIndex: number, dashboardType: string) => {
    const baseData = {
      finance: {
        kpis: [
          [
            { name: 'Revenue', value: 560000, change: 0.12, icon: DollarSign },
            { name: 'Profit', value: 125000, change: 0.08, icon: TrendingUp },
            { name: 'Expenses', value: 435000, change: -0.05, icon: Activity },
            { name: 'Cash Flow', value: 89000, change: 0.15, icon: Target },
          ],
          [
            { name: 'ROI', value: 0.22, change: 0.03, icon: Target, format: 'percentage' },
            { name: 'Customers', value: 1200, change: 0.18, icon: Users },
            { name: 'Avg Order', value: 467, change: 0.07, icon: DollarSign },
            { name: 'Retention', value: 0.85, change: 0.02, icon: Shield, format: 'percentage' },
          ],
          [
            { name: 'Risk Score', value: 15, change: -0.12, icon: AlertTriangle },
            { name: 'Compliance', value: 0.98, change: 0.01, icon: Shield, format: 'percentage' },
            { name: 'Transactions', value: 2847, change: 0.25, icon: Activity },
            { name: 'Market Cap', value: 2400000, change: 0.09, icon: TrendingUp },
          ]
        ],
        charts: [
          [
            { name: 'Jan', value: 4000, secondary: 2400, tertiary: 1200 },
            { name: 'Feb', value: 3000, secondary: 1398, tertiary: 1100 },
            { name: 'Mar', value: 2000, secondary: 9800, tertiary: 1500 },
            { name: 'Apr', value: 2780, secondary: 3908, tertiary: 1800 },
            { name: 'May', value: 1890, secondary: 4800, tertiary: 2100 },
            { name: 'Jun', value: 2390, secondary: 3800, tertiary: 1900 },
          ],
          [
            { name: 'Q1', value: 12000, secondary: 8400, tertiary: 6200 },
            { name: 'Q2', value: 15000, secondary: 9800, tertiary: 7100 },
            { name: 'Q3', value: 18000, secondary: 12800, tertiary: 8500 },
            { name: 'Q4', value: 22000, secondary: 15800, tertiary: 9900 },
          ],
          [
            { name: 'North', value: 8000, secondary: 5400 },
            { name: 'South', value: 6500, secondary: 4200 },
            { name: 'East', value: 7200, secondary: 4800 },
            { name: 'West', value: 9100, secondary: 6200 },
            { name: 'Central', value: 5800, secondary: 3900 },
          ]
        ]
      },
      ecommerce: {
        kpis: [
          [
            { name: 'Sales', value: 125000, change: 0.15, icon: DollarSign },
            { name: 'Orders', value: 2847, change: 0.22, icon: Activity },
            { name: 'Customers', value: 1520, change: 0.18, icon: Users },
            { name: 'Conversion', value: 0.034, change: 0.05, icon: Target, format: 'percentage' },
          ],
          [
            { name: 'Cart Value', value: 89, change: 0.12, icon: DollarSign },
            { name: 'Page Views', value: 45200, change: 0.28, icon: Eye },
            { name: 'Bounce Rate', value: 0.32, change: -0.08, icon: ArrowUpRight, format: 'percentage' },
            { name: 'Return Rate', value: 0.05, change: -0.15, icon: ArrowDownRight, format: 'percentage' },
          ],
          [
            { name: 'Inventory', value: 12847, change: 0.02, icon: Activity },
            { name: 'Suppliers', value: 45, change: 0.08, icon: Users },
            { name: 'Shipping', value: 98.5, change: 0.03, icon: MapPin, format: 'percentage' },
            { name: 'Reviews', value: 4.7, change: 0.05, icon: Target },
          ]
        ],
        charts: [
          [
            { name: 'Electronics', value: 15000, secondary: 12000 },
            { name: 'Clothing', value: 12000, secondary: 9500 },
            { name: 'Home', value: 8000, secondary: 6200 },
            { name: 'Books', value: 5000, secondary: 3800 },
            { name: 'Sports', value: 7000, secondary: 5500 },
          ],
          [
            { name: 'Week 1', value: 8000, secondary: 6400 },
            { name: 'Week 2', value: 12000, secondary: 9800 },
            { name: 'Week 3', value: 15000, secondary: 12800 },
            { name: 'Week 4', value: 18000, secondary: 15200 },
          ],
          [
            { name: 'Mobile', value: 45 },
            { name: 'Desktop', value: 35 },
            { name: 'Tablet', value: 20 },
          ]
        ]
      }
    };

    const defaultData = {
      kpis: [
        [
          { name: 'Revenue', value: 560000, change: 0.12, icon: DollarSign },
          { name: 'Users', value: 4500, change: 0.08, icon: Users },
          { name: 'Orders', value: 1200, change: -0.05, icon: Activity },
          { name: 'Growth', value: 0.15, change: 0.03, icon: TrendingUp, format: 'percentage' },
        ],
        [
          { name: 'Engagement', value: 0.68, change: 0.12, icon: Eye, format: 'percentage' },
          { name: 'Retention', value: 0.82, change: 0.05, icon: Shield, format: 'percentage' },
          { name: 'Performance', value: 94, change: 0.08, icon: Zap },
          { name: 'Satisfaction', value: 4.6, change: 0.15, icon: Target },
        ],
        [
          { name: 'Tasks', value: 847, change: 0.22, icon: Activity },
          { name: 'Projects', value: 28, change: 0.18, icon: Target },
          { name: 'Teams', value: 12, change: 0.08, icon: Users },
          { name: 'Efficiency', value: 0.89, change: 0.12, icon: TrendingUp, format: 'percentage' },
        ]
      ],
      charts: [
        [
          { name: 'Jan', value: 4000, secondary: 2400 },
          { name: 'Feb', value: 3000, secondary: 1398 },
          { name: 'Mar', value: 2000, secondary: 9800 },
          { name: 'Apr', value: 2780, secondary: 3908 },
          { name: 'May', value: 1890, secondary: 4800 },
          { name: 'Jun', value: 2390, secondary: 3800 },
        ],
        [
          { name: 'A', value: 4000 },
          { name: 'B', value: 3000 },
          { name: 'C', value: 2000 },
          { name: 'D', value: 2780 },
        ],
        [
          { name: 'Group A', value: 400 },
          { name: 'Group B', value: 300 },
          { name: 'Group C', value: 300 },
          { name: 'Group D', value: 200 },
        ]
      ]
    };

    const selectedData = baseData[dashboardType as keyof typeof baseData] || defaultData;
    return {
      kpis: selectedData.kpis[pageIndex] || selectedData.kpis[0],
      chartData: selectedData.charts[pageIndex] || selectedData.charts[0]
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const formatValue = (value: number, format?: string) => {
    if (format === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const KPICard = ({ kpi, index }: { kpi: any; index: number }) => {
    const IconComponent = kpi.icon;
    return (
      <Card className="shadow-sm h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.name}</CardTitle>
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {formatValue(kpi.value, kpi.format)}
          </div>
          <div className="text-sm text-muted-foreground mt-1 flex items-center">
            {kpi.change > 0 ? (
              <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
            )}
            {Math.abs(kpi.change * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderChart = (type: string, data: any[], height: string = "h-80") => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} />
              {data[0]?.secondary && <Line type="monotone" dataKey="secondary" stroke="#82ca9d" strokeWidth={2} />}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              {data[0]?.secondary && <Area type="monotone" dataKey="secondary" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />}
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={4} />
              {data[0]?.secondary && <Bar dataKey="secondary" fill="#82ca9d" radius={4} />}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <RechartsPieChart data={data} cx="50%" cy="50%" outerRadius="80%" dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RechartsPieChart>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        return <div className="flex items-center justify-center h-full text-muted-foreground">Chart placeholder</div>;
    }
  };

  const getLayoutForComplexity = () => {
    switch (config.complexity) {
      case 'simple':
        return {
          kpiCols: 'grid-cols-2',
          chartCols: 'grid-cols-1 lg:grid-cols-2',
          chartCount: 2,
          showTable: false
        };
      case 'moderate':
        return {
          kpiCols: 'grid-cols-2 lg:grid-cols-3',
          chartCols: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
          chartCount: 4,
          showTable: true
        };
      case 'complex':
        return {
          kpiCols: 'grid-cols-2 lg:grid-cols-4',
          chartCols: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
          chartCount: 6,
          showTable: true
        };
      default:
        return {
          kpiCols: 'grid-cols-2 lg:grid-cols-3',
          chartCols: 'grid-cols-1 lg:grid-cols-2',
          chartCount: 3,
          showTable: false
        };
    }
  };

  const getInteractiveElements = () => {
    if (config.interactivity === 'basic') {
      return null;
    }
    
    return (
      <div className="flex items-center gap-2 mb-6">
        {(config.interactivity === 'advanced' || config.interactivity === 'highly-interactive') && (
          <>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter Data
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </>
        )}
        {config.interactivity === 'highly-interactive' && (
          <>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </>
        )}
      </div>
    );
  };

  const handlePageSelect = (pageIndex: number) => {
    console.log('DashboardPreview - Changing to page:', pageIndex);
    setCurrentPage(pageIndex);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderDashboard = () => {
    const isLeftNav = config.navigationPosition === "left";
    
    if (isLeftNav) {
      return (
        <div className="min-h-screen bg-background flex w-full">
          <DashboardNavigation
            config={config}
            onPageSelect={handlePageSelect}
            currentPage={currentPage}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
          
          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">
                  {config.dashboardType ? 
                    `${config.dashboardType.charAt(0).toUpperCase()}${config.dashboardType.slice(1)} Dashboard` : 
                    'Dashboard'
                  }
                </h1>
                <Badge variant="secondary">
                  Page {currentPage + 1} of {config.pages}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-auto">
              {renderPageContent()}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-background flex flex-col w-full">
          <DashboardTopNavigation
            config={config}
            onPageSelect={handlePageSelect}
            currentPage={currentPage}
            onExport={onExport}
          />
          <div className="flex-1 p-6 overflow-auto">
            {renderPageContent()}
          </div>
        </div>
      );
    }
  };

  const renderPageContent = () => {
    const layout = getLayoutForComplexity();
    const pageData = generatePageData(currentPage, config.dashboardType);
    
    const chartTypes = ['line', 'bar', 'area', 'pie'];
    const pageChartTypes = chartTypes.slice(0, layout.chartCount);

    return (
      <div className="space-y-6">
        {getInteractiveElements()}
        
        {/* KPI Cards */}
        <div className={`grid ${layout.kpiCols} gap-4`}>
          {pageData.kpis.map((kpi, index) => (
            <KPICard key={`${currentPage}-kpi-${index}`} kpi={kpi} index={index} />
          ))}
        </div>

        {/* Charts Section */}
        <div className={`grid ${layout.chartCols} gap-6`}>
          {pageChartTypes.map((chartType, index) => (
            <Card key={`${currentPage}-chart-${index}`} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {chartType === 'line' && `${config.dashboardType === 'finance' ? 'Revenue' : 'Performance'} Trend`}
                  {chartType === 'bar' && `${config.dashboardType === 'ecommerce' ? 'Category' : 'Department'} Analysis`}
                  {chartType === 'area' && `${config.dashboardType === 'finance' ? 'Quarterly' : 'Weekly'} Overview`}
                  {chartType === 'pie' && `${config.dashboardType === 'ecommerce' ? 'Traffic Sources' : 'Distribution'}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 h-80">
                {renderChart(chartType, pageData.chartData)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Table for Complex/Moderate dashboards */}
        {layout.showTable && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Detailed Analytics - Page {currentPage + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Metric</th>
                      <th className="text-left p-3">Current</th>
                      <th className="text-left p-3">Previous</th>
                      <th className="text-left p-3">Change</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.kpis.slice(0, 3).map((kpi, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{kpi.name}</td>
                        <td className="p-3">{formatValue(kpi.value, kpi.format)}</td>
                        <td className="p-3">{formatValue(kpi.value * (1 - kpi.change), kpi.format)}</td>
                        <td className={`p-3 ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.change > 0 ? '+' : ''}{(kpi.change * 100).toFixed(1)}%
                        </td>
                        <td className="p-3">
                          <Badge variant={kpi.change > 0 ? "secondary" : "destructive"}>
                            {kpi.change > 0.1 ? 'Excellent' : kpi.change > 0 ? 'Good' : 'Needs Attention'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Dashboard Preview
          </CardTitle>
          <div className="flex gap-2">
            {config.exportFormats?.map((format: string) => (
              <Button
                key={format}
                variant="outline"
                size="sm"
                onClick={() => onExport(format)}
                className="flex items-center gap-2"
              >
                {format === 'figma' && <Image className="w-4 h-4" />}
                {format === 'powerbi' && <BarChart3 className="w-4 h-4" />}
                {format === 'json' && <FileText className="w-4 h-4" />}
                {format === 'png' && <FileDown className="w-4 h-4" />}
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          className="border rounded-lg overflow-hidden bg-background"
          style={{
            aspectRatio: config.layoutDimension || '16/9',
            minHeight: '600px'
          }}
        >
          {renderDashboard()}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPreview;
