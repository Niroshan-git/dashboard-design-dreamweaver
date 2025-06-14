
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
  dashboardTypes?: string[];
}

export const chartTypeRules: ChartTypeRule[] = [
  {
    type: 'kpi-cards',
    priority: 1,
    preferredPosition: 'top',
    allowedLayouts: ['all'],
    complexity: ['simple', 'moderate', 'complex'],
    flexibleSize: true,
    dashboardTypes: ['all']
  },
  {
    type: 'line-charts',
    priority: 2,
    preferredPosition: 'center',
    allowedLayouts: ['primary-chart', 'hero-chart', 'main-focus', 'primary-trend', 'transaction-trend'],
    minCols: 4,
    maxCols: 8,
    complexity: ['simple', 'moderate', 'complex'],
    flexibleSize: true,
    dashboardTypes: ['finance', 'sales', 'executive', 'ecommerce']
  },
  {
    type: 'bar-charts',
    priority: 3,
    preferredPosition: 'center',
    allowedLayouts: ['secondary-chart', 'left-primary', 'secondary-analysis', 'breakdown-chart-1'],
    minCols: 4,
    maxCols: 8,
    complexity: ['simple', 'moderate', 'complex'],
    flexibleSize: true,
    dashboardTypes: ['all']
  },
  {
    type: 'pie-charts',
    priority: 4,
    preferredPosition: 'side',
    allowedLayouts: ['tertiary-chart', 'right-primary', 'trend-chart', 'risk-metrics'],
    minCols: 3,
    maxCols: 6,
    complexity: ['moderate', 'complex'],
    flexibleSize: true,
    dashboardTypes: ['finance', 'ecommerce', 'sales']
  },
  {
    type: 'area-charts',
    priority: 5,
    preferredPosition: 'center',
    allowedLayouts: ['quaternary-chart', 'chart-1', 'chart-2', 'account-breakdown'],
    minCols: 4,
    maxCols: 8,
    complexity: ['moderate', 'complex'],
    flexibleSize: true,
    dashboardTypes: ['finance', 'executive', 'sales']
  },
  {
    type: 'data-tables',
    priority: 6,
    preferredPosition: 'full-width',
    allowedLayouts: ['data-table', 'detail-table', 'transaction-table'],
    isTable: true,
    minCols: 12,
    maxCols: 12,
    complexity: ['moderate', 'complex'],
    dashboardTypes: ['all']
  },
  {
    type: 'transaction-tables',
    priority: 7,
    preferredPosition: 'full-width',
    allowedLayouts: ['transaction-table', 'detail-table', 'data-table'],
    isTable: true,
    minCols: 12,
    maxCols: 12,
    complexity: ['complex'],
    dashboardTypes: ['finance', 'banking', 'ecommerce']
  },
  {
    type: 'summary-tables',
    priority: 8,
    preferredPosition: 'full-width',
    allowedLayouts: ['detail-table', 'data-table'],
    isTable: true,
    minCols: 12,
    maxCols: 12,
    complexity: ['moderate', 'complex'],
    dashboardTypes: ['finance', 'executive', 'healthcare']
  },
  {
    type: 'heatmaps',
    priority: 9,
    preferredPosition: 'center',
    allowedLayouts: ['chart-1', 'chart-2', 'breakdown-chart-2'],
    minCols: 6,
    maxCols: 12,
    complexity: ['complex'],
    flexibleSize: true,
    dashboardTypes: ['logistics', 'healthcare', 'executive']
  },
  {
    type: 'geo-maps',
    priority: 10,
    preferredPosition: 'center',
    allowedLayouts: ['chart-1', 'chart-2', 'breakdown-chart-3'],
    minCols: 8,
    maxCols: 12,
    complexity: ['complex'],
    flexibleSize: true,
    dashboardTypes: ['logistics', 'healthcare', 'sales']
  }
];

export const getVisualsForDashboardType = (dashboardType: string, complexity: string): string[] => {
  const allVisuals = getVisualsForComplexity(complexity);
  
  // Dashboard-specific visual selection
  const dashboardVisuals: { [key: string]: string[] } = {
    finance: ['kpi-cards', 'line-charts', 'area-charts', 'pie-charts', 'transaction-tables', 'summary-tables', 'bar-charts'],
    ecommerce: ['kpi-cards', 'line-charts', 'bar-charts', 'pie-charts', 'data-tables', 'area-charts'],
    logistics: ['kpi-cards', 'bar-charts', 'line-charts', 'heatmaps', 'geo-maps', 'data-tables'],
    sales: ['kpi-cards', 'line-charts', 'bar-charts', 'pie-charts', 'area-charts', 'data-tables'],
    executive: ['kpi-cards', 'line-charts', 'area-charts', 'pie-charts', 'summary-tables', 'heatmaps'],
    healthcare: ['kpi-cards', 'line-charts', 'bar-charts', 'heatmaps', 'summary-tables', 'data-tables'],
    custom: allVisuals
  };

  const typeVisuals = dashboardVisuals[dashboardType] || allVisuals;
  
  // Filter by complexity
  return typeVisuals.filter(visual => {
    const rule = chartTypeRules.find(r => r.type === visual);
    return rule && rule.complexity && rule.complexity.includes(complexity);
  });
};

export const getVisualsForComplexity = (complexity: string): string[] => {
  const filteredRules = chartTypeRules.filter(rule => 
    rule.complexity && rule.complexity.includes(complexity)
  );
  
  switch (complexity) {
    case 'simple':
      return filteredRules.slice(0, 4).map(rule => rule.type);
    case 'moderate':
      return filteredRules.slice(0, 7).map(rule => rule.type);
    case 'complex':
      return filteredRules.map(rule => rule.type);
    default:
      return ['kpi-cards', 'line-charts', 'bar-charts'];
  }
};

const getContainerDimensions = (canvasSize: string) => {
  switch (canvasSize) {
    case '4:3': return { cols: 10, baseHeight: 'h-64' };
    case '1:1': return { cols: 8, baseHeight: 'h-60' };
    case '21:9': return { cols: 16, baseHeight: 'h-72' };
    default: return { cols: 12, baseHeight: 'h-68' }; // 16:9
  }
};

const distributeVisualsAcrossPages = (
  visuals: string[], 
  totalPages: number, 
  complexity: string,
  dashboardType: string
): string[][] => {
  if (totalPages <= 1) return [visuals];
  
  const pageVisuals: string[][] = Array.from({ length: totalPages }, () => []);
  
  // Ensure first page gets primary visuals
  const primaryVisuals = visuals.filter(v => 
    ['kpi-cards', 'line-charts', 'bar-charts'].includes(v)
  ).slice(0, complexity === 'simple' ? 3 : complexity === 'moderate' ? 5 : 7);
  
  // Distribute remaining visuals
  const remainingVisuals = visuals.filter(v => !primaryVisuals.includes(v));
  
  pageVisuals[0] = primaryVisuals;
  
  // Distribute remaining visuals across other pages
  remainingVisuals.forEach((visual, index) => {
    const pageIndex = (index % (totalPages - 1)) + 1;
    pageVisuals[pageIndex].push(visual);
  });
  
  // Ensure each page has at least one table if complexity allows
  for (let i = 1; i < totalPages; i++) {
    const hasTable = pageVisuals[i].some(v => v.includes('table'));
    if (!hasTable && complexity !== 'simple') {
      const availableTables = ['data-tables', 'summary-tables', 'transaction-tables'];
      const suitableTable = availableTables.find(table => 
        visuals.includes(table) && !pageVisuals.flat().includes(table)
      );
      if (suitableTable) {
        pageVisuals[i].push(suitableTable);
      }
    }
  }
  
  return pageVisuals.filter(page => page.length > 0);
};

const calculateOptimalGridLayout = (
  visuals: string[], 
  containerCols: number, 
  complexity: string,
  canvasSize: string
): { visual: string; colSpan: number; rowSpan: number; row: number; col: number }[] => {
  const layouts: { visual: string; colSpan: number; rowSpan: number; row: number; col: number }[] = [];
  let currentRow = 1;
  let currentCol = 1;
  let rowHeight = 1;
  
  const getOptimalSize = (visual: string, availableWidth: number, remainingInRow: number) => {
    const rule = chartTypeRules.find(r => r.type === visual);
    if (!rule) return { colSpan: 4, rowSpan: 2 };
    
    if (rule.isTable) {
      return { colSpan: containerCols, rowSpan: complexity === 'simple' ? 3 : 4 };
    }
    
    // Calculate optimal size based on remaining space and visual count
    let optimalCols = Math.min(rule.maxCols || 6, availableWidth);
    
    // Adjust for canvas size
    if (canvasSize === '4:3' || canvasSize === '1:1') {
      optimalCols = Math.min(optimalCols, Math.floor(containerCols / 2));
    } else if (canvasSize === '21:9') {
      optimalCols = Math.min(optimalCols, Math.floor(containerCols / 2.5));
    }
    
    // Ensure we fill the row efficiently
    if (remainingInRow === 1) {
      optimalCols = availableWidth; // Fill remaining space
    } else if (remainingInRow === 2 && availableWidth >= 6) {
      optimalCols = Math.floor(availableWidth / 2);
    }
    
    const rowSpan = complexity === 'simple' ? 2 : 
                   complexity === 'complex' ? 3 : 2;
    
    return { colSpan: Math.max(3, optimalCols), rowSpan };
  };
  
  // Count non-table visuals for better distribution
  const nonTableVisuals = visuals.filter(v => !v.includes('table'));
  const visualsPerRow = Math.ceil(Math.sqrt(nonTableVisuals.length));
  const remainingVisuals = [...visuals];
  
  while (remainingVisuals.length > 0) {
    const visual = remainingVisuals.shift()!;
    const availableWidth = containerCols - (currentCol - 1);
    const remainingInThisRow = Math.min(visualsPerRow - ((currentCol - 1) / Math.ceil(containerCols / visualsPerRow)), remainingVisuals.length + 1);
    
    const { colSpan, rowSpan } = getOptimalSize(visual, availableWidth, remainingInThisRow);
    
    // Check if visual fits in current row
    if (colSpan > availableWidth) {
      currentRow += rowHeight;
      currentCol = 1;
      rowHeight = 1;
    }
    
    layouts.push({
      visual,
      colSpan: Math.min(colSpan, containerCols),
      rowSpan,
      row: currentRow,
      col: currentCol
    });
    
    currentCol += colSpan;
    rowHeight = Math.max(rowHeight, rowSpan);
    
    // Move to next row if table or row is full
    if (visual.includes('table') || currentCol > containerCols) {
      currentRow += rowHeight;
      currentCol = 1;
      rowHeight = 1;
    }
  }
  
  return layouts;
};

export const assignChartsToLayout = (
  allVisuals: string[], 
  layout: LayoutTemplate,
  complexity: string = 'moderate',
  canvasSize: string = '16:9',
  pageIndex: number = 0,
  totalPages: number = 1,
  dashboardType: string = 'general'
): { visual: string; placement: ChartPlacement }[] => {
  // Get dashboard-specific visuals
  const dashboardVisuals = getVisualsForDashboardType(dashboardType, complexity);
  const filteredVisuals = allVisuals.length > 0 ? 
    allVisuals.filter(v => dashboardVisuals.includes(v)) : 
    dashboardVisuals;
  
  // Distribute visuals across pages
  const pageVisuals = distributeVisualsAcrossPages(filteredVisuals, totalPages, complexity, dashboardType);
  const currentPageVisuals = pageVisuals[pageIndex] || [];
  
  if (currentPageVisuals.length === 0) {
    return [];
  }
  
  const { cols: containerCols } = getContainerDimensions(canvasSize);
  
  // Calculate optimal grid layout
  const gridLayouts = calculateOptimalGridLayout(currentPageVisuals, containerCols, complexity, canvasSize);
  
  // Convert to chart placements
  const assignments: { visual: string; placement: ChartPlacement }[] = [];
  
  gridLayouts.forEach((gridLayout, index) => {
    const placement: ChartPlacement = {
      component: `chart-${pageIndex}-${index}`,
      position: {
        row: gridLayout.row,
        col: gridLayout.col,
        rowSpan: gridLayout.rowSpan,
        colSpan: gridLayout.colSpan
      },
      priority: index + 1
    };
    
    assignments.push({
      visual: gridLayout.visual,
      placement
    });
  });

  return assignments;
};

export const getTableDataForType = (tableType: string, dashboardType: string = 'general') => {
  const tableData: { [key: string]: { [key: string]: any } } = {
    finance: {
      'transaction-tables': {
        headers: ['Date', 'Transaction ID', 'Account', 'Type', 'Amount', 'Status'],
        rows: [
          ['2024-01-15', 'TXN-001', 'ACC-1234', 'Credit', '$2,500.00', 'Completed'],
          ['2024-01-15', 'TXN-002', 'ACC-5678', 'Debit', '$850.00', 'Pending'],
          ['2024-01-14', 'TXN-003', 'ACC-9012', 'Credit', '$1,200.00', 'Completed'],
          ['2024-01-14', 'TXN-004', 'ACC-3456', 'Transfer', '$3,750.00', 'Completed'],
          ['2024-01-13', 'TXN-005', 'ACC-7890', 'Debit', '$425.00', 'Failed']
        ]
      },
      'summary-tables': {
        headers: ['Account Type', 'Total Balance', 'Transactions', 'Growth', 'Risk Level'],
        rows: [
          ['Checking', '$125,480.00', '1,247', '+12.5%', 'Low'],
          ['Savings', '$89,230.00', '456', '+8.3%', 'Low'],
          ['Investment', '$45,680.00', '89', '+24.7%', 'Medium'],
          ['Credit', '$12,340.00', '234', '-5.2%', 'High'],
          ['Loan', '$234,500.00', '12', '+1.8%', 'Medium']
        ]
      }
    },
    ecommerce: {
      'data-tables': {
        headers: ['Product', 'Sales', 'Revenue', 'Growth', 'Category'],
        rows: [
          ['Product A', '1,245', '$24,500', '+15%', 'Electronics'],
          ['Product B', '892', '$17,840', '+8%', 'Clothing'],
          ['Product C', '634', '$12,680', '-3%', 'Home'],
          ['Product D', '421', '$8,420', '+22%', 'Sports'],
          ['Product E', '315', '$6,300', '+5%', 'Books']
        ]
      }
    },
    sales: {
      'data-tables': {
        headers: ['Rep Name', 'Deals Closed', 'Revenue', 'Target', 'Performance'],
        rows: [
          ['John Smith', '24', '$120,000', '$100,000', 'Excellent'],
          ['Jane Doe', '18', '$90,000', '$100,000', 'Good'],
          ['Mike Johnson', '15', '$75,000', '$80,000', 'Fair'],
          ['Sarah Wilson', '21', '$105,000', '$100,000', 'Excellent'],
          ['Tom Brown', '12', '$60,000', '$80,000', 'Needs Improvement']
        ]
      }
    }
  };
  
  const dashboardData = tableData[dashboardType];
  if (dashboardData && dashboardData[tableType]) {
    return dashboardData[tableType];
  }
  
  // Default fallback
  return {
    headers: ['Metric', 'Current', 'Previous', 'Change', 'Status'],
    rows: [
      ['Revenue', '$2.8M', '$2.4M', '+16.7%', 'Good'],
      ['Users', '45.2K', '42.1K', '+7.4%', 'Excellent'],
      ['Conversion', '3.24%', '3.31%', '-2.1%', 'Fair'],
      ['Satisfaction', '94.2%', '89.1%', '+5.7%', 'Excellent']
    ]
  };
};
