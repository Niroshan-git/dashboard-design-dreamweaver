import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { assignChartsToLayout, getTableDataForType } from "@/utils/chartPlacementLogic";
import { layoutTemplates, LayoutTemplate } from "@/utils/layoutTemplates";
import AdvancedKPICard from './AdvancedKPICard';
import DashboardTopNavigation from './DashboardTopNavigation';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

  const getGridClasses = (placement: any) => {
    const { colSpan, rowSpan } = placement.position;
    
    // Map colSpan to grid classes
    const colClasses = {
      1: 'col-span-1',
      2: 'col-span-2', 
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12'
    };
    
    const rowClasses = {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
      4: 'row-span-4'
    };
    
    return `${colClasses[colSpan as keyof typeof colClasses] || 'col-span-4'} ${rowClasses[rowSpan as keyof typeof rowClasses] || 'row-span-1'}`;
  };

  const renderChart = (visual: string, placement: any, index: number) => {
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

    const gridClasses = getGridClasses(placement);
    const isTable = visual.includes('table');
    const isFullWidth = placement.position.colSpan >= 12;

    if (isTable) {
      return (
        <div key={index} className={`${gridClasses} min-h-fit`}>
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

    // Determine appropriate height based on placement size
    const heightClass = isFullWidth ? 'h-96' : placement.position.colSpan >= 8 ? 'h-80' : 'h-72';

    return (
      <div key={index} className={`${gridClasses}`}>
        <Card className={`${heightClass} flex flex-col`} {...commonProps}>
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle style={{ color: themeColors.textPrimary }} className="text-lg">
              {visual.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
            <CardDescription style={{ color: themeColors.textSecondary }}>
              {visual.includes('line') && 'Trend analysis over time'}
              {visual.includes('bar') && 'Comparative data visualization'}
              {visual.includes('pie') && 'Distribution breakdown'}
              {visual.includes('area') && 'Volume and trend analysis'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex items-center justify-center">
            <div style={{ 
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${themeColors.chartColors[index % themeColors.chartColors.length]}20, ${themeColors.chartColors[(index + 1) % themeColors.chartColors.length]}20)`,
              border: `2px dashed ${themeColors.chartColors[index % themeColors.chartColors.length]}40`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '8px',
              minHeight: '150px'
            }}>
              <div style={{ 
                color: themeColors.chartColors[index % themeColors.chartColors.length],
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {visual.includes('line') && '📈'}
                {visual.includes('bar') && '📊'}
                {visual.includes('pie') && '🥧'}
                {visual.includes('area') && '📈'}
              </div>
              <div style={{
                color: themeColors.textPrimary,
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {visual.includes('line') && 'Line Chart'}
                {visual.includes('bar') && 'Bar Chart'}
                {visual.includes('pie') && 'Pie Chart'}
                {visual.includes('area') && 'Area Chart'}
              </div>
              <div style={{
                color: themeColors.textSecondary,
                fontSize: '12px'
              }}>
                Interactive chart placeholder
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="h-full flex flex-col" style={{ 
      background: themeColors.background,
      color: themeColors.textPrimary
    }}>
      <DashboardTopNavigation
        config={config}
        onPageSelect={handlePageChange}
        currentPage={currentPage}
        onExport={onExport}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderAdvancedKPISection()}

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
              <Card className="p-12 text-center" style={{ backgroundColor: themeColors.cardBackground }}>
                <div className="space-y-4">
                  <div className="text-6xl">📊</div>
                  <div className="text-xl font-medium" style={{ color: themeColors.textPrimary }}>
                    No visuals available
                  </div>
                  <p style={{ color: themeColors.textSecondary }}>
                    Please select some visuals to see your dashboard preview
                  </p>
                  <Button variant="outline" className="mt-4">
                    Add Visuals
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
