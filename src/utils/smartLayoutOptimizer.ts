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

const getComponentMinSpan = (type: string): number => {
  switch (type) {
    case 'kpi': return 3;
    case 'chart': return 4;
    case 'table': return 6;
    case 'text': return 3;
    case 'progress': return 4;
    case 'image': return 4;
    case 'heatmap': return 6;
    case 'funnel': return 4;
    case 'scatter': return 4;
    default: return 3;
  }
};

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

const canComponentsShareRow = (type1: string, type2: string): boolean => {
  const exclusiveTypes = ['table'];
  return !exclusiveTypes.includes(type1) && !exclusiveTypes.includes(type2);
};

const shouldForceSameRow = (components: LayoutComponent[], currentIndex: number): boolean => {
  const current = components[currentIndex];
  if (currentIndex === 0) return false;
  
  const previous = components[currentIndex - 1];
  
  // Force KPIs and text components to be on the same row if they can fit
  if ((current.type === 'kpi' || current.type === 'text') && 
      (previous.type === 'kpi' || previous.type === 'text')) {
    return true;
  }
  
  return false;
};

export const optimizeLayout = (components: LayoutComponent[]): OptimizedLayout => {
  // If components already have positions from the layout builder, respect them.
  // This ensures the main preview exactly matches the layout preview.
  if (components && components.length > 0 && components.every(c => c.position)) {
    const totalRows = Math.max(0, ...components.map(c => (c.position!.row || 0) + (c.position!.rowSpan || 1) - 1));
    return {
      components: components,
      suggestions: [], // No suggestions needed as layout is manually configured
      totalRows: totalRows,
    };
  }

  const optimizedComponents: LayoutComponent[] = [];
  const suggestions: string[] = [];
  let currentRow = 1;
  let currentCol = 1;
  let remainingCols = GRID_COLUMNS;

  // Sort components by priority but keep similar types together
  const sortedComponents = [...components].sort((a, b) => {
    const priority = { 
      kpi: 1, 
      text: 1,  // Same priority as KPI to keep them together
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
    const minSpan = getComponentMinSpan(component.type);
    const preferredSpan = getComponentPreferredSpan(component.type, component.kpiCount);
    
    // Check if we should force this component to be on the same row
    const forceSameRow = shouldForceSameRow(sortedComponents, i);
    
    // Calculate optimal span based on remaining space
    let optimalSpan = Math.min(preferredSpan, remainingCols);
    
    // Special handling for text components - adjust based on content length
    if (component.type === 'text' && component.textContent) {
      const contentLength = component.textContent.length;
      if (contentLength < 50) {
        optimalSpan = Math.min(6, remainingCols);
      } else if (contentLength > 200) {
        optimalSpan = 12;
      }
    }
    
    // If this component can't fit in the current row and we're not forcing same row
    if (remainingCols < minSpan && !forceSameRow) {
      // Move to next row
      currentRow++;
      currentCol = 1;
      remainingCols = GRID_COLUMNS;
      optimalSpan = Math.min(preferredSpan, GRID_COLUMNS);
    } else if (forceSameRow && remainingCols < minSpan) {
      // If we're forcing same row but can't fit, use remaining space
      optimalSpan = remainingCols;
    }
    
    // For the last component in a row, fill remaining space if it makes sense
    const nextComponent = sortedComponents[i + 1];
    const isLastInRow = !nextComponent || 
                       !canComponentsShareRow(component.type, nextComponent.type) ||
                       remainingCols - optimalSpan < getComponentMinSpan(nextComponent.type);
    
    if (isLastInRow && component.type !== 'kpi') {
      // Fill remaining space for non-KPI components
      optimalSpan = remainingCols;
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

    // Move to next row if needed
    if (remainingCols === 0 || isLastInRow) {
      currentRow++;
      currentCol = 1;
      remainingCols = GRID_COLUMNS;
    }
  }

  // Generate layout suggestions
  if (components.length === 0) {
    suggestions.push("Add some components to get started with your dashboard layout");
  } else {
    // Check for common layout improvements
    const hasKPIs = components.some(c => c.type === 'kpi');
    const hasCharts = components.some(c => c.type === 'chart');
    const hasTables = components.some(c => c.type === 'table');
    const hasText = components.some(c => c.type === 'text');

    if (!hasKPIs && hasCharts) {
      suggestions.push("Consider adding KPI cards at the top for quick metrics overview");
    }
    if (hasKPIs && !hasCharts) {
      suggestions.push("Add charts to visualize your data trends and patterns");
    }
    if (hasCharts && !hasTables && components.length > 3) {
      suggestions.push("Consider adding a data table for detailed information");
    }
    if (!hasText && components.length > 1) {
      suggestions.push("Add a text component to provide context or welcome message");
    }

    // Check for layout balance
    const topRowComponents = optimizedComponents.filter(c => c.position?.row === 1);
    if (topRowComponents.length === 1 && topRowComponents[0].span < 8) {
      suggestions.push("Consider adding more components to the top row for better balance");
    }
    
    // Suggest improvements for component distribution
    const totalRows = Math.max(...optimizedComponents.map(c => c.position?.row || 1));
    if (totalRows > 4 && components.length < 6) {
      suggestions.push("Your layout is quite tall - consider adjusting component sizes for better proportions");
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

  // Suggest missing essential components
  if (!componentTypes.includes('kpi')) {
    suggestions.push("Add KPI cards to show key metrics at a glance");
  }
  if (!componentTypes.includes('chart')) {
    suggestions.push("Add charts to visualize data trends");
  }
  if (currentComponents.length > 3 && !componentTypes.includes('table')) {
    suggestions.push("Consider adding a data table for detailed information");
  }
  if (!componentTypes.includes('text')) {
    suggestions.push("Add a text component for welcome messages or explanations");
  }

  // Suggest layout improvements based on current structure
  if (currentComponents.length === 1) {
    suggestions.push("Add 2-3 more components to create a comprehensive dashboard");
  }
  if (currentComponents.length > 8) {
    suggestions.push("Consider splitting components across multiple pages for better organization");
  }

  // Suggest based on available visuals
  const unusedVisuals = availableVisuals.filter(v => 
    !currentComponents.some(c => c.visualId === v.id)
  );
  if (unusedVisuals.length > 0) {
    suggestions.push(`You have ${unusedVisuals.length} unused visuals that could enhance your dashboard`);
  }

  // Suggest specific layout patterns
  const hasTopRowSpace = currentComponents.filter(c => c.position?.row === 1)
    .reduce((sum, c) => sum + (c.span || 0), 0) < 12;
  
  if (hasTopRowSpace && currentComponents.length > 2) {
    suggestions.push("Consider moving smaller components to the top row for better space utilization");
  }

  return suggestions;
};
