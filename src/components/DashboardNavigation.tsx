
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
import { advancedThemes } from "@/utils/advancedThemeSystem";

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
  
  // Get theme colors
  const currentTheme = advancedThemes[config.themeStyle] || advancedThemes.minimal;
  
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

  const showPageDropdown = collapsed || pages.length > 8;

  return (
    <div 
      className={cn(
        "h-screen flex flex-col transition-all duration-300 relative z-10 border-r",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ 
        backgroundColor: currentTheme.navigationBackground,
        borderColor: currentTheme.navigationBorder,
        color: currentTheme.navigationText
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 min-h-[64px] backdrop-blur-sm border-b"
        style={{ 
          backgroundColor: `${currentTheme.surface}20`,
          borderColor: currentTheme.navigationBorder
        }}
      >
        {!collapsed && (
          <div className="flex items-center">
            <div 
              className="p-1 rounded-md mr-2"
              style={{ backgroundColor: `${currentTheme.info}20` }}
            >
              <div style={{ color: currentTheme.info }}>
                {getIconForDashboardType(config.dashboardType)}
              </div>
            </div>
            <h3 
              className="font-semibold text-lg truncate"
              style={{ color: currentTheme.navigationText }}
            >
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
          className={cn("flex-shrink-0 transition-colors", collapsed && "mx-auto")}
          style={{ 
            color: currentTheme.navigationText,
            ':hover': { backgroundColor: currentTheme.navigationHover }
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      {/* Search */}
      {!collapsed && (
        <div className="px-3 mb-4 mt-4">
          <div className="relative">
            <Search 
              className="absolute left-2 top-2.5 h-4 w-4" 
              style={{ color: currentTheme.navigationTextSecondary }}
            />
            <Input
              placeholder="Search pages..."
              className="pl-8 py-1 h-9 border-0 focus:ring-2"
              style={{ 
                backgroundColor: `${currentTheme.surface}40`,
                color: currentTheme.navigationText,
                '::placeholder': { color: currentTheme.navigationTextSecondary },
                borderColor: currentTheme.navigationBorder
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <Separator className="mx-2" style={{ backgroundColor: currentTheme.navigationBorder }} />
      
      {/* Pages Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <div className="px-3">
          {!collapsed && (
            <p 
              className="text-xs font-medium mb-3 uppercase tracking-wider"
              style={{ color: currentTheme.navigationTextSecondary }}
            >
              Pages
            </p>
          )}
          
          {showPageDropdown ? (
            <div className="mb-4">
              {!collapsed ? (
                <Select 
                  value={currentPage.toString()} 
                  onValueChange={(value) => handlePageSelect(parseInt(value))}
                >
                  <SelectTrigger 
                    className="w-full border-0"
                    style={{ 
                      backgroundColor: `${currentTheme.surface}40`,
                      color: currentTheme.navigationText
                    }}
                  >
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent 
                    className="border shadow-lg"
                    style={{ 
                      backgroundColor: currentTheme.navigationBackground,
                      borderColor: currentTheme.navigationBorder
                    }}
                  >
                    {pages.map((page) => (
                      <SelectItem 
                        key={page.id} 
                        value={(page.id - 1).toString()}
                        style={{ color: currentTheme.navigationText }}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{page.icon}</span>
                          <span>{page.name}</span>
                          {currentPage === page.id - 1 && (
                            <Badge 
                              variant="secondary" 
                              className="ml-auto text-xs"
                              style={{ 
                                backgroundColor: currentTheme.navigationActive,
                                color: currentTheme.navigationText
                              }}
                            >
                              Active
                            </Badge>
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
                      className="w-full h-10 relative transition-all duration-200"
                      style={{ 
                        backgroundColor: currentPage === page.id - 1 ? currentTheme.navigationActive : 'transparent',
                        color: currentPage === page.id - 1 ? currentTheme.navigationText : currentTheme.navigationTextSecondary
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentPage === page.id - 1 ? currentTheme.navigationActive : 'transparent'}
                      title={page.name}
                    >
                      {page.icon}
                      {currentPage === page.id - 1 && (
                        <div 
                          className="absolute right-1 w-2 h-2 rounded-full"
                          style={{ backgroundColor: currentTheme.info }}
                        ></div>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <nav className="space-y-1 mb-4">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageSelect(page.id - 1)}
                  className="flex items-center w-full rounded-lg text-sm transition-all duration-200 px-3 py-2.5 font-medium group"
                  style={{ 
                    backgroundColor: currentPage === page.id - 1 ? currentTheme.navigationActive : 'transparent',
                    color: currentPage === page.id - 1 ? currentTheme.navigationText : currentTheme.navigationTextSecondary
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
                  <span className="mr-3 transition-transform group-hover:scale-110">{page.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{page.name}</span>
                      {currentPage === page.id - 1 && (
                        <Badge 
                          className="ml-auto text-xs" 
                          variant="secondary"
                          style={{ 
                            backgroundColor: `${currentTheme.info}20`,
                            color: currentTheme.info
                          }}
                        >
                          Active
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              ))}
            </nav>
          )}
        </div>
        
        {/* Analytics Section */}
        {!collapsed && (
          <>
            <Separator className="my-4 mx-2" style={{ backgroundColor: currentTheme.navigationBorder }} />
            <div className="px-3">
              <p 
                className="text-xs font-medium mb-3 uppercase tracking-wider"
                style={{ color: currentTheme.navigationTextSecondary }}
              >
                Analytics
              </p>
              <nav className="space-y-1">
                {[
                  { icon: TrendingUp, label: 'Performance' },
                  { icon: Users, label: 'Audience' },
                  { icon: Calendar, label: 'Schedule' }
                ].map((item) => (
                  <button 
                    key={item.label}
                    className="flex items-center w-full rounded-lg text-sm px-3 py-2 transition-all duration-200"
                    style={{ color: currentTheme.navigationTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.navigationHover;
                      e.currentTarget.style.color = currentTheme.navigationText;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = currentTheme.navigationTextSecondary;
                    }}
                  >
                    <item.icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <div 
        className="p-3 mt-auto border-t"
        style={{ 
          borderColor: currentTheme.navigationBorder,
          backgroundColor: `${currentTheme.surface}20`
        }}
      >
        {!collapsed ? (
          <div 
            className="rounded-lg p-3 border"
            style={{ 
              backgroundColor: `${currentTheme.info}10`,
              borderColor: `${currentTheme.info}20`
            }}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="rounded-full p-1"
                style={{ backgroundColor: currentTheme.info }}
              >
                <Zap size={12} style={{ color: currentTheme.navigationBackground }} />
              </div>
              <p 
                className="text-sm font-medium"
                style={{ color: currentTheme.navigationText }}
              >
                Pro Tips
              </p>
            </div>
            <p 
              className="text-xs mt-2"
              style={{ color: currentTheme.navigationTextSecondary }}
            >
              Use filters and drill-downs for deeper insights into your data.
            </p>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-full transition-colors" 
            title="Settings"
            style={{ color: currentTheme.navigationText }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.navigationHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Settings size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardNavigation;
