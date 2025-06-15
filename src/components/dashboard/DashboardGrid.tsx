
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
  const gridRows = Math.max(...components.map(c => (c.position?.row || 1) + (c.position?.rowSpan || 1) - 1));
  
  return (
    <div 
      className="grid gap-4 w-full"
      style={{ 
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: `repeat(${gridRows}, minmax(200px, auto))`,
        minHeight: `${gridRows * 220}px`
      }}
    >
      {components.map((component: any, index: number) => {
        const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
        
        return (
          <div
            key={component.id}
            className="flex flex-col"
            style={{ 
              gridColumn: `${component.position?.col || 1} / span ${component.position?.colSpan || component.span}`,
              gridRow: `${component.position?.row || 1} / span ${component.position?.rowSpan || 1}`,
              minHeight: component.type === 'kpi' ? '180px' : component.type === 'table' ? '400px' : '300px'
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
