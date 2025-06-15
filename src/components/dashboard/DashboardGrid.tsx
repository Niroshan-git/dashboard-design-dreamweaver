
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
    
    // Calculate available canvas height (subtract header and navigation space)
    const headerHeight = 80; // Dashboard header height
    const navigationHeight = config.showTopNavigation ? 60 : 0; // Top navigation if enabled
    const padding = 40; // Overall padding
    const totalAvailableHeight = `calc(100vh - ${headerHeight + navigationHeight + padding}px)`;
    
    // Group components by row
    const rowGroups: { [key: number]: any[] } = {};
    const componentHeights: { [key: string]: string } = {};
    
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
    const baseRowHeight = `calc(${totalAvailableHeight} / ${gridRows})`;
    
    // Find bottom row components that need to fill remaining space
    const maxRow = Math.max(...Object.keys(rowGroups).map(r => parseInt(r)));
    
    // Process each row
    Object.entries(rowGroups).forEach(([rowStr, rowComponents]) => {
      const row = parseInt(rowStr);
      const isBottomRow = row === maxRow;
      
      // Find KPI and chart components in this row
      const kpiComponents = rowComponents.filter(comp => comp.type === 'kpi');
      const chartComponents = rowComponents.filter(comp => comp.type !== 'kpi');
      
      rowComponents.forEach((comp, index) => {
        if (comp.type === 'kpi') {
          // KPI cards ALWAYS use base height - never enhanced
          componentHeights[comp.id] = baseRowHeight;
        } else {
          // Chart component logic
          const isFirstInRow = index === 0;
          const hasKpiAfter = rowComponents.slice(index + 1).some(c => c.type === 'kpi');
          const hasKpiBefore = rowComponents.slice(0, index).some(c => c.type === 'kpi');
          
          if (isFirstInRow && !hasKpiBefore) {
            // Chart is first in row - use enhanced height
            const enhancementFactor = isBottomRow ? 1.8 : 1.5;
            componentHeights[comp.id] = `calc(${baseRowHeight} * ${enhancementFactor})`;
          } else if (hasKpiAfter || hasKpiBefore) {
            // Chart has KPI neighbors - match KPI height
            componentHeights[comp.id] = baseRowHeight;
          } else if (isBottomRow) {
            // Bottom row chart without KPIs - fill remaining space
            componentHeights[comp.id] = `calc(${baseRowHeight} * 1.8)`;
          } else {
            // Regular chart
            componentHeights[comp.id] = `calc(${baseRowHeight} * 1.3)`;
          }
        }
      });
    });
    
    // Special handling for bottom row - ensure it fills remaining canvas space
    if (rowGroups[maxRow]) {
      const bottomRowCharts = rowGroups[maxRow].filter(comp => comp.type !== 'kpi');
      bottomRowCharts.forEach(comp => {
        // Calculate extra space for bottom row
        const extraSpace = `calc((${totalAvailableHeight} - (${baseRowHeight} * ${maxRow - 1})) - ${baseRowHeight})`;
        componentHeights[comp.id] = `calc(${baseRowHeight} + ${extraSpace})`;
      });
    }
    
    return componentHeights;
  };
  
  const dynamicHeights = calculateAdvancedHeights();
  
  return (
    <div className="w-full h-full">
      {/* Full height container */}
      <div 
        className="w-full"
        style={{ 
          height: 'calc(100vh - 120px)', // Account for header and padding
          maxHeight: 'calc(100vh - 120px)'
        }}
      >
        <div 
          className="grid gap-2 w-full h-full"
          style={{ 
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: `repeat(${Math.max(gridRows, 4)}, 1fr)`,
            height: '100%'
          }}
        >
          {components.map((component: any, index: number) => {
            const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
            
            // Use exact positioning from layout builder
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
