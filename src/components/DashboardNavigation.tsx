
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, ChevronRight, BarChart3, PieChart, TrendingUp, 
  Calendar, Users, Settings, Search, Menu, ChevronLeft, Zap, Map, 
  LineChart, CircleDot, Layers
} from "lucide-react";

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
    name: i === 0 ? "Overview" : i === 1 ? "Analytics" : `Dashboard ${i + 1}`,
    icon: i === 0 ? <LayoutDashboard size={18} /> : <CircleDot size={18} />,
  }));

  const handlePageSelect = (pageIndex: number) => {
    console.log('DashboardNavigation - Page selected:', pageIndex);
    onPageSelect(pageIndex);
  };

  // Show dropdown in collapsed mode or when there are many pages
  const showPageDropdown = collapsed || pages.length > 8;

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300 relative z-10",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 min-h-[64px] bg-background/50 backdrop-blur-sm border-b">
        {!collapsed && (
          <div className="flex items-center">
            <div className="p-1 bg-primary/10 rounded-md mr-2">
              {getIconForDashboardType(config.dashboardType)}
            </div>
            <h3 className="font-semibold text-lg truncate">
              {config.dashboardType 
                ? config.dashboardType.charAt(0).toUpperCase() + config.dashboardType.slice(1) 
                : "Dashboard"}
            </h3>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleCollapse}
          className={cn("flex-shrink-0 hover:bg-accent", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      {/* Search */}
      {!collapsed && (
        <div className="px-3 mb-4 mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              className="pl-8 py-1 h-9 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <Separator className="mx-2" />
      
      {/* Pages Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <div className="px-3">
          {!collapsed && <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Pages</p>}
          
          {showPageDropdown ? (
            <div className="mb-4">
              {!collapsed ? (
                <Select 
                  value={currentPage.toString()} 
                  onValueChange={(value) => handlePageSelect(parseInt(value))}
                >
                  <SelectTrigger className="w-full bg-background/50">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={(page.id - 1).toString()}>
                        <div className="flex items-center space-x-2">
                          <span>{page.icon}</span>
                          <span>{page.name}</span>
                          {currentPage === page.id - 1 && (
                            <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-1">
                  {pages.slice(0, 5).map((page) => (
                    <Button
                      key={page.id}
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePageSelect(page.id - 1)}
                      className={cn(
                        "w-full h-10 relative",
                        currentPage === page.id - 1 && "bg-accent text-accent-foreground"
                      )}
                      title={page.name}
                    >
                      {page.icon}
                      {currentPage === page.id - 1 && (
                        <div className="absolute right-1 w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </Button>
                  ))}
                  {pages.length > 5 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full h-10"
                      title={`${pages.length - 5} more pages`}
                    >
                      <span className="text-xs font-bold">+{pages.length - 5}</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <nav className="space-y-1 mb-4">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageSelect(page.id - 1)}
                  className={cn(
                    "flex items-center w-full rounded-lg text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground px-3 py-2.5 font-medium group",
                    currentPage === page.id - 1 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-3 transition-transform group-hover:scale-110">{page.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{page.name}</span>
                      {currentPage === page.id - 1 && (
                        <Badge className="ml-auto text-xs" variant="secondary">
                          Active
                        </Badge>
                      )}
                    </>
                  )}
                  {collapsed && currentPage === page.id - 1 && (
                    <div className="absolute right-1 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          )}
        </div>
        
        {/* Analytics Section */}
        {!collapsed && (
          <>
            <Separator className="my-4 mx-2" />
            <div className="px-3">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Analytics</p>
              <nav className="space-y-1">
                <button className="flex items-center w-full rounded-lg text-sm text-muted-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <TrendingUp size={18} className="mr-3" />
                  <span>Performance</span>
                </button>
                <button className="flex items-center w-full rounded-lg text-sm text-muted-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Users size={18} className="mr-3" />
                  <span>Audience</span>
                </button>
                <button className="flex items-center w-full rounded-lg text-sm text-muted-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Calendar size={18} className="mr-3" />
                  <span>Schedule</span>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 mt-auto border-t bg-background/50">
        {!collapsed ? (
          <div className="rounded-lg bg-accent/20 p-3 border border-accent/20">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-primary p-1">
                <Zap size={12} className="text-primary-foreground" />
              </div>
              <p className="text-sm font-medium">Pro Tips</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use filters and drill-downs for deeper insights into your data.
            </p>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-full hover:bg-accent" 
            title="Settings"
          >
            <Settings size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardNavigation;
