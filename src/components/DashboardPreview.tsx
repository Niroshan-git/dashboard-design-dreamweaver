
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { assignChartsToLayout, getTableDataForType, getVisualsForComplexity } from "@/utils/chartPlacementLogic";
import { layoutTemplates, LayoutTemplate, getLayoutForComplexity, getLayoutForPage } from "@/utils/layoutTemplates";
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

  // Set up visuals based on complexity and user selection
  useEffect(() => {
    let finalVisuals: string[] = [];
    
    if (config.visuals && config.visuals.length > 0) {
      finalVisuals = config.visuals;
    } else if (config.complexity) {
      finalVisuals = getVisualsForComplexity(config.complexity);
    } else {
      finalVisuals = ['kpi-cards', 'line-charts', 'bar-charts'];
    }
    
    setVisuals(finalVisuals);
  }, [config.visuals, config.complexity]);

  // Set layout based on complexity, page, and canvas size
  useEffect(() => {
    const totalPages = config.pages || 1;
    let selectedLayout: LayoutTemplate;
    
    if (config.complexity) {
      // Use page-specific layout that considers complexity
      selectedLayout = getLayoutForPage(currentPage, totalPages, visuals.length, config.complexity);
    } else if (config.layoutType) {
      const foundLayout = layoutTemplates.find(l => l.name === config.layoutType);
      selectedLayout = foundLayout || layoutTemplates[0];
    } else {
      selectedLayout = getLayoutForComplexity('moderate', visuals.length);
    }
    
    setLayout(selectedLayout);
  }, [config.complexity, config.layoutType, config.pages, currentPage, visuals.length]);

  const totalPages = config.pages || 1;
  const visualsPerPage = layout.maxVisuals;
  const startIndex = currentPage * visualsPerPage;
  const endIndex = startIndex + visualsPerPage;
  
  const currentPageVisuals = assignChartsToLayout(
    visuals.slice(startIndex, endIndex), 
    layout, 
    config.complexity || 'moderate',
    config.layoutDimension || '16:9',
    currentPage,
    totalPages
  );

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

  const generateAdvancedKPIData = (dashboardType: string, complexity: string) => {
    const kpiCount = complexity === 'simple' ? 3 : complexity === 'moderate' ? 4 : 6;
    
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
      },
      {
        label: 'Growth Rate',
        value: '18.4%',
        change: '+3.2%',
        trend: 'up' as const,
        progress: 68,
        target: '20%',
        chartData: Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 40 + 30 })),
        chartType: 'area' as const,
        color: themeColors.chartColors[0]
      },
      {
        label: 'ROI',
        value: '24.8%',
        change: '+6.1%',
        trend: 'up' as const,
        progress: 82,
        target: '25%',
        chartData: Array.from({ length: 7 }, (_, i) => ({ value: Math.random() * 30 + 60 })),
        chartType: 'line' as const,
        color: themeColors.chartColors[1]
      }
    ];

    return baseData.slice(0, kpiCount);
  };

  const renderAdvancedKPISection = () => {
    const kpiData = generateAdvancedKPIData(config.dashboardType, config.complexity || 'moderate');
    const complexity = config.complexity || 'moderate';
    const gridCols = complexity === 'simple' ? 'grid-cols-3' : 
                    complexity === 'moderate' ? 'grid-cols-4' : 'grid-cols-6';

    // Adjust grid for canvas size
    const canvasSize = config.layoutDimension || '16:9';
    let adjustedGridCols = gridCols;
    
    if (canvasSize === '4:3' && complexity === 'complex') {
      adjustedGridCols = 'grid-cols-4'; // Reduce columns for taller aspect ratio
    } else if (canvasSize === '1:1' && complexity !== 'simple') {
      adjustedGridCols = 'grid-cols-3'; // Square format works better with 3 columns
    } else if (canvasSize === '21:9' && complexity === 'complex') {
      adjustedGridCols = 'grid-cols-8'; // Ultra-wide can handle more columns
    }

    return (
      <div className={`grid ${adjustedGridCols} gap-4 mb-6`}>
        {kpiData.map((kpi, index) => (
          <AdvancedKPICard
            key={index}
            data={kpi}
            themeColors={themeColors}
            size={complexity === 'simple' ? 'small' : complexity === 'complex' ? 'large' : 'medium'}
            showChart={complexity !== 'simple'}
            showProgress={complexity === 'complex'}
          />
        ))}
      </div>
    );
  };

  const getGridClasses = (placement: any) => {
    const { colSpan, rowSpan } = placement.position;
    
    // Ensure proper grid classes based on canvas size
    const canvasSize = config.layoutDimension || '16:9';
    let adjustedColSpan = colSpan;
    
    // Adjust column spans for different canvas sizes
    if (canvasSize === '4:3' && colSpan > 8) {
      adjustedColSpan = 8; // Limit width for 4:3 ratio
    } else if (canvasSize === '1:1' && colSpan > 6) {
      adjustedColSpan = 6; // Square format constraint
    }
    
    const colClasses = {
      1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
      5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
      9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12'
    };
    
    const rowClasses = {
      1: 'row-span-1', 2: 'row-span-2', 3: 'row-span-3', 4: 'row-span-4'
    };
    
    return `${colClasses[adjustedColSpan as keyof typeof colClasses] || 'col-span-4'} ${rowClasses[rowSpan as keyof typeof rowClasses] || 'row-span-1'}`;
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
    const complexity = config.complexity || 'moderate';
    const canvasSize = config.layoutDimension || '16:9';

    if (isTable) {
      return (
        <div key={index} className={`${gridClasses} min-h-fit`}>
          <DataTable
            title={getTableTitle(visual)}
            headers={tableData.headers}
            rows={tableData.rows}
            themeColors={themeColors}
            showBadges={complexity !== 'simple'}
          />
        </div>
      );
    }

    // Dynamic height based on complexity, canvas size, and placement
    const getChartHeight = () => {
      const baseHeight = complexity === 'simple' ? 48 : complexity === 'complex' ? 72 : 64;
      
      // Adjust for canvas size
      let heightMultiplier = 1;
      if (canvasSize === '4:3') {
        heightMultiplier = 1.2; // Taller for 4:3 ratio
      } else if (canvasSize === '1:1') {
        heightMultiplier = 1.1; // Slightly taller for square
      } else if (canvasSize === '21:9') {
        heightMultiplier = 0.9; // Shorter for ultra-wide
      }
      
      // Adjust for placement size
      if (isFullWidth) {
        heightMultiplier *= 1.3;
      } else if (placement.position.colSpan >= 8) {
        heightMultiplier *= 1.2;
      }
      
      const finalHeight = Math.round(baseHeight * heightMultiplier);
      return `h-${finalHeight}`;
    };

    const heightClass = getChartHeight();

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
              {visual.includes('heatmap') && 'Data density visualization'}
              {visual.includes('geo') && 'Geographic data mapping'}
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
                {visual.includes('heatmap') && '🔥'}
                {visual.includes('geo') && '🗺️'}
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
                {visual.includes('heatmap') && 'Heatmap'}
                {visual.includes('geo') && 'Geographic Map'}
              </div>
              <div style={{
                color: themeColors.textSecondary,
                fontSize: '12px'
              }}>
                {complexity === 'simple' ? 'Basic visualization' : 
                 complexity === 'complex' ? 'Advanced interactive chart' : 'Interactive chart placeholder'}
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

  // Get aspect ratio class for the dashboard container
  const getAspectRatioClass = () => {
    const canvasSize = config.layoutDimension || '16:9';
    switch (canvasSize) {
      case '4:3': return 'aspect-[4/3]';
      case '1:1': return 'aspect-square';
      case '21:9': return 'aspect-[21/9]';
      default: return 'aspect-video'; // 16:9
    }
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
        <div className={`p-6 ${getAspectRatioClass()}`}>
          {renderAdvancedKPISection()}

          <div className="space-y-6 h-full">
            {currentPageVisuals.length > 0 ? (
              <div className="grid grid-cols-12 gap-4 auto-rows-min h-full">
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
                    No visuals available for {config.complexity || 'moderate'} complexity
                  </div>
                  <p style={{ color: themeColors.textSecondary }}>
                    Please select visuals that match your complexity level or adjust the complexity setting
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
