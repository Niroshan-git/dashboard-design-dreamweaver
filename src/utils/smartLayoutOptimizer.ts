
export interface LayoutComponent {
  id: string;
  type: string;
  span: number;
  kpiCount?: number;
  chartType?: string;
  visualId?: string;
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
    case 'heatmap': return 6;
    case 'funnel': return 4;
    case 'scatter': return 4;
    default: return 3;
  }
};

const getComponentPreferredSpan = (type: string): number => {
  switch (type) {
    case 'kpi': return 4;
    case 'chart': return 6;
    case 'table': return 12;
    case 'text': return 6;
    case 'progress': return 6;
    case 'heatmap': return 8;
    case 'funnel': return 6;
    case 'scatter': return 6;
    default: return 6;
  }
};

const canComponentsShareRow = (type1: string, type2: string): boolean => {
  const exclusiveTypes = ['table', 'heatmap'];
  return !exclusiveTypes.includes(type1) && !exclusiveTypes.includes(type2);
};

export const optimizeLayout = (components: LayoutComponent[]): OptimizedLayout => {
  const optimizedComponents: LayoutComponent[] = [];
  const suggestions: string[] = [];
  let currentRow = 1;
  let currentCol = 1;
  let remainingCols = GRID_COLUMNS;

  // Sort components by priority (KPIs first, then charts, then others)
  const sortedComponents = [...components].sort((a, b) => {
    const priority = { kpi: 1, chart: 2, progress: 3, text: 4, table: 5, heatmap: 6, funnel: 7, scatter: 8 };
    return (priority[a.type as keyof typeof priority] || 9) - (priority[b.type as keyof typeof priority] || 9);
  });

  for (let i = 0; i < sortedComponents.length; i++) {
    const component = sortedComponents[i];
    const minSpan = getComponentMinSpan(component.type);
    const preferredSpan = getComponentPreferredSpan(component.type);
    
    // Calculate optimal span based on remaining space and component count
    let optimalSpan = Math.min(preferredSpan, remainingCols);
    
    // If this is the last component in the row, fill remaining space
    const nextComponent = sortedComponents[i + 1];
    if (nextComponent && !canComponentsShareRow(component.type, nextComponent.type)) {
      optimalSpan = remainingCols;
    } else if (remainingCols < minSpan) {
      // Move to next row
      currentRow++;
      currentCol = 1;
      remainingCols = GRID_COLUMNS;
      optimalSpan = Math.min(preferredSpan, GRID_COLUMNS);
    }

    // Special handling for KPI cards - adjust based on count
    if (component.type === 'kpi' && component.kpiCount) {
      const kpiWidth = Math.max(3, Math.floor(12 / component.kpiCount));
      optimalSpan = Math.min(12, kpiWidth * component.kpiCount);
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
    if (remainingCols === 0 || (nextComponent && !canComponentsShareRow(component.type, nextComponent.type))) {
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

    if (!hasKPIs && hasCharts) {
      suggestions.push("Consider adding KPI cards at the top for quick metrics overview");
    }
    if (hasKPIs && !hasCharts) {
      suggestions.push("Add charts to visualize your data trends and patterns");
    }
    if (hasCharts && !hasTables) {
      suggestions.push("Consider adding a data table for detailed information");
    }

    // Check for layout balance
    const topRowComponents = optimizedComponents.filter(c => c.position?.row === 1);
    if (topRowComponents.length === 1 && topRowComponents[0].span < 12) {
      suggestions.push("Consider adding more components to the top row for better balance");
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

  // Suggest layout improvements
  if (currentComponents.length === 1) {
    suggestions.push("Add more components to create a comprehensive dashboard");
  }
  if (currentComponents.length > 6) {
    suggestions.push("Consider splitting components across multiple pages");
  }

  // Suggest based on available visuals
  const unusedVisuals = availableVisuals.filter(v => 
    !currentComponents.some(c => c.visualId === v.id)
  );
  if (unusedVisuals.length > 0) {
    suggestions.push(`You have ${unusedVisuals.length} unused visuals that could enhance your dashboard`);
  }

  return suggestions;
};
