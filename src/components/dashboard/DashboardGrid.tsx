
import ComponentRenderer from './ComponentRenderer';

interface DashboardGridProps {
  components: any[];
  visuals: any[];
  themeColors: any;
  mockData: any;
  config: any;
}

const DashboardGrid = ({ components, visuals, themeColors, mockData, config }: DashboardGridProps) => {
  // Calculate the exact same grid layout as the layout preview
  const gridRows = Math.max(...components.map(c => (c.position?.row || 1) + (c.position?.rowSpan || 1) - 1), 1);
  
  return (
    <div 
      className="grid gap-4 w-full p-4"
      style={{ 
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: `repeat(${gridRows}, minmax(150px, auto))`,
        minHeight: `${gridRows * 170}px`
      }}
    >
      {components.map((component: any, index: number) => {
        const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
        
        // Calculate exact positioning to match layout preview
        const colStart = component.position?.col || 1;
        const colSpan = component.position?.colSpan || component.span || 3;
        const rowStart = component.position?.row || 1;
        const rowSpan = component.position?.rowSpan || 1;
        
        return (
          <div
            key={component.id}
            className="flex flex-col"
            style={{ 
              gridColumn: `${colStart} / span ${colSpan}`,
              gridRow: `${rowStart} / span ${rowSpan}`,
              minHeight: component.type === 'kpi' ? '120px' : component.type === 'table' ? '350px' : '250px'
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
