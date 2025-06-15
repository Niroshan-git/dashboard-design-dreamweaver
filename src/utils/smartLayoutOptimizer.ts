
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
const CANVAS_ASPECT_RATIO = 16 / 9; // Default 16:9 aspect ratio

export const optimizeLayout = (components: LayoutComponent[], config?: any): OptimizedLayout => {
  // If components already have valid positions from the layout builder, use them exactly
  if (components && components.length > 0) {
    // Check if all components have valid positions (not all at 0,0)
    const hasValidPositions = components.some(c => 
      c.position && (c.position.row > 0 || c.position.col > 0)
    );
    
    if (hasValidPositions) {
      // Process components to group consecutive KPIs horizontally
      const processedComponents = groupConsecutiveKPIs(components);
      
      // Use exact positions from layout builder but ensure they fit 16:9 canvas
      const positionedComponents = processedComponents.map(component => {
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
      
      // Ensure canvas fits 16:9 ratio by adjusting component heights if needed
      const adjustedComponents = adjustForCanvasRatio(positionedComponents, totalRows, config);
      
      return {
        components: adjustedComponents,
        suggestions: [], // No suggestions needed as layout is manually configured
        totalRows: Math.max(totalRows, calculateMinRowsFor16x9(config)),
      };
    }
  }

  // Fallback to auto-optimization if no valid positions
  return autoOptimizeLayout(components, config);
}

const groupConsecutiveKPIs = (components: LayoutComponent[]): LayoutComponent[] => {
  const result: LayoutComponent[] = [];
  let i = 0;
  
  while (i < components.length) {
    const component = components[i];
    
    if (component.type === 'kpi') {
      // Look for consecutive KPIs in the same row
      const consecutiveKPIs = [component];
      let j = i + 1;
      
      while (j < components.length && 
             components[j].type === 'kpi' && 
             components[j].position?.row === component.position?.row) {
        consecutiveKPIs.push(components[j]);
        j++;
      }
      
      if (consecutiveKPIs.length > 1) {
        // Create a single KPI component that represents multiple KPIs
        const groupedKPI = {
          ...component,
          kpiCount: consecutiveKPIs.length,
          span: 12, // Take full width for horizontal arrangement
          position: {
            ...component.position!,
            colSpan: 12
          }
        };
        result.push(groupedKPI);
        i = j; // Skip the processed KPIs
      } else {
        result.push(component);
        i++;
      }
    } else {
      result.push(component);
      i++;
    }
  }
  
  return result;
};

const calculateMinRowsFor16x9 = (config?: any): number => {
  // Calculate minimum rows needed to maintain 16:9 aspect ratio
  const navigationStyle = config?.navigationStyle || 'left-full';
  const isLeftNav = navigationStyle === 'left' || navigationStyle === 'left-full' || navigationStyle === 'left-collapsible';
  const isTopNav = navigationStyle === 'top' || navigationStyle?.startsWith('top-');
  
  // Adjust for navigation space
  if (isLeftNav) {
    return 4; // Minimum 4 rows for left navigation
  } else if (isTopNav) {
    return 5; // Minimum 5 rows for top navigation
  }
  
  return 4; // Default minimum rows
};

const adjustForCanvasRatio = (components: LayoutComponent[], totalRows: number, config?: any): LayoutComponent[] => {
  const minRows = calculateMinRowsFor16x9(config);
  
  if (totalRows < minRows) {
    // Adjust component heights to fill the canvas properly
    return components.map(component => {
      if (component.type === 'kpi' && component.kpiCount && component.kpiCount > 1) {
        // KPI groups should be compact
        return {
          ...component,
          position: {
            ...component.position!,
            rowSpan: 1 // Keep KPIs compact
          }
        };
      }
      return component;
    });
  }
  
  return components;
};

const getComponentPreferredSpan = (type: string, kpiCount?: number): number => {
  switch (type) {
    case 'kpi': 
      if (kpiCount && kpiCount > 1) {
        return 12; // Full width for multiple KPIs arranged horizontally
      }
      return 3; // Default span for single KPI
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

const autoOptimizeLayout = (components: LayoutComponent[], config?: any): OptimizedLayout => {
  const optimizedComponents: LayoutComponent[] = [];
  const suggestions: string[] = [];
  let currentRow = 1;
  let currentCol = 1;
  let remainingCols = GRID_COLUMNS;

  // Group consecutive KPIs first
  const processedComponents = groupConsecutiveComponentsByType(components);

  for (let i = 0; i < processedComponents.length; i++) {
    const component = processedComponents[i];
    const preferredSpan = getComponentPreferredSpan(component.type, component.kpiCount);
    
    let optimalSpan = Math.min(preferredSpan, remainingCols);
    
    // Special handling for KPI groups
    if (component.type === 'kpi' && component.kpiCount && component.kpiCount > 1) {
      optimalSpan = 12; // Full width for horizontal KPI arrangement
      
      if (remainingCols < 12) {
        currentRow++;
        currentCol = 1;
        remainingCols = GRID_COLUMNS;
      }
    } else if (remainingCols < 3) {
      currentRow++;
      currentCol = 1;
      remainingCols = GRID_COLUMNS;
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

const groupConsecutiveComponentsByType = (components: LayoutComponent[]): LayoutComponent[] => {
  const result: LayoutComponent[] = [];
  let i = 0;
  
  while (i < components.length) {
    const component = components[i];
    
    if (component.type === 'kpi') {
      // Look for consecutive KPIs
      const consecutiveKPIs = [component];
      let j = i + 1;
      
      while (j < components.length && components[j].type === 'kpi') {
        consecutiveKPIs.push(components[j]);
        j++;
      }
      
      if (consecutiveKPIs.length > 1) {
        // Create a grouped KPI component
        const groupedKPI = {
          ...component,
          kpiCount: Math.min(consecutiveKPIs.length, MAX_HORIZONTAL_KPIS),
          span: 12
        };
        result.push(groupedKPI);
        i = j;
      } else {
        result.push(component);
        i++;
      }
    } else {
      result.push(component);
      i++;
    }
  }
  
  return result;
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
