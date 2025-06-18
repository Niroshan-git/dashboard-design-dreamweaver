
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
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, BarChart3, TrendingUp, Calendar, Users, Settings, 
  Search, Bell, ChevronDown, User, CircleDot, Layers, Filter 
} from "lucide-react";
import { getNavigationThemeDefaults, filterLayouts } from "@/utils/advancedThemeSystem";

interface TopNavigationProps {
  config: any;
  onPageSelect: (page: number) => void;
  currentPage: number;
  title: string;
  onFilterToggle?: () => void;
}

const TopNavigation = ({ 
  config, 
  onPageSelect,
  currentPage,
  title,
  onFilterToggle
}: TopNavigationProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // Get proper navigation theme based on navigation style
  const navigationTheme = config.navigationStyle ? 
    getNavigationThemeDefaults(config.navigationStyle, config.currentTheme || {}) : 
    config.currentTheme || {};
  
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
  
  const pages = Array.from({ length: config.pages || 1 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? "Main Dashboard" : `Page ${i + 1}`,
    icon: i === 0 ? <LayoutDashboard size={18} /> : <CircleDot size={18} />,
  }));

  const handlePageSelect = (pageIndex: number) => {
    console.log('TopNavigation - Page selected:', pageIndex);
    onPageSelect(pageIndex);
  };

  // Show dropdown when there are more than 4 pages
  const showPageDropdown = pages.length > 4;

  // Get current filter layout name
  const selectedFilterLayout = config.selectedFilterLayout;
  const filterLayoutName = selectedFilterLayout ? 
    filterLayouts.find(l => l.id === selectedFilterLayout)?.name || 'Filters' : 
    'Filters';

  const navigationStyle = {
    backgroundColor: navigationTheme.navigationBackground || '#ffffff',
    borderBottomColor: navigationTheme.navigationBorder || '#e2e8f0',
    color: navigationTheme.navigationText || '#0f172a'
  };

  const buttonStyle = {
    backgroundColor: navigationTheme.buttonPrimary || '#3b82f6',
    color: '#ffffff'
  };

  const hoverStyle = {
    backgroundColor: navigationTheme.navigationHover || '#f1f5f9'
  };

  const activeStyle = {
    backgroundColor: navigationTheme.navigationActive || '#e2e8f0',
    color: navigationTheme.navigationText || '#0f172a'
  };

  return (
    <div 
      className="h-16 border-b flex items-center justify-between px-6"
      style={navigationStyle}
    >
      {/* Left Section - Brand and Navigation */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6" style={{ color: navigationTheme.buttonPrimary || '#3b82f6' }} />
          <h3 
            className="font-semibold text-lg"
            style={{ color: navigationTheme.navigationText || '#0f172a' }}
          >
            {config.dashboardType 
              ? config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1) + " Dashboard" 
              : "Dashboard"}
          </h3>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Page Navigation */}
        <nav className="flex items-center space-x-1">
          {showPageDropdown ? (
            <div className="flex items-center space-x-2">
              <span 
                className="text-sm"
                style={{ color: navigationTheme.navigationTextSecondary || '#64748b' }}
              >
                Page:
              </span>
              <Select 
                value={currentPage.toString()} 
                onValueChange={(value) => handlePageSelect(parseInt(value))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={(page.id - 1).toString()}>
                      <div className="flex items-center space-x-2">
                        <span>{page.icon}</span>
                        <span>{page.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="text-xs">
                {currentPage + 1} of {pages.length}
              </Badge>
            </div>
          ) : (
            pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageSelect(page.id - 1)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
                style={currentPage === page.id - 1 ? activeStyle : { color: navigationTheme.navigationTextSecondary || '#64748b' }}
                onMouseEnter={(e) => {
                  if (currentPage !== page.id - 1) {
                    e.currentTarget.style.backgroundColor = navigationTheme.navigationHover || '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page.id - 1) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{page.icon}</span>
                <span>{page.name}</span>
                {currentPage === page.id - 1 && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
              </button>
            ))
          )}
        </nav>
      </div>

      {/* Right Section - Search, Filter and User Menu */}
      <div className="flex items-center space-x-4">
        {/* Filter Button */}
        {selectedFilterLayout && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFilterToggle}
            className="flex items-center gap-2"
            style={{ 
              borderColor: navigationTheme.navigationBorder || '#d1d5db',
              color: navigationTheme.navigationText || '#0f172a'
            }}
          >
            <Filter size={16} />
            {filterLayoutName}
          </Button>
        )}
        
        {/* Search */}
        {showSearch ? (
          <div className="relative">
            <Search 
              className="absolute left-2 top-2.5 h-4 w-4" 
              style={{ color: navigationTheme.navigationTextSecondary || '#94a3b8' }}
            />
            <Input
              placeholder="Search..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              onBlur={() => setShowSearch(false)}
              style={{
                backgroundColor: navigationTheme.inputBackground || '#ffffff',
                borderColor: navigationTheme.inputBorder || '#d1d5db'
              }}
            />
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSearch(true)}
            style={{ color: navigationTheme.navigationText || '#0f172a' }}
          >
            <Search size={18} />
          </Button>
        )}
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          style={{ color: navigationTheme.navigationText || '#0f172a' }}
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              style={{ color: navigationTheme.navigationText || '#0f172a' }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span>User</span>
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User size={14} className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings size={14} className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;
