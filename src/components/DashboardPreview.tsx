
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  BarChart3, PieChart, TrendingUp, Users, DollarSign, 
  Activity, Clock, Target, ArrowUpRight, ArrowDownRight,
  Download, FileDown, Image, FileText, Settings
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import DashboardNavigation from "./DashboardNavigation";
import TopNavigation from "./TopNavigation";
import DashboardTopNavigation from "./DashboardTopNavigation";

interface DashboardPreviewProps {
  config: any;
  onExport: (format: string) => void;
}

const DashboardPreview = ({ config, onExport }: DashboardPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const kpiData = [
    { name: 'Revenue', value: 560000, change: 0.12 },
    { name: 'Orders', value: 4500, change: -0.05 },
    { name: 'Customers', value: 1200, change: 0.08 },
    { name: 'Retention', value: 0.85, change: 0.03 },
  ];

  const lineChartData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ];

  const areaChartData = [
    { name: 'Week 1', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Week 2', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Week 3', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Week 4', uv: 2780, pv: 3908, amt: 2000 },
  ];

  const barChartData = [
    { name: 'Category A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Category B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Category C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Category D', uv: 2780, pv: 3908, amt: 2000 },
  ];

  const pieChartData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const KPICard = ({ title, value, change }: { title: string; value: number; change: number }) => (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center">
          {change > 0 ? (
            <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
          )}
          {Math.abs(change * 100).toFixed(1)}%
        </div>
      </CardContent>
    </Card>
  );

  const SimpleLineChart = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );

  const SimpleAreaChart = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="pv" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Area type="monotone" dataKey="uv" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  );

  const SimpleBarChart = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="pv" fill="#8884d8" radius={4} />
        <Bar dataKey="uv" fill="#82ca9d" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  );

  const SimplePieChart = ({ data }: { data: any[] }) => (
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

  const handlePageSelect = (pageIndex: number) => {
    console.log('DashboardPreview - Changing to page:', pageIndex);
    setCurrentPage(pageIndex);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getChartHeight = () => {
    switch (config.layoutDimension) {
      case '4:3': return 'h-80';
      case '1:1': return 'h-72';
      case '21:9': return 'h-96';
      default: return 'h-80'; // 16:9
    }
  };

  const getGridLayout = () => {
    const isComplex = config.complexity === 'complex';
    const isModerate = config.complexity === 'moderate';
    
    switch (config.layoutDimension) {
      case '4:3':
        return isComplex ? 'grid-cols-3 gap-4' : 'grid-cols-2 gap-4';
      case '1:1':
        return 'grid-cols-2 gap-3';
      case '21:9':
        return isComplex ? 'grid-cols-4 gap-6' : 'grid-cols-3 gap-4';
      default: // 16:9
        return isComplex ? 'grid-cols-3 gap-4' : isModerate ? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-4';
    }
  };

  const renderDashboard = () => {
    const isLeftNav = config.navigationPosition === "left";
    
    if (isLeftNav) {
      return (
        <div className="min-h-screen bg-background flex w-full">
          {/* Left Sidebar Navigation */}
          <DashboardNavigation
            config={config}
            onPageSelect={handlePageSelect}
            currentPage={currentPage}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header for Left Nav */}
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
            
            {/* Dashboard Content */}
            <div className="flex-1 p-6 overflow-auto">
              {renderPageContent()}
            </div>
          </div>
        </div>
      );
    } else {
      // Top Navigation Layout
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
    const chartHeight = getChartHeight();
    const gridLayout = getGridLayout();

    return (
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <div className={`grid ${gridLayout}`}>
          {kpiData.slice(0, config.complexity === 'simple' ? 2 : config.complexity === 'moderate' ? 3 : 4).map((kpi, index) => (
            <KPICard key={index} title={kpi.name} value={kpi.value} change={kpi.change} />
          ))}
        </div>

        {/* Charts Section */}
        <div className={`grid ${gridLayout}`}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className={`p-4 ${chartHeight}`}>
              <SimpleLineChart data={lineChartData} />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent className={`p-4 ${chartHeight}`}>
              <SimpleAreaChart data={areaChartData} />
            </CardContent>
          </Card>

          {(config.complexity === 'moderate' || config.complexity === 'complex') && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Category Performance</CardTitle>
              </CardHeader>
              <CardContent className={`p-4 ${chartHeight}`}>
                <SimpleBarChart data={barChartData} />
              </CardContent>
            </Card>
          )}

          {config.complexity === 'complex' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Market Share</CardTitle>
              </CardHeader>
              <CardContent className={`p-4 ${chartHeight}`}>
                <SimplePieChart data={pieChartData} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Data Table for Complex dashboards */}
        {config.complexity === 'complex' && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Metric</th>
                      <th className="text-left p-2">Current</th>
                      <th className="text-left p-2">Previous</th>
                      <th className="text-left p-2">Change</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Revenue</td>
                      <td className="p-2">$2.8M</td>
                      <td className="p-2">$2.4M</td>
                      <td className="p-2 text-green-600">+16.7%</td>
                      <td className="p-2">
                        <Badge variant="secondary">Good</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Users</td>
                      <td className="p-2">45.2K</td>
                      <td className="p-2">42.1K</td>
                      <td className="p-2 text-green-600">+7.4%</td>
                      <td className="p-2">
                        <Badge variant="default">Excellent</Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Conversion</td>
                      <td className="p-2">3.24%</td>
                      <td className="p-2">3.31%</td>
                      <td className="p-2 text-red-600">-2.1%</td>
                      <td className="p-2">
                        <Badge variant="outline">Fair</Badge>
                      </td>
                    </tr>
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
