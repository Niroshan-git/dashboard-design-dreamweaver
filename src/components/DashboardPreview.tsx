
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Tablet, Smartphone, Download, Eye, Settings, Palette } from "lucide-react";
import MainDashboard from "./MainDashboard";
import DashboardNavigation from "./DashboardNavigation";
import DashboardTopNavigation from "./DashboardTopNavigation";
import SmartPageNavigation from "./SmartPageNavigation";

interface DashboardPreviewProps {
  config: any;
  onExport: (format: string) => void;
}

const DashboardPreview = ({ config, onExport }: DashboardPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [deviceView, setDeviceView] = useState("desktop");
  const [collapsed, setCollapsed] = useState(false);

  console.log('DashboardPreview - Current page:', currentPage);
  console.log('DashboardPreview - Config layouts:', config.layouts);
  console.log('DashboardPreview - Navigation style:', config.navigationStyle);

  const getDeviceClasses = () => {
    switch (deviceView) {
      case "tablet":
        return "max-w-3xl mx-auto";
      case "mobile":
        return "max-w-sm mx-auto";
      default:
        return "w-full";
    }
  };

  const handlePageChange = (pageIndex: number) => {
    console.log('DashboardPreview - Page changed to:', pageIndex);
    setCurrentPage(pageIndex);
  };

  const getNavigationComponent = () => {
    // Use the navigationStyle from config, fallback to 'left-full'
    const navStyle = config.navigationStyle || 'left-full';
    console.log('DashboardPreview - Using navigation style:', navStyle);
    
    switch (navStyle) {
      case 'left-full':
      case 'left-collapsible':
        return (
          <DashboardNavigation 
            config={config} 
            currentPage={currentPage} 
            onPageSelect={handlePageChange}
            collapsed={navStyle === 'left-collapsible' ? collapsed : false}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        );
      case 'top-wide':
      case 'top-tabs':
      case 'top-minimal':
        return (
          <DashboardTopNavigation 
            config={config} 
            currentPage={currentPage} 
            onPageSelect={handlePageChange}
            onExport={onExport}
            style={navStyle}
          />
        );
      default:
        return (
          <DashboardNavigation 
            config={config} 
            currentPage={currentPage} 
            onPageSelect={handlePageChange}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        );
    }
  };

  const isLeftNavigation = () => {
    const navStyle = config.navigationStyle || 'left-full';
    return navStyle.startsWith('left-');
  };

  const isTopNavigation = () => {
    const navStyle = config.navigationStyle || 'left-full';
    return navStyle.startsWith('top-');
  };

  const hasValidLayouts = config.layouts && config.layouts.length > 0;

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Dashboard Preview
          </CardTitle>
          <CardDescription>
            Preview your dashboard across different devices and export when ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Preview Toggle */}
          <div className="flex items-center gap-4">
            <Label>Device View:</Label>
            <div className="flex gap-2">
              {[
                { value: "desktop", icon: Monitor, label: "Desktop" },
                { value: "tablet", icon: Tablet, label: "Tablet" },
                { value: "mobile", icon: Smartphone, label: "Mobile" }
              ].map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={deviceView === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDeviceView(value)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Page Navigation for Preview */}
          <div className="flex items-center gap-4">
            <Label>Current Page:</Label>
            <div className="flex gap-2">
              {Array.from({ length: config.pages || 1 }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i)}
                >
                  Page {i + 1}
                  {config.layouts && config.layouts[i]?.components.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {config.layouts[i].components.length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Style Display */}
          <div className="flex items-center gap-4">
            <Label>Active Navigation:</Label>
            <Badge variant="outline" className="capitalize">
              {config.navigationStyle?.replace('-', ' ') || 'Left Full'}
            </Badge>
          </div>

          {/* Export Options */}
          <div className="flex items-center gap-4">
            <Label>Export as:</Label>
            <div className="flex gap-2">
              {config.exportFormats?.map((format: string) => (
                <Button
                  key={format}
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(format)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {!hasValidLayouts && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> No layouts configured yet. Go to the Layout tab to design your dashboard pages.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Preview */}
      <div className={`transition-all duration-300 ${getDeviceClasses()}`}>
        <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
          {hasValidLayouts ? (
            <div className="flex min-h-screen">
              {/* Left Navigation */}
              {isLeftNavigation() && (
                <div className="flex-shrink-0">
                  {getNavigationComponent()}
                </div>
              )}
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* Top Navigation */}
                {isTopNavigation() && (
                  <div className="flex-shrink-0">
                    {getNavigationComponent()}
                  </div>
                )}
                
                {/* Dashboard Content */}
                <div className="flex-1">
                  <MainDashboard 
                    config={config} 
                    currentPage={currentPage}
                    onExport={onExport} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Layout Configured</h3>
                <p className="text-gray-600 mb-4">Create your dashboard layout to see the preview</p>
                <Badge variant="outline">Go to Layout Tab</Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layout Summary */}
      {hasValidLayouts && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Pages:</span> {config.pages}
              </div>
              <div>
                <span className="font-medium">Visuals:</span> {config.visuals?.length || 0}
              </div>
              <div>
                <span className="font-medium">Navigation:</span> {config.navigationStyle?.replace('-', ' ') || 'Left Full'}
              </div>
              <div>
                <span className="font-medium">Theme:</span> {config.themeStyle || 'Minimal'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPreview;
