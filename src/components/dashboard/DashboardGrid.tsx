
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
  
  // Navigation style configuration
  const navigationStyle = config?.navigationStyle || config?.navigationPosition;
  const isLeftNav = navigationStyle === 'left' || navigationStyle === 'left-full' || navigationStyle === 'left-collapsible';
  const isTopNav = navigationStyle === 'top' || navigationStyle?.startsWith('top-');
  
  // Calculate canvas dimensions to maintain 16:9 aspect ratio
  const getCanvasDimensions = () => {
    let canvasWidth = '100%';
    let canvasHeight = 'auto';
    
    if (isLeftNav) {
      // Left navigation reduces available width
      canvasWidth = '100%';
      canvasHeight = `calc(100vh - 120px)`; // Account for header and padding
    } else if (isTopNav) {
      // Top navigation reduces available height
      canvasWidth = '100%';
      canvasHeight = `calc(100vh - 160px)`; // Account for top nav and header
    } else {
      canvasWidth = '100%';
      canvasHeight = `calc(100vh - 120px)`;
    }
    
    return { canvasWidth, canvasHeight };
  };

  const { canvasWidth, canvasHeight } = getCanvasDimensions();
  
  // Calculate row height to fit 16:9 aspect ratio
  const calculateRowHeight = () => {
    if (isTopNav) {
      return `max(120px, calc((100vh - 160px) / ${Math.max(gridRows, 4)}))`;
    } else {
      return `max(140px, calc((100vh - 120px) / ${Math.max(gridRows, 4)}))`;
    }
  };

  const rowHeight = calculateRowHeight();
  
  return (
    <div 
      className="w-full overflow-hidden"
      style={{ 
        width: canvasWidth,
        height: canvasHeight,
        maxHeight: isTopNav ? 'calc(100vh - 160px)' : 'calc(100vh - 120px)'
      }}
    >
      <div 
        className="grid gap-4 w-full h-full"
        style={{ 
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: `repeat(${Math.max(gridRows, 4)}, ${rowHeight})`,
          padding: isLeftNav ? '0 1rem' : '1rem',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {components.map((component: any, index: number) => {
          const linkedVisual = visuals.find((v: any) => v.id === component.visualId);
          
          // Use exact positioning from optimizer
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
