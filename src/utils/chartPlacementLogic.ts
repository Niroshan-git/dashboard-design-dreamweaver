import { LayoutTemplate, ChartPlacement } from './layoutTemplates';

export interface ChartTypeRule {
  type: string;
  priority: number;
  preferredPosition: 'top' | 'center' | 'side' | 'bottom' | 'full-width';
  allowedLayouts: string[];
  isTable?: boolean;
  minCols?: number;
  complexity?: string[];
}

export const chartTypeRules: ChartTypeRule[] = [
  {
    type: 'kpi-cards',
    priority: 1,
    preferredPosition: 'top',
    allowedLayouts: ['all'],
    complexity: ['simple', 'moderate', 'complex']
  },
  {
    type: 'line-charts',
    priority: 2,
    preferredPosition: 'center',
    allowedLayouts: ['primary-chart', 'hero-chart', 'main-focus', 'primary-trend', 'transaction-trend'],
    minCols: 6,
    complexity: ['simple', 'moderate', 'complex']
  },
  {
    type: 'bar-charts',
    priority: 3,
    preferredPosition: 'center',
    allowedLayouts: ['secondary-chart', 'left-primary', 'secondary-analysis', 'breakdown-chart-1'],
    minCols: 6,
    complexity: ['simple', 'moderate', 'complex']
  },
  {
    type: 'pie-charts',
    priority: 4,
    preferredPosition: 'side',
    allowedLayouts: ['tertiary-chart', 'right-primary', 'trend-chart', 'risk-metrics'],
    minCols: 4,
    complexity: ['moderate', 'complex']
  },
  {
    type: 'area-charts',
    priority: 5,
    preferredPosition: 'center',
    allowedLayouts: ['quaternary-chart', 'chart-1', 'chart-2', 'account-breakdown'],
    minCols: 6,
    complexity: ['moderate', 'complex']
  },
  {
    type: 'data-tables',
    priority: 6,
    preferredPosition: 'full-width',
    allowedLayouts: ['data-table', 'detail-table', 'transaction-table'],
    isTable: true,
    minCols: 12,
    complexity: ['moderate', 'complex']
  },
  {
    type: 'transaction-tables',
    priority: 7,
    preferredPosition: 'full-width',
    allowedLayouts: ['transaction-table', 'detail-table', 'data-table'],
    isTable: true,
    minCols: 12,
    complexity: ['complex']
  },
  {
    type: 'summary-tables',
    priority: 8,
    preferredPosition: 'full-width',
    allowedLayouts: ['detail-table', 'data-table'],
    isTable: true,
    minCols: 12
  },
  {
    type: 'filters',
    priority: 9,
    preferredPosition: 'top',
    allowedLayouts: ['kpi-detail', 'summary-chart'],
    complexity: ['moderate', 'complex']
  },
  {
    type: 'time-controls',
    priority: 10,
    preferredPosition: 'top',
    allowedLayouts: ['kpi-detail', 'compliance-chart'],
    complexity: ['moderate', 'complex']
  },
  {
    type: 'heatmaps',
    priority: 11,
    preferredPosition: 'center',
    allowedLayouts: ['chart-1', 'chart-2', 'breakdown-chart-2'],
    minCols: 6,
    complexity: ['complex']
  },
  {
    type: 'geo-maps',
    priority: 12,
    preferredPosition: 'center',
    allowedLayouts: ['chart-1', 'chart-2', 'breakdown-chart-3'],
    minCols: 8,
    complexity: ['complex']
  }
];

export const getVisualsForComplexity = (complexity: string): string[] => {
  const filteredRules = chartTypeRules.filter(rule => 
    rule.complexity && rule.complexity.includes(complexity)
  );
  
  switch (complexity) {
    case 'simple':
      return ['kpi-cards', 'line-charts', 'bar-charts'].slice(0, 3);
    case 'moderate':
      return ['kpi-cards', 'line-charts', 'bar-charts', 'pie-charts', 'area-charts', 'filters'].slice(0, 6);
    case 'complex':
      return filteredRules.slice(0, 8).map(rule => rule.type);
    default:
      return ['kpi-cards', 'line-charts', 'bar-charts'];
  }
};

export const assignChartsToLayout = (
  visuals: string[], 
  layout: LayoutTemplate,
  complexity: string = 'moderate'
): { visual: string; placement: ChartPlacement }[] => {
  const assignments: { visual: string; placement: ChartPlacement }[] = [];
  const availablePlacements = [...layout.chartLayout].sort((a, b) => a.priority - b.priority);
  
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

  // Limit visuals based on layout capacity
  const maxVisuals = Math.min(sortedVisuals.length, layout.maxVisuals);
  const visualsToAssign = sortedVisuals.slice(0, maxVisuals);

  visualsToAssign.forEach((visual) => {
    const rule = chartTypeRules.find(r => r.type === visual);
    
    if (rule && availablePlacements.length > 0) {
      let bestPlacement: ChartPlacement | null = null;
      
      if (rule.isTable) {
        bestPlacement = availablePlacements.find(p => p.position.colSpan >= 12) || 
                      availablePlacements.find(p => p.position.colSpan >= 8) ||
                      availablePlacements[0];
      } else {
        const minCols = rule.minCols || 4;
        bestPlacement = availablePlacements.find(p => 
          p.position.colSpan >= minCols && 
          (rule.allowedLayouts.includes('all') || rule.allowedLayouts.includes(p.component))
        ) || availablePlacements[0];
      }
      
      if (bestPlacement) {
        assignments.push({
          visual,
          placement: bestPlacement
        });
        
        const usedIndex = availablePlacements.indexOf(bestPlacement);
        availablePlacements.splice(usedIndex, 1);
      }
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
