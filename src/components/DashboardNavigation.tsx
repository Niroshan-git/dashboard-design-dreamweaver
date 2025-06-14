
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, ChevronRight, BarChart3, PieChart, TrendingUp, 
  Calendar, Users, Settings, Search, Menu, ChevronLeft, Zap, Map, 
  LineChart, CircleDot, Layers
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  config: any;
  onPageSelect: (page: number) => void;
  currentPage: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const DashboardNavigation = ({ 
  config, 
  onPageSelect,
  currentPage,
  collapsed,
  onToggleCollapse
}: NavigationProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  
  const getIconForDashboardType = (type: string) => {
    switch(type) {
      case "finance": return <TrendingUp size={18} />;
      case "ecommerce": return <Users size={18} />;
      case "logistics": return <Map size={18} />;
      case "sales": return <BarChart3 size={18} />;
      case "executive": return <PieChart size={18} />;
      case "healthcare": return <LineChart size={18} />;
      default: return <Layers size={18} />;
    }
  };
  
  const pages = Array.from({ length: config.pages || 1 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? "Main Dashboard" : `Page ${i + 1}`,
    icon: i === 0 ? <LayoutDashboard size={18} /> : <CircleDot size={18} />,
  }));

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-primary mr-2" />
            <h3 className="font-semibold text-lg truncate">
              {config.dashboardType 
                ? config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1) + " Dashboard" 
                : "Dashboard"}
            </h3>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      {!collapsed && (
        <div className="px-3 mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 py-1 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <Separator />
      
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          {!collapsed && <p className="text-xs font-medium text-muted-foreground mb-3">PAGES</p>}
          <nav className="space-y-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => onPageSelect(page.id - 1)}
                className={cn(
                  "flex items-center w-full rounded-md text-sm",
                  "transition-colors hover:bg-accent hover:text-accent-foreground",
                  "px-3 py-2 font-medium",
                  currentPage + 1 === page.id ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <span className="mr-3">{page.icon}</span>
                {!collapsed && <span className="truncate">{page.name}</span>}
                {!collapsed && currentPage + 1 === page.id && (
                  <Badge className="ml-auto" variant="secondary">Active</Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {!collapsed && (
          <>
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground mb-3">ANALYTICS</p>
              <nav className="space-y-1">
                <a 
                  href="#" 
                  className="flex items-center rounded-md text-sm text-muted-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <TrendingUp size={18} className="mr-3" />
                  <span>Performance</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center rounded-md text-sm text-muted-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Users size={18} className="mr-3" />
                  <span>Audience</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center rounded-md text-sm text-muted-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Calendar size={18} className="mr-3" />
                  <span>Schedule</span>
                </a>
              </nav>
            </div>
          </>
        )}
      </div>
      
      <div className="p-3 mt-auto">
        {!collapsed ? (
          <div className="rounded-lg bg-accent/50 p-3">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-primary p-1">
                <Zap size={12} className="text-primary-foreground" />
              </div>
              <p className="text-sm font-medium">Dashboard Tips</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Try adding filters to drill down into your data for deeper insights.
            </p>
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="w-full" title="Settings">
            <Settings size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardNavigation;
