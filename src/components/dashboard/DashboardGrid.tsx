
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
  
  // Advanced height calculation system
  const calculateAdvancedHeights = () => {
    if (components.length === 0) return {};
    
    // Total available canvas height
    const totalCanvasHeight = 'calc(100vh - 120px)';
    
    // Group components by row and analyze positioning
    const rowGroups: { [key: number]: any[] } = {};
    const componentHeights: { [key: string]: string } = {};
    
    // Group components by row
    components.forEach(component => {
      const row = component.position?.row || 1;
      if (!rowGroups[row]) rowGroups[row] = [];
      rowGroups[row].push(component);
    });
    
    // Sort components in each row by column position
    Object.keys(rowGroups).forEach(rowStr => {
      const row = parseInt(rowStr);
      rowGroups[row].sort((a, b) => (a.position?.col || 1) - (b.position?.col || 1));
    });
    
    // Calculate base row height
    const baseRowHeight = `calc(${totalCanvasHeight} / ${gridRows})`;
    
    // Analyze each row for component relationships and sizing
    Object.entries(rowGroups).forEach(([rowStr, rowComponents]) => {
      const row = parseInt(rowStr);
      
      // Find KPI and non-KPI components in this row
      const kpiComponents = rowComponents.filter(comp => comp.type === 'kpi');
      const nonKpiComponents = rowComponents.filter(comp => comp.type !== 'kpi');
      
      if (kpiComponents.length === 0) {
        // Row with no KPIs - components can use enhanced height
        const enhancedHeight = `calc(${baseRowHeight} * 1.8)`;
        rowComponents.forEach(comp => {
          const rowSpan = comp.position?.rowSpan || 1;
          componentHeights[comp.id] = rowSpan > 1 ? `calc(${enhancedHeight} * ${rowSpan})` : enhancedHeight;
        });
      } else {
        // Row with KPIs - apply complex logic
        rowComponents.forEach((comp, index) => {
          if (comp.type === 'kpi') {
            // Check if KPI comes after a chart in the same row
            const hasChartBefore = rowComponents.slice(0, index).some(c => c.type !== 'kpi');
            
            if (hasChartBefore) {
              // KPI after chart - match chart height and enhance KPI content
              const chartHeight = `calc(${baseRowHeight} * 1.5)`;
              componentHeights[comp.id] = chartHeight;
            } else {
              // Standard KPI height
              componentHeights[comp.id] = baseRowHeight;
            }
          } else {
            // Non-KPI component in row with KPIs
            const hasKpiBefore = rowComponents.slice(0, index).some(c => c.type === 'kpi');
            
            if (hasKpiBefore) {
              // Chart after KPI - use KPI height
              componentHeights[comp.id] = baseRowHeight;
            } else {
              // Chart before KPI - use enhanced height
              const enhancedHeight = `calc(${baseRowHeight} * 1.5)`;
              componentHeights[comp.id] = enhancedHeight;
            }
          }
        });
      }
    });
    
    // Check for rows that need vertical expansion to fill canvas
    const usedRows = Object.keys(rowGroups).length;
    if (usedRows < gridRows) {
      // Redistribute extra space to existing components
      const extraSpacePerRow = `calc((${totalCanvasHeight} - (${baseRowHeight} * ${usedRows})) / ${usedRows})`;
      
      Object.keys(componentHeights).forEach(compId => {
        const currentHeight = componentHeights[compId];
        componentHeights[compId] = `calc(${currentHeight} + ${extraSpacePerRow})`;
      });
    }
    
    return componentHeights;
  };
  
  const dynamicHeights = calculateAdvancedHeights();
  
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
