
import { LayoutGrid, Lightbulb, DollarSign, Users, TrendingDown, User, TrendingUp, ShoppingCart } from "lucide-react";
import { optimizeLayout, generateLayoutSuggestions } from "../utils/smartLayoutOptimizer";
import DashboardHeader from "./dashboard/DashboardHeader";
import LayoutSuggestions from "./dashboard/LayoutSuggestions";
import DashboardGrid from "./dashboard/DashboardGrid";

interface MainDashboardProps {
  config: any;
  currentPage?: number;
  onExport: (format: string) => void;
}

const MainDashboard = ({ config, currentPage = 0, onExport }: MainDashboardProps) => {
  console.log('MainDashboard - Current page:', currentPage);
  console.log('MainDashboard - Config:', config);
  
  const getCurrentPageLayout = () => {
    if (!config.layouts || !config.layouts[currentPage]) {
      return { pageId: currentPage, components: [] };
    }
    return config.layouts[currentPage];
  };

  const currentLayout = getCurrentPageLayout();
  const visuals = config.visuals || [];

  // Optimize layout using smart optimizer - pass config for navigation awareness
  const optimizedLayout = optimizeLayout(currentLayout.components || [], config);
  const layoutSuggestions = generateLayoutSuggestions(currentLayout.components || [], visuals);

  console.log('MainDashboard - Optimized layout:', optimizedLayout);

  const getThemeColors = () => {
    const themeStyle = config.themeStyle;
    const palette = config.colorPalette || ['#2563eb', '#7c3aed', '#059669', '#dc2626'];
    
    switch (themeStyle) {
      case 'dark':
        return {
          background: '#1f2937',
          cardBackground: '#374151',
          textPrimary: '#ffffff',
          textSecondary: '#d1d5db',
          borderColor: '#4b5563',
          chartColors: palette
        };
      case 'corporate':
        return {
          background: '#f8fafc',
          cardBackground: '#ffffff',
          textPrimary: '#1e293b',
          textSecondary: '#64748b',
          borderColor: '#e2e8f0',
          chartColors: palette
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.9)',
          textPrimary: '#1f2937',
          textSecondary: '#6b7280',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          chartColors: palette
        };
      case 'creative':
        return {
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.95)',
          textPrimary: '#1f2937',
          textSecondary: '#6b7280',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          chartColors: palette
        };
      case 'flat':
        return {
          background: '#ecf0f1',
          cardBackground: '#ffffff',
          textPrimary: '#2c3e50',
          textSecondary: '#7f8c8d',
          borderColor: '#bdc3c7',
          chartColors: palette
        };
      case 'minimal':
      default:
        return {
          background: '#ffffff',
          cardBackground: '#f9fafb',
          textPrimary: '#111827',
          textSecondary: '#6b7280',
          borderColor: '#e5e7eb',
          chartColors: palette
        };
    }
  };

  const themeColors = getThemeColors();

  // Mock data for charts and KPIs
  const getMockData = () => {
    const kpiData = [
      { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600' },
      { label: 'Active Users', value: '45.2K', change: '+8.3%', trend: 'up', icon: Users, color: 'text-blue-600' },
      { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down', icon: TrendingDown, color: 'text-red-600' },
      { label: 'Customer Satisfaction', value: '94.2%', change: '+5.7%', trend: 'up', icon: User, color: 'text-purple-600' },
      { label: 'Sales Growth', value: '18.4%', change: '+3.2%', trend: 'up', icon: TrendingUp, color: 'text-orange-600' },
      { label: 'Monthly Orders', value: '1,284', change: '+15.8%', trend: 'up', icon: ShoppingCart, color: 'text-indigo-600' }
    ];

    const chartData = [
      { month: 'Jan', value: 4000, sales: 2400, users: 1200 },
      { month: 'Feb', value: 3000, sales: 1398, users: 1100 },
      { month: 'Mar', value: 2000, sales: 9800, users: 1500 },
      { month: 'Apr', value: 2780, sales: 3908, users: 1300 },
      { month: 'May', value: 1890, sales: 4800, users: 1700 },
      { month: 'Jun', value: 2390, sales: 3800, users: 1400 }
    ];

    return { kpiData, chartData };
  };

  const mockData = getMockData();

  // Empty state matching layout preview style
  if (optimizedLayout.components.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: themeColors.background }}>
        <div className="text-center max-w-md">
          <LayoutGrid className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: themeColors.textSecondary }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.textPrimary }}>
            Page {currentPage + 1} is Empty
          </h3>
          <p className="mb-4" style={{ color: themeColors.textSecondary }}>
            Add components in the Layout Builder to see them here
          </p>
          {layoutSuggestions.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Suggestions</span>
              </div>
              <ul className="text-xs text-blue-700 text-left space-y-1">
                {layoutSuggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden" 
      style={{ 
        background: themeColors.background, 
        color: themeColors.textPrimary 
      }}
    >
      {/* Compact Header - Minimal height */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <DashboardHeader 
          currentPage={currentPage}
          componentCount={optimizedLayout.components.length}
          themeColors={themeColors}
          onExport={onExport}
        />
        
        {/* Layout Suggestions - Only show if available */}
        {optimizedLayout.suggestions.length > 0 && (
          <div className="mt-1">
            <LayoutSuggestions suggestions={optimizedLayout.suggestions} />
          </div>
        )}
      </div>

      {/* Main Content Area - Full remaining space for 16:9 Canvas */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <DashboardGrid 
          components={optimizedLayout.components}
          visuals={visuals}
          themeColors={themeColors}
          mockData={mockData}
          config={config}
        />
      </div>
    </div>
  );
};

export default MainDashboard;
