import { LayoutTemplate, ChartPlacement } from './layoutTemplates';

export interface ChartTypeRule {
  type: string;
  priority: number;
  preferredPosition: 'top' | 'center' | 'side' | 'bottom' | 'full-width';
  allowedLayouts: string[];
  isTable?: boolean;
  minCols?: number;
  maxCols?: number;
  complexity?: string[];
  flexibleSize?: boolean;
}

export const chartTypeRules: ChartTypeRule[] = [
  {
    type: 'kpi-cards',
    priority: 1,
    preferredPosition: 'top',
    allowedLayouts: ['all'],
    complexity: ['simple', 'moderate', 'complex'],
    flexibleSize: true
  },
  {
    type: 'line-charts',
    priority: 2,
    preferredPosition: 'center',
    allowedLayouts: ['primary-chart', 'hero-chart', 'main-focus', 'primary-trend', 'transaction-trend'],
    minCols: 4,
    maxCols: 8,
    complexity: ['simple', 'moderate', 'complex'],
    flexibleSize: true
  },
  {
    type: 'bar-charts',
    priority: 3,
    preferredPosition: 'center',
    allowedLayouts: ['secondary-chart', 'left-primary', 'secondary-analysis', 'breakdown-chart-1'],
    minCols: 4,
    maxCols: 8,
    complexity: ['simple', 'moderate', 'complex'],
    flexibleSize: true
  },
  {
    type: 'pie-charts',
    priority: 4,
    preferredPosition: 'side',
    allowedLayouts: ['tertiary-chart', 'right-primary', 'trend-chart', 'risk-metrics'],
    minCols: 3,
    maxCols: 6,
    complexity: ['moderate', 'complex'],
    flexibleSize: true
  },
  {
    type: 'area-charts',
    priority: 5,
    preferredPosition: 'center',
    allowedLayouts: ['quaternary-chart', 'chart-1', 'chart-2', 'account-breakdown'],
    minCols: 4,
    maxCols: 8,
    complexity: ['moderate', 'complex'],
    flexibleSize: true
  },
  {
    type: 'data-tables',
    priority: 6,
    preferredPosition: 'full-width',
    allowedLayouts: ['data-table', 'detail-table', 'transaction-table'],
    isTable: true,
    minCols: 12,
    maxCols: 12,
    complexity: ['moderate', 'complex']
  },
  {
    type: 'transaction-tables',
    priority: 7,
    preferredPosition: 'full-width',
    allowedLayouts: ['transaction-table', 'detail-table', 'data-table'],
    isTable: true,
    minCols: 12,
    maxCols: 12,
    complexity: ['complex']
  },
  {
    type: 'summary-tables',
    priority: 8,
    preferredPosition: 'full-width',
    allowedLayouts: ['detail-table', 'data-table'],
    isTable: true,
    minCols: 12,
    maxCols: 12
  },
  {
    type: 'heatmaps',
    priority: 9,
    preferredPosition: 'center',
    allowedLayouts: ['chart-1', 'chart-2', 'breakdown-chart-2'],
    minCols: 6,
    maxCols: 12,
    complexity: ['complex'],
    flexibleSize: true
  },
  {
    type: 'geo-maps',
    priority: 10,
    preferredPosition: 'center',
    allowedLayouts: ['chart-1', 'chart-2', 'breakdown-chart-3'],
    minCols: 8,
    maxCols: 12,
    complexity: ['complex'],
    flexibleSize: true
  }
];

export const getVisualsForComplexity = (complexity: string): string[] => {
  const filteredRules = chartTypeRules.filter(rule => 
    rule.complexity && rule.complexity.includes(complexity)
  );
  
  switch (complexity) {
    case 'simple':
      return filteredRules.slice(0, 3).map(rule => rule.type);
    case 'moderate':
      return filteredRules.slice(0, 6).map(rule => rule.type);
    case 'complex':
      return filteredRules.map(rule => rule.type);
    default:
      return ['kpi-cards', 'line-charts', 'bar-charts'];
  }
};

const calculateOptimalLayout = (
  visuals: string[], 
  containerWidth: number = 12, 
  complexity: string = 'moderate'
): { visual: string; colSpan: number; rowSpan: number }[] => {
  const layouts: { visual: string; colSpan: number; rowSpan: number }[] = [];
  let remainingWidth = containerWidth;
  let currentRow = 1;
  
  const getOptimalSize = (visual: string, availableWidth: number) => {
    const rule = chartTypeRules.find(r => r.type === visual);
    if (!rule) return { colSpan: 4, rowSpan: 2 };
    
    if (rule.isTable) {
      return { colSpan: 12, rowSpan: 3 };
    }
    
    // Calculate optimal column span based on complexity and available width
    let optimalCols = rule.minCols || 4;
    
    if (complexity === 'simple') {
      optimalCols = Math.min(6, availableWidth);
    } else if (complexity === 'moderate') {
      optimalCols = Math.min(6, availableWidth);
    } else if (complexity === 'complex') {
      optimalCols = Math.min(rule.maxCols || 8, availableWidth);
    }
    
    // Ensure we don't exceed available width
    optimalCols = Math.min(optimalCols, availableWidth);
    
    // Dynamic row span based on chart type and complexity
    let rowSpan = 2;
    if (visual.includes('table')) rowSpan = 4;
    else if (complexity === 'complex') rowSpan = 3;
    else if (complexity === 'simple') rowSpan = 2;
    
    return { colSpan: optimalCols, rowSpan };
  };
  
  visuals.forEach((visual) => {
    const { colSpan, rowSpan } = getOptimalSize(visual, remainingWidth);
    
    // If chart doesn't fit in current row, start new row
    if (colSpan > remainingWidth) {
      currentRow++;
      remainingWidth = containerWidth;
    }
    
    layouts.push({ visual, colSpan, rowSpan });
    remainingWidth -= colSpan;
    
    // If no space left in row, start new row
    if (remainingWidth <= 0) {
      currentRow++;
      remainingWidth = containerWidth;
    }
  });
  
  return layouts;
};

export const assignChartsToLayout = (
  visuals: string[], 
  layout: LayoutTemplate,
  complexity: string = 'moderate',
  canvasSize: string = '16:9',
  pageIndex: number = 0,
  totalPages: number = 1
): { visual: string; placement: ChartPlacement }[] => {
  // Filter visuals based on complexity
  const complexityFilteredVisuals = visuals.filter(visual => {
    const rule = chartTypeRules.find(r => r.type === visual);
    return rule && rule.complexity && rule.complexity.includes(complexity);
  });
  
  // Sort visuals by priority
  const sortedVisuals = complexityFilteredVisuals.sort((a, b) => {
    const ruleA = chartTypeRules.find(r => r.type === a);
    const ruleB = chartTypeRules.find(r => r.type === b);
    return (ruleA?.priority || 10) - (ruleB?.priority || 10);
  });

  // Calculate container width based on canvas size
  const getContainerWidth = () => {
    switch (canvasSize) {
      case '4:3': return 10; // Narrower for 4:3
      case '1:1': return 8;  // Square format
      case '21:9': return 16; // Ultra-wide
      default: return 12; // Standard 16:9
    }
  };

  const containerWidth = getContainerWidth();
  
  // Calculate optimal layouts for all visuals
  const optimalLayouts = calculateOptimalLayout(sortedVisuals, containerWidth, complexity);
  
  // Convert to chart placements
  const assignments: { visual: string; placement: ChartPlacement }[] = [];
  let currentRow = 1;
  let currentCol = 1;
  
  optimalLayouts.forEach((layout, index) => {
    // Check if we need to start a new row
    if (currentCol + layout.colSpan - 1 > containerWidth) {
      currentRow += 2; // Add some spacing between rows
      currentCol = 1;
    }
    
    const placement: ChartPlacement = {
      component: `chart-${index}`,
      position: {
        row: currentRow,
        col: currentCol,
        rowSpan: layout.rowSpan,
        colSpan: layout.colSpan
      },
      priority: index + 1
    };
    
    assignments.push({
      visual: layout.visual,
      placement
    });
    
    currentCol += layout.colSpan;
    
    // If table or full-width component, move to next row
    if (layout.colSpan >= containerWidth * 0.8) {
      currentRow += layout.rowSpan + 1;
      currentCol = 1;
    }
  });

  return assignments;
};

export const getTableDataForType = (tableType: string, dashboardType: string = 'general') => {
  if (dashboardType === 'finance' || dashboardType === 'banking') {
    switch (tableType) {
      case 'transaction-tables':
        return {
          headers: ['Date', 'Transaction ID', 'Account', 'Type', 'Amount', 'Status'],
          rows: [
            ['2024-01-15', 'TXN-001', 'ACC-1234', 'Credit', '$2,500.00', 'Completed'],
            ['2024-01-15', 'TXN-002', 'ACC-5678', 'Debit', '$850.00', 'Pending'],
            ['2024-01-14', 'TXN-003', 'ACC-9012', 'Credit', '$1,200.00', 'Completed'],
            ['2024-01-14', 'TXN-004', 'ACC-3456', 'Transfer', '$3,750.00', 'Completed'],
            ['2024-01-13', 'TXN-005', 'ACC-7890', 'Debit', '$425.00', 'Failed']
          ]
        };
      case 'summary-tables':
        return {
          headers: ['Account Type', 'Total Balance', 'Transactions', 'Growth', 'Risk Level'],
          rows: [
            ['Checking', '$125,480.00', '1,247', '+12.5%', 'Low'],
            ['Savings', '$89,230.00', '456', '+8.3%', 'Low'],
            ['Investment', '$45,680.00', '89', '+24.7%', 'Medium'],
            ['Credit', '$12,340.00', '234', '-5.2%', 'High'],
            ['Loan', '$234,500.00', '12', '+1.8%', 'Medium']
          ]
        };
      default:
        return {
          headers: ['Metric', 'Current', 'Previous', 'Change', 'Target'],
          rows: [
            ['Revenue', '$2.8M', '$2.4M', '+16.7%', '$3.0M'],
            ['Expenses', '$1.9M', '$2.1M', '-9.5%', '$1.8M'],
            ['Profit Margin', '18.4%', '16.2%', '+2.2%', '20.0%'],
            ['Cash Flow', '$892K', '$743K', '+20.1%', '$1.0M']
          ]
        };
    }
  }
  
  // Default table data for other dashboard types
  return {
    headers: ['Item', 'Value', 'Change', 'Status', 'Action'],
    rows: [
      ['Website Visits', '45,123', '+12.5%', 'Good', 'Monitor'],
      ['Conversions', '1,456', '+8.3%', 'Excellent', 'Maintain'],
      ['Revenue', '$23,456', '+15.7%', 'Good', 'Optimize'],
      ['Users', '12,789', '+5.2%', 'Fair', 'Improve'],
      ['Bounce Rate', '34.5%', '-2.1%', 'Good', 'Monitor']
    ]
  };
};
