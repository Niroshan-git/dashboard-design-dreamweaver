
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
  
  // Navigation configuration
  const navigationStyle = config?.navigationStyle || config?.navigationPosition;
  const isLeftNav = navigationStyle === 'left' || navigationStyle === 'left-full' || navigationStyle === 'left-collapsible';
  const isTopNav = navigationStyle === 'top' || navigationStyle?.startsWith('top-');
  
  // Fixed canvas dimensions for 16:9 aspect ratio
  const getCanvasDimensions = () => {
    if (isLeftNav) {
      return {
        width: '100%',
        height: 'calc(100vh - 120px)',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 120px)'
      };
    } else if (isTopNav) {
      return {
        width: '100%',
        height: 'calc(100vh - 160px)',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 160px)'
      };
    } else {
      return {
        width: '100%',
        height: 'calc(100vh - 120px)',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 120px)'
      };
    }
  };

  const canvasDimensions = getCanvasDimensions();
  
  // Calculate row height to maintain proportions and fit all components
  const calculateRowHeight = () => {
    const minRowHeight = isTopNav ? 120 : 140;
    const availableHeight = isTopNav ? 'calc((100vh - 160px)' : 'calc((100vh - 120px)';
    return `max(${minRowHeight}px, ${availableHeight} / ${Math.max(gridRows, 4)}))`;
  };

  const rowHeight = calculateRowHeight();
  
  return (
    <div 
      className="w-full overflow-hidden"
      style={{ 
        width: canvasDimensions.width,
        height: canvasDimensions.height,
        maxWidth: canvasDimensions.maxWidth,
        maxHeight: canvasDimensions.maxHeight
      }}
    >
      <div 
        className="grid gap-4 w-full h-full"
        style={{ 
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: `repeat(${Math.max(gridRows, 4)}, ${rowHeight})`,
          padding: isLeftNav ? '0 1rem' : '1rem',
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardGrid;
