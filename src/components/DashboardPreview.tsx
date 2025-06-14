
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { assignChartsToLayout, getTableDataForType, getVisualsForComplexity } from "@/utils/chartPlacementLogic";
import { layoutTemplates, LayoutTemplate, getLayoutForComplexity } from "@/utils/layoutTemplates";
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

  // Set layout based on complexity
  useEffect(() => {
    const selectedLayout = getLayoutForComplexity(
      config.complexity || 'moderate', 
      visuals.length
    );
    setLayout(selectedLayout);
  }, [config.complexity, visuals.length]);

  const totalPages = config.pages || 1;
  
  // Calculate visuals per page based on complexity and canvas size
  const getVisualsPerPage = () => {
    const complexity = config.complexity || 'moderate';
    const canvasSize = config.layoutDimension || '16:9';
    
    let baseCount = 4;
    if (complexity === 'simple') baseCount = 3;
    else if (complexity === 'complex') baseCount = 6;
    
    // Adjust for canvas size
    if (canvasSize === '21:9') baseCount += 2;
    else if (canvasSize === '4:3' || canvasSize === '1:1') baseCount -= 1;
    
    return Math.max(1, baseCount);
  };
  
  const visualsPerPage = getVisualsPerPage();
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
    const canvasSize = config.layoutDimension || '16:9';
    
    // Dynamic grid based on complexity and canvas size
    let gridCols = 'grid-cols-4';
    if (complexity === 'simple') {
      gridCols = 'grid-cols-3';
    } else if (complexity === 'complex') {
      if (canvasSize === '21:9') gridCols = 'grid-cols-6';
      else if (canvasSize === '4:3' || canvasSize === '1:1') gridCols = 'grid-cols-3';
      else gridCols = 'grid-cols-6';
    }

    return (
      <div className={`grid ${gridCols} gap-4 mb-6`}>
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
    
    const colClasses = {
      1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
      5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
      9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
      13: 'col-span-12', 14: 'col-span-12', 15: 'col-span-12', 16: 'col-span-12'
    };
    
    const rowClasses = {
      1: 'row-span-1', 2: 'row-span-2', 3: 'row-span-3', 4: 'row-span-4'
    };
    
    return `${colClasses[colSpan as keyof typeof colClasses] || 'col-span-4'} ${rowClasses[rowSpan as keyof typeof rowClasses] || 'row-span-2'}`;
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
    const complexity = config.complexity || 'moderate';
    
    // Dynamic height based on chart type and complexity
    const getChartHeight = () => {
      if (isTable) return 'h-96';
      
      const baseHeight = complexity === 'simple' ? 'h-64' : 
                        complexity === 'complex' ? 'h-80' : 'h-72';
      
      return baseHeight;
    };

    if (isTable) {
      return (
        <div key={index} className={`${gridClasses} ${getChartHeight()}`}>
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

    return (
      <div key={index} className={`${gridClasses} ${getChartHeight()}`}>
        <Card className="h-full flex flex-col" {...commonProps}>
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

  // Get grid container columns based on canvas size
  const getGridContainerCols = () => {
    const canvasSize = config.layoutDimension || '16:9';
    switch (canvasSize) {
      case '4:3': return 'grid-cols-10';
      case '1:1': return 'grid-cols-8';
      case '21:9': return 'grid-cols-16';
      default: return 'grid-cols-12';
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
        <div className={`p-6 w-full ${getAspectRatioClass()}`}>
          {renderAdvancedKPISection()}

          <div className="space-y-6 h-full">
            {currentPageVisuals.length > 0 ? (
              <div className={`grid ${getGridContainerCols()} gap-4 auto-rows-min h-full`}>
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
