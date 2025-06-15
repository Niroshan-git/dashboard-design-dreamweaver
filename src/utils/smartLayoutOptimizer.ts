
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

export const optimizeLayout = (components: LayoutComponent[], config?: any): OptimizedLayout => {
  // If components already have valid positions from the layout builder, use them exactly
  if (components && components.length > 0) {
    // Check if all components have valid positions (not all at 0,0)
    const hasValidPositions = components.some(c => 
      c.position && (c.position.row > 0 || c.position.col > 0)
    );
    
    if (hasValidPositions) {
      // Use exact positions from layout builder but adjust for navigation space
      const positionedComponents = components.map(component => {
        const adjustedPosition = adjustPositionForNavigation(component.position!, config);
        
        return {
          ...component,
          position: adjustedPosition
        };
      });
      
      const totalRows = Math.max(1, ...positionedComponents.map(c => 
        (c.position!.row) + (c.position!.rowSpan || 1) - 1
      ));
      
      return {
        components: positionedComponents,
        suggestions: [], // No suggestions needed as layout is manually configured
        totalRows: totalRows,
      };
    }
  }

  // Fallback to auto-optimization if no valid positions
  return autoOptimizeLayout(components, config);
}

const adjustPositionForNavigation = (position: any, config?: any) => {
  if (!position) return position;
  
  const navigationStyle = config?.navigationStyle || config?.navigationPosition;
  const layoutDimension = config?.layoutDimension || '16:9';
  
  // Calculate available canvas space based on navigation
  let adjustedColSpan = position.colSpan || position.span || 3;
  let adjustedRowSpan = position.rowSpan || 1;
  
  // For left navigation, reduce horizontal space utilization
  if (navigationStyle === 'left' || navigationStyle === 'left-full' || navigationStyle === 'left-collapsible') {
    // Account for left sidebar - reduce effective canvas width
    const effectiveColumns = Math.floor(GRID_COLUMNS * 0.85); // 85% of width available
    adjustedColSpan = Math.min(adjustedColSpan, effectiveColumns);
  }
  
  // For top navigation, account for height reduction
  if (navigationStyle === 'top' || navigationStyle?.startsWith('top-')) {
    // Top nav reduces vertical space, might need taller components
    if (layoutDimension === '16:9') {
      adjustedRowSpan = Math.max(adjustedRowSpan, 1);
    }
  }
  
  // Ensure KPIs fit properly - max 4 KPIs vertically for optimal display
  if (position.type === 'kpi') {
    const maxKpiRows = 4;
    adjustedRowSpan = Math.min(adjustedRowSpan, Math.ceil(12 / maxKpiRows));
  }
  
  return {
    row: position.row,
    col: position.col,
    rowSpan: adjustedRowSpan,
    colSpan: adjustedColSpan
  };
};

const getComponentPreferredSpan = (type: string, kpiCount?: number): number => {
  switch (type) {
    case 'kpi': 
      if (kpiCount) {
        // Ensure max 4 KPIs can fit vertically
        return Math.min(12, Math.max(3, Math.floor(12 / Math.min(kpiCount, 4))));
      }
      return 3; // Smaller default for better vertical stacking
    case 'chart': return 6;
    case 'table': return 12;
    case 'text': return 8;
    case 'progress': return 8;
    case 'image': return 6;
    case 'heatmap': return 8;
    case 'funnel': return 6;
    case 'scatter': return 6;
    default: return 6;
  }
};

const autoOptimizeLayout = (components: LayoutComponent[], config?: any): OptimizedLayout => {
  const optimizedComponents: LayoutComponent[] = [];
  const suggestions: string[] = [];
  let currentRow = 1;
  let currentCol = 1;
  let remainingCols = GRID_COLUMNS;

  // Adjust for navigation space
  const navigationStyle = config?.navigationStyle || config?.navigationPosition;
  if (navigationStyle === 'left' || navigationStyle === 'left-full' || navigationStyle === 'left-collapsible') {
    remainingCols = Math.floor(GRID_COLUMNS * 0.85);
  }

  // Sort components by priority
  const sortedComponents = [...components].sort((a, b) => {
    const priority = { 
      kpi: 1, 
      text: 1,
      chart: 2, 
      progress: 3, 
      image: 4,
      table: 5, 
      heatmap: 6, 
      funnel: 7, 
      scatter: 8 
    };
    return (priority[a.type as keyof typeof priority] || 9) - (priority[b.type as keyof typeof priority] || 9);
  });

  for (let i = 0; i < sortedComponents.length; i++) {
    const component = sortedComponents[i];
    const preferredSpan = getComponentPreferredSpan(component.type, component.kpiCount);
    
    let optimalSpan = Math.min(preferredSpan, remainingCols);
    
    // If component can't fit in current row, move to next row
    if (remainingCols < 3) {
      currentRow++;
      currentCol = 1;
      remainingCols = navigationStyle === 'left' ? Math.floor(GRID_COLUMNS * 0.85) : GRID_COLUMNS;
      optimalSpan = Math.min(preferredSpan, remainingCols);
    }
    
    // Add optimized component
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

    // Update position tracking
    currentCol += optimalSpan;
    remainingCols -= optimalSpan;

    // Move to next row if no space left
    if (remainingCols === 0) {
      currentRow++;
      currentCol = 1;
      remainingCols = navigationStyle === 'left' ? Math.floor(GRID_COLUMNS * 0.85) : GRID_COLUMNS;
    }
  }

  return {
    components: optimizedComponents,
    suggestions,
    totalRows: currentRow
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
