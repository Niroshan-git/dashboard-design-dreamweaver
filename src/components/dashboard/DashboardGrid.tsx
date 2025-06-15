
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
      const chartComponents = rowComponents.filter(comp => comp.type !== 'kpi');
      
      if (kpiComponents.length === 0) {
        // Row with no KPIs - charts can use enhanced height
        const enhancedHeight = `calc(${baseRowHeight} * 1.8)`;
        chartComponents.forEach(comp => {
          const rowSpan = comp.position?.rowSpan || 1;
          componentHeights[comp.id] = rowSpan > 1 ? `calc(${enhancedHeight} * ${rowSpan})` : enhancedHeight;
        });
      } else {
        // Row with KPIs - apply specific logic
        rowComponents.forEach((comp, index) => {
          if (comp.type === 'kpi') {
            // KPI cards ALWAYS use standard height - never enhanced
            componentHeights[comp.id] = baseRowHeight;
          } else {
            // Chart component - check position relative to KPIs
            const firstComponent = rowComponents[0];
            
            if (comp === firstComponent) {
              // Chart is first in row - use enhanced height
              const enhancedHeight = `calc(${baseRowHeight} * 1.5)`;
              componentHeights[comp.id] = enhancedHeight;
            } else {
              // Chart after KPI - use standard height to match KPI
              componentHeights[comp.id] = baseRowHeight;
            }
          }
        });
      }
    });
    
    // Fill remaining canvas space by distributing extra height
    const usedRows = Object.keys(rowGroups).length;
    if (usedRows < gridRows) {
      // Calculate extra space to distribute
      const extraSpacePerRow = `calc((${totalCanvasHeight} - (${baseRowHeight} * ${usedRows})) / ${usedRows})`;
      
      // Only add extra space to non-KPI components (charts only)
      Object.keys(componentHeights).forEach(compId => {
        const component = components.find(c => c.id === compId);
        if (component && component.type !== 'kpi') {
          const currentHeight = componentHeights[compId];
          componentHeights[compId] = `calc(${currentHeight} + ${extraSpacePerRow})`;
        }
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
