
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { assignChartsToLayout, getTableDataForType } from "@/utils/chartPlacementLogic";
import { layoutTemplates, LayoutTemplate, ChartPlacement } from "@/utils/layoutTemplates";
import AdvancedKPICard from './AdvancedKPICard';
import SmartPageNavigation from './SmartPageNavigation';
import { advancedThemes } from '@/utils/advancedThemeSystem';

interface DashboardPreviewProps {
  config: any;
  onExport: (format: string) => void;
}

const DashboardPreview = ({ config, onExport }: DashboardPreviewProps) => {
  const [layout, setLayout] = useState<LayoutTemplate>(layoutTemplates[0]);
  const [visuals, setVisuals] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Set up default visuals if none are provided
  useEffect(() => {
    if (config.selectedVisuals && config.selectedVisuals.length > 0) {
      setVisuals(config.selectedVisuals);
    } else {
      // Default visuals for demo purposes
      const defaultVisuals = [
        'line-charts',
        'bar-charts', 
        'pie-charts',
        'area-charts',
        'data-tables'
      ];
      setVisuals(defaultVisuals);
    }
  }, [config.selectedVisuals]);

  useEffect(() => {
    if (config.layoutType) {
      const selectedLayout = layoutTemplates.find(l => l.name === config.layoutType);
      if (selectedLayout) {
        setLayout(selectedLayout);
      }
    }
  }, [config.layoutType]);

  const visualsPerPage = layout.maxVisuals;
  const totalPages = Math.max(1, Math.ceil(visuals.length / visualsPerPage));
  const startIndex = currentPage * visualsPerPage;
  const endIndex = startIndex + visualsPerPage;
  const currentPageVisuals = assignChartsToLayout(visuals.slice(startIndex, endIndex), layout);

  console.log('Dashboard Preview Debug:', {
    visuals,
    currentPage,
    totalPages,
    visualsPerPage,
    currentPageVisuals,
    layout: layout.name
  });

  const tableData = getTableDataForType('transaction-tables', config.dashboardType);

  const getTableTitle = (visual: string) => {
    if (visual.includes('transaction')) return 'Recent Transactions';
    if (visual.includes('summary')) return 'Account Summary';
    return 'Data Table';
  };

  const getAdvancedThemeColors = () => {
    const baseTheme = advancedThemes[config.themeStyle] || advancedThemes.minimal;
    
    if (config.customTheme) {
      return { ...baseTheme, ...config.customTheme };
    }
    
    if (config.colorPalette) {
      return { ...baseTheme, chartColors: config.colorPalette };
    }
    
    return baseTheme;
  };

  const themeColors = getAdvancedThemeColors();

  const generateAdvancedKPIData = (dashboardType: string) => {
    const baseData = [
      {
        label: 'Revenue',
        value: '$2.8M',
        change: '+12.5%',
        trend: 'up' as const,
        progress: 75,
        target: '$3.0M',
        chartData: Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 100 + 50 })),
        chartType: 'line' as const,
        color: themeColors.positive
      },
      {
        label: 'Users',
        value: '45.2K',
        change: '+8.3%',
        trend: 'up' as const,
        progress: 65,
        target: '50K',
        chartData: Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 80 + 40 })),
        chartType: 'area' as const,
        color: themeColors.info
      },
      {
        label: 'Conversion',
        value: '3.24%',
        change: '-2.1%',
        trend: 'down' as const,
        progress: 45,
        target: '4.0%',
        chartData: Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 60 + 20 })),
        chartType: 'bar' as const,
        color: themeColors.negative
      },
      {
        label: 'Satisfaction',
        value: '94.2%',
        change: '+5.7%',
        trend: 'up' as const,
        progress: 94,
        target: '95%',
        chartData: Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 20 + 80 })),
        chartType: 'line' as const,
        color: themeColors.warning
      }
    ];

    if (dashboardType === 'finance') {
      return [
        {
          ...baseData[0],
          label: 'Total Revenue',
          value: '$2.8M',
          chartData: Array.from({ length: 12 }, (_, i) => ({ value: Math.random() * 1000000 + 2000000 }))
        },
        {
          ...baseData[1],
          label: 'Net Profit',
          value: '$892K',
          change: '+18.4%',
          chartData: Array.from({ length: 12 }, (_, i) => ({ value: Math.random() * 500000 + 600000 }))
        },
        {
          ...baseData[2],
          label: 'Cash Flow',
          value: '$1.2M',
          change: '+15.2%',
          trend: 'up' as const,
          color: themeColors.positive
        },
        {
          ...baseData[3],
          label: 'ROI',
          value: '24.8%',
          change: '+3.2%'
        }
      ];
    }

    return baseData;
  };

  const renderAdvancedKPISection = () => {
    const kpiData = generateAdvancedKPIData(config.dashboardType);
    const kpiCount = Math.min(kpiData.length, 4);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.slice(0, kpiCount).map((kpi, index) => (
          <AdvancedKPICard
            key={index}
            data={kpi}
            themeColors={themeColors}
            size={config.complexity === 'simple' ? 'small' : config.complexity === 'complex' ? 'large' : 'medium'}
            showChart={config.complexity !== 'simple'}
            showProgress={config.complexity === 'complex'}
          />
        ))}
      </div>
    );
  };

  const renderChart = (visual: string, placement: ChartPlacement, index: number) => {
    if (!visual || typeof visual !== 'string') {
      console.warn('Visual is undefined or not a string:', visual);
      return null;
    }

    const commonProps = {
      style: {
        backgroundColor: themeColors.cardBackground,
        borderColor: themeColors.cardBorder,
        color: themeColors.textPrimary
      }
    };

    // Calculate grid classes based on placement
    const gridClasses = `col-span-${placement.position.colSpan} row-span-${placement.position.rowSpan}`;

    if (visual.includes('table')) {
      return (
        <div key={index} className={gridClasses}>
          <DataTable
            title={getTableTitle(visual)}
            headers={tableData.headers}
            rows={tableData.rows}
            themeColors={themeColors}
            showBadges={config.complexity !== 'simple'}
          />
        </div>
      );
    }

    return (
      <Card key={index} className={gridClasses} {...commonProps}>
        <CardHeader>
          <CardTitle style={{ color: themeColors.textPrimary }}>
            {visual.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </CardTitle>
          <CardDescription style={{ color: themeColors.textSecondary }}>
            Description of {visual.replace('-', ' ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ 
            height: '200px', 
            background: `linear-gradient(135deg, ${themeColors.chartColors[index % themeColors.chartColors.length]}, ${themeColors.chartColors[(index + 1) % themeColors.chartColors.length]})`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {visual.includes('line') && 'Line Chart'}
            {visual.includes('bar') && 'Bar Chart'}
            {visual.includes('pie') && 'Pie Chart'}
            {visual.includes('area') && 'Area Chart'}
            {!visual.includes('line') && !visual.includes('bar') && !visual.includes('pie') && !visual.includes('area') && 'Chart'}
          </div>
        </CardContent>
      </Card>
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div 
      className="h-full overflow-auto"
      style={{ 
        background: themeColors.background,
        color: themeColors.textPrimary
      }}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: themeColors.textPrimary }}>
              Dashboard Preview
            </h1>
            <p style={{ color: themeColors.textSecondary }}>
              Customize your dashboard layout and visuals.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Add Visual
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
              Export
            </Button>
          </div>
        </div>

        {/* Advanced KPI Section - Always at top */}
        {renderAdvancedKPISection()}

        {/* Dashboard Content */}
        <div className="space-y-6">
          {currentPageVisuals.length > 0 ? (
            <div className="grid grid-cols-12 gap-4 auto-rows-min">
              {currentPageVisuals
                .filter(assignment => assignment && assignment.visual)
                .map((assignment, index) => 
                  renderChart(assignment.visual, assignment.placement, index)
                )}
            </div>
          ) : (
            <Card className="p-8 text-center" style={{ backgroundColor: themeColors.cardBackground }}>
              <div className="text-lg font-medium mb-2" style={{ color: themeColors.textPrimary }}>
                No visuals available
              </div>
              <p style={{ color: themeColors.textSecondary }}>
                Please select some visuals to see your dashboard preview
              </p>
            </Card>
          )}
        </div>

        {/* Smart Page Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <SmartPageNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPageSelect={handlePageChange}
              config={config}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPreview;
