
import ComponentRenderer from './ComponentRenderer';

interface DashboardGridProps {
  components: any[];
  visuals: any[];
  themeColors: any;
  mockData: any;
  config: any;
}

const DashboardGrid = ({ components, visuals, themeColors, mockData, config }: DashboardGridProps) => {
  // Calculate exact grid layout to match layout preview
  const gridRows = Math.max(...components.map(c => (c.position?.row || 1) + (c.position?.rowSpan || 1) - 1), 4);
  
  // Calculate available canvas height and distribute to components
  const calculateDynamicHeights = () => {
    if (components.length === 0) return {};
    
    // Calculate total available height (viewport minus header/padding)
    const totalCanvasHeight = 'calc(100vh - 120px)';
    
    // Group components by row to calculate row heights
    const rowGroups: { [key: number]: any[] } = {};
    const rowHeights: { [key: number]: string } = {};
    
    components.forEach(component => {
      const row = component.position?.row || 1;
      if (!rowGroups[row]) rowGroups[row] = [];
      rowGroups[row].push(component);
    });
    
    // Calculate base height per row
    const baseRowHeight = `calc(${totalCanvasHeight} / ${gridRows})`;
    
    // First pass: Calculate row heights based on content
    Object.entries(rowGroups).forEach(([rowStr, rowComponents]) => {
      const row = parseInt(rowStr);
      const hasKPI = rowComponents.some(comp => comp.type === 'kpi');
      
      if (hasKPI) {
        // Rows with KPIs use standard height
        rowHeights[row] = baseRowHeight;
      } else {
        // Rows without KPIs can use enhanced height to fill gaps
        rowHeights[row] = `calc(${baseRowHeight} * 1.2)`;
      }
    });
    
    // Second pass: Redistribute remaining space to non-KPI rows
    const kpiRows = Object.keys(rowGroups).filter(row => 
      rowGroups[parseInt(row)].some(comp => comp.type === 'kpi')
    ).length;
    
    const nonKpiRows = gridRows - kpiRows;
    
    if (nonKpiRows > 0) {
      // Enhanced height for non-KPI rows to fill empty spaces
      const enhancedRowHeight = `calc((${totalCanvasHeight} - (${baseRowHeight} * ${kpiRows})) / ${nonKpiRows})`;
      
      Object.entries(rowGroups).forEach(([rowStr, rowComponents]) => {
        const row = parseInt(rowStr);
        const hasKPI = rowComponents.some(comp => comp.type === 'kpi');
        
        if (!hasKPI) {
          rowHeights[row] = enhancedRowHeight;
        }
      });
    }
    
    // Final pass: Assign heights to individual components
    const componentHeights: { [key: string]: string } = {};
    
    Object.entries(rowGroups).forEach(([rowStr, rowComponents]) => {
      const row = parseInt(rowStr);
      const rowHeight = rowHeights[row];
      
      rowComponents.forEach(comp => {
        const rowSpan = comp.position?.rowSpan || 1;
        if (rowSpan > 1) {
          // Multi-row components get proportional height
          componentHeights[comp.id] = `calc(${rowHeight} * ${rowSpan})`;
        } else {
          componentHeights[comp.id] = rowHeight;
        }
      });
    });
    
    return componentHeights;
  };
  
  const dynamicHeights = calculateDynamicHeights();
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* 16:9 Canvas Container - Full utilization */}
      <div 
        className="w-full h-full max-w-full max-h-full"
        style={{ 
          aspectRatio: '16 / 9',
          width: '100%',
          height: '100%'
        }}
      >
        <div 
          className="grid gap-2 w-full h-full"
          style={{ 
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: `repeat(${Math.max(gridRows, 4)}, 1fr)`,
            width: '100%',
            height: '100%'
          }}
        >
          {components.map((component: any, index: number) => {
            const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
            
            // Use exact positioning from layout builder to match layout preview
            const colStart = component.position?.col || 1;
            const colSpan = component.position?.colSpan || component.span || 3;
            const rowStart = component.position?.row || 1;
            const rowSpan = component.position?.rowSpan || 1;
            
            return (
              <div
                key={component.id}
                className="flex flex-col min-h-0 overflow-hidden"
                style={{ 
                  gridColumn: `${colStart} / span ${colSpan}`,
                  gridRow: `${rowStart} / span ${rowSpan}`,
                }}
              >
                <ComponentRenderer 
                  component={component}
                  linkedVisual={linkedVisual}
                  themeColors={themeColors}
                  mockData={mockData}
                  config={config}
                  allComponents={components}
                  dynamicHeight={dynamicHeights[component.id]}
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
