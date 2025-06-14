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
    <Card className="shadow-sm">
      <CardHeader>
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
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );

  const SimpleAreaChart = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="pv" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="uv" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  );

  const SimpleBarChart = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );

  const SimplePieChart = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <RechartsPieChart data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))
          }
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
    const layout = getLayoutForPage(currentPage);

    return (
      <div className="grid gap-6" style={{ gridTemplateColumns: layout }}>
        {layout.split(' ').map((colWidth, index) => (
          <div key={index} className={`col-span-${colWidth}`}>
            {index % 2 === 0 ? renderKPICards() : renderCharts()}
          </div>
        ))}
      </div>
    );
  };

  const getLayoutForPage = (pageIndex: number) => {
    switch (pageIndex) {
      case 0: return '1fr 1fr 1fr';
      case 1: return '2fr 1fr';
      case 2: return '1fr 2fr';
      default: return '1fr 1fr';
    }
  };

  const renderKPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} title={kpi.name} value={kpi.value} change={kpi.change} />
      ))}
    </div>
  );

  const renderCharts = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={lineChartData} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleAreaChart data={areaChartData} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={barChartData} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Market Share</CardTitle>
        </CardHeader>
        <CardContent>
          <SimplePieChart data={pieChartData} />
        </CardContent>
      </Card>
    </div>
  );

  const generateChartData = (type: string) => {
    switch (type) {
      case 'line': return lineChartData;
      case 'area': return areaChartData;
      case 'bar': return barChartData;
      case 'pie': return pieChartData;
      default: return lineChartData;
    }
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
