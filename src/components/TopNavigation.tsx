
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
  Search, Bell, ChevronDown, User, CircleDot, Layers
} from "lucide-react";

interface TopNavigationProps {
  config: any;
  onPageSelect: (page: number) => void;
  currentPage: number;
  title: string;
}

const TopNavigation = ({ 
  config, 
  onPageSelect,
  currentPage,
  title
}: TopNavigationProps) => {
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

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left Section - Brand and Navigation */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h3 className="font-semibold text-lg">
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
              <span className="text-sm text-muted-foreground">Page:</span>
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
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  currentPage === page.id - 1
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground"
                )}
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

      {/* Right Section - Search and User Menu */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
            <Search size={18} />
          </Button>
        )}
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
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
