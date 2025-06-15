
export interface LayoutComponent {
  id: string;
  type: string;
  span: number;
  kpiCount?: number;
  chartType?: string;
  visualId?: string;
  textContent?: string;
  count?: number;
  position?: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  };
}

export interface OptimizedLayout {
  components: LayoutComponent[];
  suggestions: string[];
  totalRows: number;
}

const GRID_COLUMNS = 12;
const CANVAS_ASPECT_RATIO = 16 / 9;

export const optimizeLayout = (components: LayoutComponent[], config?: any): OptimizedLayout => {
  if (components && components.length > 0) {
    const hasValidPositions = components.some(c => 
      c.position && (c.position.row > 0 || c.position.col > 0)
    );
    
    if (hasValidPositions) {
      // Use exact positions from layout builder and ensure they match layout preview
      const positionedComponents = components.map(component => {
        if (!component.position) return component;
        
        // Convert to 1-based positioning and ensure exact match with layout preview
        return {
          ...component,
          position: {
            row: component.position.row + 1,
            col: component.position.col + 1,
            rowSpan: component.position.rowSpan || 1,
            colSpan: component.position.colSpan || component.span || getDefaultSpan(component.type)
          }
        };
      });
      
      const totalRows = Math.max(1, ...positionedComponents.map(c => 
        (c.position?.row || 1) + (c.position?.rowSpan || 1) - 1
      ));
      
      const minRows = calculateMinRowsFor16x9(config);
      const finalRows = Math.max(totalRows, minRows);
      
      return {
        components: positionedComponents,
        suggestions: [],
        totalRows: finalRows,
      };
    }
  }

  return autoOptimizeLayout(components, config);
}

const getDefaultSpan = (type: string): number => {
  switch (type) {
    case 'kpi': return 3;
    case 'chart': return 6;
    case 'table': return 12;
    case 'text': return 8;
    case 'progress': return 8;
    case 'image': return 6;
    case 'heatmap': return 6;
    case 'funnel': return 6;
    case 'scatter': return 6;
    default: return 6;
  }
};

const calculateMinRowsFor16x9 = (config?: any): number => {
  const navigationStyle = config?.navigationStyle || 'left-full';
  const isLeftNav = navigationStyle === 'left' || navigationStyle === 'left-full' || navigationStyle === 'left-collapsible';
  const isTopNav = navigationStyle === 'top' || navigationStyle?.startsWith('top-');
  
  if (isLeftNav) {
    return 4; // Minimum 4 rows for left navigation to maintain 16:9
  } else if (isTopNav) {
    return 5; // Minimum 5 rows for top navigation
  }
  
  return 4;
};

const autoOptimizeLayout = (components: LayoutComponent[], config?: any): OptimizedLayout => {
  const optimizedComponents: LayoutComponent[] = [];
  const suggestions: string[] = [];
  let currentRow = 1;
  let currentCol = 1;
  let remainingCols = GRID_COLUMNS;

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const preferredSpan = getDefaultSpan(component.type);
    
    let optimalSpan = Math.min(preferredSpan, remainingCols);
    
    if (remainingCols < 3) {
      currentRow++;
      currentCol = 1;
      remainingCols = GRID_COLUMNS;
      optimalSpan = Math.min(preferredSpan, remainingCols);
    }
    
    optimizedComponents.push({
      ...component,
      span: optimalSpan,
      position: {
        row: currentRow,
        col: currentCol,
        rowSpan: component.type === 'table' ? 2 : 1,
        colSpan: optimalSpan
      }
    });

    currentCol += optimalSpan;
    remainingCols -= optimalSpan;

    if (remainingCols === 0) {
      currentRow++;
      currentCol = 1;
      remainingCols = GRID_COLUMNS;
    }
  }

  const finalRows = Math.max(currentRow, calculateMinRowsFor16x9(config));

  return {
    components: optimizedComponents,
    suggestions,
    totalRows: finalRows
  };
};

export const generateLayoutSuggestions = (currentComponents: LayoutComponent[], availableVisuals: any[]): string[] => {
  const suggestions: string[] = [];
  const componentTypes = currentComponents.map(c => c.type);

  if (!componentTypes.includes('kpi')) {
    suggestions.push("Add KPI cards to show key metrics at a glance");
  }
  if (!componentTypes.includes('chart')) {
    suggestions.push("Add charts to visualize data trends");
  }
  if (currentComponents.length > 3 && !componentTypes.includes('table')) {
    suggestions.push("Consider adding a data table for detailed information");
  }

  return suggestions;
};
