
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
  
  // Fixed 16:9 aspect ratio canvas dimensions
  const getCanvasDimensions = () => {
    // Base width considering navigation
    const baseWidth = isLeftNav ? 'calc(100vw - 280px)' : '100vw';
    const baseHeight = isTopNav ? 'calc(100vh - 200px)' : 'calc(100vh - 100px)';
    
    // Calculate 16:9 aspect ratio constraints
    return {
      width: baseWidth,
      height: baseHeight,
      aspectRatio: '16 / 9',
      maxWidth: isLeftNav ? 'calc(100vw - 280px)' : '100vw',
      maxHeight: isTopNav ? 'calc(100vh - 200px)' : 'calc(100vh - 100px)'
    };
  };

  const canvasDimensions = getCanvasDimensions();
  
  // Calculate row height to fit exactly within 16:9 canvas
  const calculateRowHeight = () => {
    // For 16:9 ratio, height should be width/16*9
    // We need to fit all rows within this height
    return `calc(${canvasDimensions.height} / ${Math.max(gridRows, 4)})`;
  };

  const rowHeight = calculateRowHeight();
  
  return (
    <div 
      className="w-full h-full flex items-center justify-center overflow-hidden"
      style={{ 
        width: '100%',
        height: '100%',
        padding: isLeftNav ? '1rem' : '1rem'
      }}
    >
      {/* 16:9 Canvas Container */}
      <div 
        className="w-full h-full max-w-full max-h-full overflow-hidden"
        style={{ 
          aspectRatio: '16 / 9',
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <div 
          className="grid gap-3 w-full h-full"
          style={{ 
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: `repeat(${Math.max(gridRows, 4)}, 1fr)`,
            width: '100%',
            height: '100%',
            padding: '0.75rem'
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
    </div>
  );
};

export default DashboardGrid;
