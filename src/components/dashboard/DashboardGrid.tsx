
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
    
    // Group components by row to calculate row heights
    const rowGroups: { [key: number]: any[] } = {};
    components.forEach(component => {
      const row = component.position?.row || 1;
      if (!rowGroups[row]) rowGroups[row] = [];
      rowGroups[row].push(component);
    });
    
    const componentHeights: { [key: string]: string } = {};
    
    Object.entries(rowGroups).forEach(([rowStr, rowComponents]) => {
      const row = parseInt(rowStr);
      
      // Check if this row has KPI cards
      const hasKPI = rowComponents.some(comp => comp.type === 'kpi');
      const hasNonKPI = rowComponents.some(comp => comp.type !== 'kpi');
      
      // Calculate height based on row content and canvas utilization
      let baseHeight = `calc((100vh - 120px) / ${gridRows})`;  // Distribute available height
      
      if (hasKPI && hasNonKPI) {
        // Mixed row: charts/other components match KPI height
        rowComponents.forEach(comp => {
          if (comp.type === 'kpi') {
            componentHeights[comp.id] = baseHeight;
          } else {
            componentHeights[comp.id] = baseHeight; // Match KPI height in mixed rows
          }
        });
      } else if (hasKPI && !hasNonKPI) {
        // Only KPIs: use standard height
        rowComponents.forEach(comp => {
          componentHeights[comp.id] = baseHeight;
        });
      } else {
        // No KPIs: components can use enhanced height
        const enhancedHeight = `calc(${baseHeight} * 1.5)`;
        rowComponents.forEach(comp => {
          componentHeights[comp.id] = gridRows > 3 ? baseHeight : enhancedHeight;
        });
      }
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
