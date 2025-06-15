
import ComponentRenderer from './ComponentRenderer';

interface DashboardGridProps {
  components: any[];
  visuals: any[];
  themeColors: any;
  mockData: any;
  config: any;
}

const DashboardGrid = ({ components, visuals, themeColors, mockData, config }: DashboardGridProps) => {
  // Calculate the exact same grid layout as the layout preview but account for navigation
  const gridRows = Math.max(...components.map(c => (c.position?.row || 1) + (c.position?.rowSpan || 1) - 1), 1);
  
  // Adjust grid based on navigation style
  const navigationStyle = config?.navigationStyle || config?.navigationPosition;
  const isLeftNav = navigationStyle === 'left' || navigationStyle === 'left-full' || navigationStyle === 'left-collapsible';
  const isTopNav = navigationStyle === 'top' || navigationStyle?.startsWith('top-');
  
  // Calculate effective canvas size
  const effectiveColumns = isLeftNav ? 12 : 12; // Keep 12 columns but components will be sized accordingly
  const minRowHeight = isTopNav ? '140px' : '150px'; // Slightly smaller rows for top nav
  
  return (
    <div 
      className="grid gap-4 w-full"
      style={{ 
        gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)`,
        gridTemplateRows: `repeat(${gridRows}, minmax(${minRowHeight}, auto))`,
        minHeight: `${gridRows * (isTopNav ? 160 : 170)}px`,
        padding: isLeftNav ? '0 1rem' : '1rem'
      }}
    >
      {components.map((component: any, index: number) => {
        const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
        
        // Use exact positioning from optimizer
        const colStart = component.position?.col || 1;
        const colSpan = component.position?.colSpan || component.span || 3;
        const rowStart = component.position?.row || 1;
        const rowSpan = component.position?.rowSpan || 1;
        
        // Adjust KPI sizing for maximum 4 vertical KPIs
        const isKPI = component.type === 'kpi';
        const adjustedMinHeight = isKPI ? 
          (isTopNav ? '100px' : '120px') : 
          (component.type === 'table' ? '350px' : '250px');
        
        return (
          <div
            key={component.id}
            className="flex flex-col"
            style={{ 
              gridColumn: `${colStart} / span ${colSpan}`,
              gridRow: `${rowStart} / span ${rowSpan}`,
              minHeight: adjustedMinHeight
            }}
          >
            <ComponentRenderer 
              component={component}
              linkedVisual={linkedVisual}
              themeColors={themeColors}
              mockData={mockData}
              config={config}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardGrid;
