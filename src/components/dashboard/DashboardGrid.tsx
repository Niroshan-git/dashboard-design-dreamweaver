
import ComponentRenderer from './ComponentRenderer';

interface DashboardGridProps {
  components: any[];
  visuals: any[];
  themeColors: any;
  mockData: any;
  config: any;
}

const DashboardGrid = ({ components, visuals, themeColors, mockData, config }: DashboardGridProps) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {components.map((component: any, index: number) => {
        const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
        
        return (
          <div
            key={component.id}
            className="flex flex-col"
            style={{ 
              gridColumn: `span ${component.span} / span ${component.span}`,
              gridRow: `span ${component.position?.rowSpan || 1} / span ${component.position?.rowSpan || 1}`,
              minHeight: component.type === 'kpi' ? '150px' : '300px'
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
