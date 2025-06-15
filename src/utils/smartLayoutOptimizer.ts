
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

export const optimizeLayout = (components: LayoutComponent[]): OptimizedLayout => {
  // If components already have valid positions from the layout builder, use them exactly
  if (components && components.length > 0) {
    // Check if all components have valid positions (not all at 0,0)
    const hasValidPositions = components.some(c => 
      c.position && (c.position.row > 0 || c.position.col > 0)
    );
    
    if (hasValidPositions) {
      // Use exact positions from layout builder
      const positionedComponents = components.map(component => ({
        ...component,
        position: {
          row: (component.position?.row || 0) + 1, // Convert 0-based to 1-based
          col: (component.position?.col || 0) + 1, // Convert 0-based to 1-based
          rowSpan: component.position?.rowSpan || 1,
          colSpan: component.position?.colSpan || component.span || getComponentPreferredSpan(component.type, component.kpiCount)
        }
      }));
      
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
  return autoOptimizeLayout(components);
}

const getComponentPreferredSpan = (type: string, kpiCount?: number): number => {
  switch (type) {
    case 'kpi': 
      if (kpiCount) {
        return Math.min(12, Math.max(6, kpiCount * 3));
      }
      return 6;
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

const autoOptimizeLayout = (components: LayoutComponent[]): OptimizedLayout => {
  const optimizedComponents: LayoutComponent[] = [];
  const suggestions: string[] = [];
  let currentRow = 1;
  let currentCol = 1;
  let remainingCols = GRID_COLUMNS;

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
      remainingCols = GRID_COLUMNS;
      optimalSpan = Math.min(preferredSpan, GRID_COLUMNS);
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
      remainingCols = GRID_COLUMNS;
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
