
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
const MAX_HORIZONTAL_KPIS = 4; // Maximum KPIs per row

export const optimizeLayout = (components: LayoutComponent[], config?: any): OptimizedLayout => {
  // If components already have valid positions from the layout builder, use them exactly
  if (components && components.length > 0) {
    // Check if all components have valid positions (not all at 0,0)
    const hasValidPositions = components.some(c => 
      c.position && (c.position.row > 0 || c.position.col > 0)
    );
    
    if (hasValidPositions) {
      // Use exact positions from layout builder - convert from 0-based to 1-based for display
      const positionedComponents = components.map(component => {
        if (!component.position) return component;
        
        return {
          ...component,
          position: {
            row: component.position.row + 1, // Convert to 1-based
            col: component.position.col + 1, // Convert to 1-based
            rowSpan: component.position.rowSpan || 1,
            colSpan: component.position.colSpan || component.span || 3
          }
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

const getComponentPreferredSpan = (type: string, kpiCount?: number): number => {
  switch (type) {
    case 'kpi': 
      if (kpiCount) {
        // Ensure max 4 KPIs horizontally - divide available columns by KPI count
        return Math.min(12, Math.max(3, Math.floor(12 / Math.min(kpiCount, MAX_HORIZONTAL_KPIS))));
      }
      return 3; // Default span for single KPI
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

  // Sort components by priority - KPIs first for horizontal arrangement
  const sortedComponents = [...components].sort((a, b) => {
    const priority = { 
      kpi: 1, 
      text: 2,
      chart: 3, 
      progress: 4, 
      image: 5,
      table: 6, 
      heatmap: 7, 
      funnel: 8, 
      scatter: 9 
    };
    return (priority[a.type as keyof typeof priority] || 10) - (priority[b.type as keyof typeof priority] || 10);
  });

  for (let i = 0; i < sortedComponents.length; i++) {
    const component = sortedComponents[i];
    const preferredSpan = getComponentPreferredSpan(component.type, component.kpiCount);
    
    let optimalSpan = Math.min(preferredSpan, remainingCols);
    
    // Special handling for KPIs to ensure horizontal arrangement
    if (component.type === 'kpi') {
      const kpiCount = component.kpiCount || 1;
      
      // For multiple KPIs, ensure they fit horizontally (max 4 per row)
      if (kpiCount > 1) {
        const kpisPerRow = Math.min(kpiCount, MAX_HORIZONTAL_KPIS);
        optimalSpan = Math.floor(12 / kpisPerRow);
        
        // If we can't fit all KPIs in current row, start new row
        if (remainingCols < optimalSpan * kpisPerRow) {
          currentRow++;
          currentCol = 1;
          remainingCols = GRID_COLUMNS;
        }
      } else {
        // Single KPI - use preferred span or fit in remaining space
        if (remainingCols < optimalSpan && remainingCols < 3) {
          currentRow++;
          currentCol = 1;
          remainingCols = GRID_COLUMNS;
          optimalSpan = Math.min(preferredSpan, remainingCols);
        }
      }
    } else {
      // Non-KPI components
      if (remainingCols < 3) {
        currentRow++;
        currentCol = 1;
        remainingCols = GRID_COLUMNS;
        optimalSpan = Math.min(preferredSpan, remainingCols);
      }
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
