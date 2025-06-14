
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
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, BarChart3, TrendingUp, Calendar, Users, Settings, 
  Search, Bell, ChevronDown, User, CircleDot, Layers, Filter, Download
} from "lucide-react";

interface DashboardTopNavigationProps {
  config: any;
  onPageSelect: (page: number) => void;
  currentPage: number;
  onExport: (format: string) => void;
}

const DashboardTopNavigation = ({ 
  config, 
  onPageSelect,
  currentPage,
  onExport
}: DashboardTopNavigationProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
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

  return (
    <div className="bg-background border-b border-border">
      {/* Main Navigation Bar */}
      <div className="h-16 flex items-center justify-between px-6">
        {/* Left Section - Brand and Quick Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getIconForDashboardType(config.dashboardType)}
            </div>
            <div>
              <h1 className="font-semibold text-lg">
                {config.dashboardType 
                  ? config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1) + " Dashboard" 
                  : "Business Dashboard"}
              </h1>
              <p className="text-xs text-muted-foreground">Real-time insights and analytics</p>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-8" />
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => onExport('pdf')}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Right Section - Search and User Menu */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          {showSearch ? (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dashboards..."
                className="pl-9 w-64 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onBlur={() => !searchTerm && setShowSearch(false)}
              />
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(true)}>
              <Search size={16} />
            </Button>
          )}
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <span className="text-sm">John Doe</span>
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User size={14} className="mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings size={14} className="mr-2" />
                Dashboard Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Secondary Navigation - Pages */}
      <div className="h-12 bg-muted/30 border-t border-border">
        <div className="px-6 h-full flex items-center justify-between">
          <nav className="flex items-center space-x-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => onPageSelect(page.id - 1)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  "hover:bg-background hover:shadow-sm",
                  currentPage + 1 === page.id 
                    ? "bg-background text-foreground shadow-sm border border-border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{page.icon}</span>
                <span>{page.name}</span>
                {currentPage + 1 === page.id && (
                  <Badge variant="secondary" className="text-xs h-5">
                    Active
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          
          {/* Page Info */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Page {currentPage + 1} of {pages.length}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopNavigation;
