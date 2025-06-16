import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, BarChart3, TrendingUp, Calendar, Users, Settings, 
  Search, Bell, ChevronDown, User, CircleDot, Layers, Filter, Download
} from "lucide-react";
import { advancedThemes } from "@/utils/advancedThemeSystem";

interface DashboardTopNavigationProps {
  config: any;
  onPageSelect: (page: number) => void;
  currentPage: number;
  onExport: (format: string) => void;
  style?: string;
}

const DashboardTopNavigation = ({ 
  config, 
  onPageSelect,
  currentPage,
  onExport,
  style = 'top-wide'
}: DashboardTopNavigationProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // Get theme colors
  const currentTheme = advancedThemes[config.themeStyle] || advancedThemes.minimal;
  
  const getIconForDashboardType = (type: string) => {
    switch(type) {
      case "finance": return <TrendingUp size={18} />;
      case "ecommerce": return <Users size={18} />;
      case "logistics": return <BarChart3 size={18} />;
      case "sales": return <BarChart3 size={18} />;
      case "executive": return <LayoutDashboard size={18} />;
      case "healthcare": return <BarChart3 size={18} />;
      default: return <Layers size={18} />;
    }
  };
  
  const pages = Array.from({ length: config.pages || 3 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? "Overview" : i === 1 ? "Analytics" : `Reports ${i - 1}`,
    icon: i === 0 ? <LayoutDashboard size={16} /> : <CircleDot size={16} />,
    description: i === 0 ? "Main dashboard view" : i === 1 ? "Detailed analytics" : `Report section ${i - 1}`
  }));

  const handlePageSelect = (pageIndex: number) => {
    console.log('DashboardTopNavigation - Page selected:', pageIndex);
    onPageSelect(pageIndex);
  };

  // Render different styles based on the selected navigation style
  const renderTopWideStyle = () => (
    <div 
      className="border-b"
      style={{ 
        backgroundColor: currentTheme.navigationBackground,
        borderColor: currentTheme.navigationBorder
      }}
    >
      {/* Main Navigation Bar */}
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${currentTheme.info}20` }}
            >
              <div style={{ color: currentTheme.info }}>
                {getIconForDashboardType(config.dashboardType)}
              </div>
            </div>
            <div>
              <h1 
                className="font-semibold text-lg"
                style={{ color: currentTheme.navigationText }}
              >
                {config.dashboardType 
                  ? config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1) + " Dashboard"
                  : "Business Dashboard"}
              </h1>
              <p 
                className="text-xs"
                style={{ color: currentTheme.navigationTextSecondary }}
              >
                Real-time insights and analytics
              </p>
            </div>
          </div>
          
          <Separator 
            orientation="vertical" 
            className="h-8" 
            style={{ backgroundColor: currentTheme.navigationBorder }}
          />
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 transition-all duration-200"
              style={{ 
                borderColor: currentTheme.navigationBorder,
                color: currentTheme.navigationText,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.navigationHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 transition-all duration-200" 
              onClick={() => onExport('pdf')}
              style={{ 
                borderColor: currentTheme.navigationBorder,
                color: currentTheme.navigationText,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.navigationHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {showSearch ? (
            <div className="relative">
              <Search 
                className="absolute left-3 top-2.5 h-4 w-4"
                style={{ color: currentTheme.navigationTextSecondary }}
              />
              <Input
                placeholder="Search dashboards..."
                className="pl-9 w-64 h-9 border-0"
                style={{ 
                  backgroundColor: `${currentTheme.surface}40`,
                  color: currentTheme.navigationText
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onBlur={() => !searchTerm && setShowSearch(false)}
              />
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSearch(true)}
              style={{ color: currentTheme.navigationText }}
              className="transition-colors duration-200"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Search size={16} />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative transition-colors duration-200"
            style={{ color: currentTheme.navigationText }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={16} />
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: currentTheme.negative }}
            ></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 h-9 transition-colors duration-200"
                style={{ color: currentTheme.navigationText }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <span className="text-sm">John Doe</span>
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56"
              style={{ 
                backgroundColor: currentTheme.navigationBackground,
                borderColor: currentTheme.navigationBorder
              }}
            >
              <DropdownMenuLabel style={{ color: currentTheme.navigationText }}>
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator style={{ backgroundColor: currentTheme.navigationBorder }} />
              <DropdownMenuItem 
                style={{ color: currentTheme.navigationText }}
                className="transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <User size={14} className="mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                style={{ color: currentTheme.navigationText }}
                className="transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings size={14} className="mr-2" />
                Dashboard Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: currentTheme.navigationBorder }} />
              <DropdownMenuItem 
                style={{ color: currentTheme.navigationText }}
                className="transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div 
        className="h-12 border-t"
        style={{ 
          backgroundColor: `${currentTheme.surface}30`,
          borderColor: currentTheme.navigationBorder
        }}
      >
        <div className="px-6 h-full flex items-center justify-between">
          <nav className="flex items-center space-x-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageSelect(page.id - 1)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: currentPage === page.id - 1 ? currentTheme.navigationActive : 'transparent',
                  color: currentPage === page.id - 1 ? currentTheme.navigationText : currentTheme.navigationTextSecondary,
                  borderColor: currentPage === page.id - 1 ? currentTheme.navigationBorder : 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.navigationHover;
                  e.currentTarget.style.color = currentTheme.navigationText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentPage === page.id - 1 ? currentTheme.navigationActive : 'transparent';
                  e.currentTarget.style.color = currentPage === page.id - 1 ? currentTheme.navigationText : currentTheme.navigationTextSecondary;
                }}
              >
                <span>{page.icon}</span>
                <span>{page.name}</span>
                {currentPage === page.id - 1 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs h-5"
                    style={{ 
                      backgroundColor: currentTheme.info,
                      color: currentTheme.navigationBackground
                    }}
                  >
                    Active
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          
          <div 
            className="flex items-center space-x-2 text-xs"
            style={{ color: currentTheme.navigationTextSecondary }}
          >
            <span>Page {currentPage + 1} of {pages.length}</span>
            <Separator 
              orientation="vertical" 
              className="h-4" 
              style={{ backgroundColor: currentTheme.navigationBorder }}
            />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTopTabsStyle = () => (
    <div className="bg-background border-b border-border">
      <div className="h-16 flex items-center justify-between px-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {getIconForDashboardType(config.dashboardType)}
          </div>
          <h1 className="font-semibold text-lg">
            {config.dashboardType 
              ? config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1) + " Dashboard" 
              : "Business Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)}>
            <Search size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Dashboard Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={currentPage.toString()} onValueChange={(value) => handlePageSelect(parseInt(value))}>
        <TabsList className="h-12 w-full justify-start rounded-none bg-muted/30 border-0">
          {pages.map((page) => (
            <TabsTrigger
              key={page.id}
              value={(page.id - 1).toString()}
              className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <span>{page.icon}</span>
              <span>{page.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );

  const renderTopMinimalStyle = () => (
    <div className="bg-background border-b border-border">
      <div className="h-14 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="font-medium text-base">
              {config.dashboardType 
                ? config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1) 
                : "Dashboard"}
            </h1>
          </div>
          
          <nav className="flex items-center space-x-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageSelect(page.id - 1)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  currentPage === page.id - 1
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {page.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onExport('pdf')}>
            <Download className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  // Render based on style prop
  switch (style) {
    case 'top-tabs':
      return renderTopTabsStyle();
    case 'top-minimal': 
      return renderTopMinimalStyle();
    case 'top-wide':
    default:
      return renderTopWideStyle();
  }
};

export default DashboardTopNavigation;
