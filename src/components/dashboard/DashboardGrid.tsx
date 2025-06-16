import ComponentRenderer from './ComponentRenderer';

interface DashboardGridProps {
  components: any[];
  visuals: any[];
  themeColors: any;
  mockData: any;
  config: any;
}

const DashboardGrid = ({ components, visuals, themeColors, mockData, config }: DashboardGridProps) => {
  // Calculate total available height first
  const calculateTotalAvailableHeight = () => {
    const headerHeight = 80; // Dashboard header height
    const navigationHeight = config.showTopNavigation ? 60 : 0; // Top navigation if enabled
    const padding = 20; // Reduced overall padding
    return `calc(100vh - ${headerHeight + navigationHeight + padding}px)`;
  };

  // Get unique rows and calculate grid structure
  const getGridStructure = () => {
    if (components.length === 0) return { totalRows: 4, rowHeights: {} };
    
    const rowComponents: { [key: number]: any[] } = {};
    
    // Group components by row
    components.forEach(component => {
      const row = component.position?.row || 1;
      if (!rowComponents[row]) rowComponents[row] = [];
      rowComponents[row].push(component);
    });
    
    const totalRows = Math.max(...Object.keys(rowComponents).map(r => parseInt(r)), 4);
    const totalAvailableHeight = calculateTotalAvailableHeight();
    
    // Calculate row heights - ensure they fill the entire container
    const rowHeights: { [key: number]: string } = {};
    const maxRow = Math.max(...Object.keys(rowComponents).map(r => parseInt(r)));
    
    // Create equal distribution first
    const baseRowHeight = `calc(${totalAvailableHeight} / ${totalRows})`;
    
    // Apply row heights based on content and position
    Object.entries(rowComponents).forEach(([rowStr, rowComps]) => {
      const row = parseInt(rowStr);
      const isBottomRow = row === maxRow;
      
      // Check if row has charts that need enhancement
      const hasChartComponent = rowComps.some(comp => 
        comp.type === 'chart' || comp.type === 'heatmap' || 
        comp.type === 'funnel' || comp.type === 'scatter'
      );
      
      if (hasChartComponent) {
        // Enhanced height for chart rows, especially bottom ones
        const enhancementFactor = isBottomRow ? 1.4 : 1.2;
        rowHeights[row] = `calc(${baseRowHeight} * ${enhancementFactor})`;
      } else {
        // Standard height for KPI and other components
        rowHeights[row] = baseRowHeight;
      }
    });
    
    return { totalRows, rowHeights, rowComponents };
  };

  const gridStructure = getGridStructure();
  
  return (
    <div className="w-full h-full overflow-hidden">
      <div 
        className="w-full overflow-hidden"
        style={{ 
          height: calculateTotalAvailableHeight(),
          maxHeight: calculateTotalAvailableHeight()
        }}
      >
        <div 
          className="grid gap-2 w-full h-full overflow-hidden"
          style={{ 
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: Object.values(gridStructure.rowHeights).length > 0 
              ? Object.values(gridStructure.rowHeights).join(' ')
              : `repeat(${gridStructure.totalRows}, 1fr)`,
            height: '100%',
            maxHeight: '100%'
          }}
        >
          {components.map((component: any, index: number) => {
            const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
            
            // Use exact positioning from layout builder
            const colStart = component.position?.col || 1;
            const colSpan = component.position?.colSpan || component.span || 3;
            const rowStart = component.position?.row || 1;
            const rowSpan = component.position?.rowSpan || 1;
            
            // Get the actual row height for this component
            const currentRowHeight = gridStructure.rowHeights[rowStart];
            
            return (
              <div
                key={component.id}
                className="flex flex-col min-h-0 overflow-hidden"
                style={{ 
                  gridColumn: `${colStart} / span ${colSpan}`,
                  gridRow: `${rowStart} / span ${rowSpan}`,
                  height: '100%',
                  maxHeight: '100%'
                }}
              >
                <ComponentRenderer 
                  component={component}
                  visual={linkedVisual}
                  themeColors={themeColors}
                  mockData={mockData}
                  config={config}
                  allComponents={components}
                  containerHeight={currentRowHeight}
                  gridStructure={gridStructure}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
