
import { LayoutTemplate, ChartPlacement } from './layoutTemplates';

export interface ChartTypeRule {
  type: string;
  priority: number;
  preferredPosition: 'top' | 'center' | 'side' | 'bottom' | 'full-width';
  allowedLayouts: string[];
  isTable?: boolean;
}

export const chartTypeRules: ChartTypeRule[] = [
  {
    type: 'kpi-cards',
    priority: 1,
    preferredPosition: 'top',
    allowedLayouts: ['all']
  },
  {
    type: 'line-charts',
    priority: 2,
    preferredPosition: 'center',
    allowedLayouts: ['primary-chart', 'hero-chart', 'main-focus', 'primary-trend', 'transaction-trend']
  },
  {
    type: 'bar-charts',
    priority: 3,
    preferredPosition: 'center',
    allowedLayouts: ['secondary-chart', 'left-primary', 'secondary-analysis', 'breakdown-chart-1']
  },
  {
    type: 'pie-charts',
    priority: 4,
    preferredPosition: 'side',
    allowedLayouts: ['tertiary-chart', 'right-primary', 'trend-chart', 'risk-metrics']
  },
  {
    type: 'area-charts',
    priority: 5,
    preferredPosition: 'center',
    allowedLayouts: ['quaternary-chart', 'chart-1', 'chart-2', 'account-breakdown']
  },
  {
    type: 'data-tables',
    priority: 6,
    preferredPosition: 'full-width',
    allowedLayouts: ['data-table', 'detail-table', 'transaction-table'],
    isTable: true
  },
  {
    type: 'transaction-tables',
    priority: 7,
    preferredPosition: 'full-width',
    allowedLayouts: ['transaction-table', 'detail-table', 'data-table'],
    isTable: true
  },
  {
    type: 'summary-tables',
    priority: 8,
    preferredPosition: 'full-width',
    allowedLayouts: ['detail-table', 'data-table'],
    isTable: true
  },
  {
    type: 'filters',
    priority: 9,
    preferredPosition: 'top',
    allowedLayouts: ['kpi-detail', 'summary-chart']
  },
  {
    type: 'time-controls',
    priority: 10,
    preferredPosition: 'top',
    allowedLayouts: ['kpi-detail', 'compliance-chart']
  }
];

export const assignChartsToLayout = (
  visuals: string[], 
  layout: LayoutTemplate
): { visual: string; placement: ChartPlacement }[] => {
  const assignments: { visual: string; placement: ChartPlacement }[] = [];
  const availablePlacements = [...layout.chartLayout];
  
  // Sort visuals by priority based on rules
  const sortedVisuals = visuals.sort((a, b) => {
    const ruleA = chartTypeRules.find(r => r.type === a);
    const ruleB = chartTypeRules.find(r => r.type === b);
    return (ruleA?.priority || 10) - (ruleB?.priority || 10);
  });

  // First pass: assign tables and high-priority items
  sortedVisuals.forEach((visual) => {
    const rule = chartTypeRules.find(r => r.type === visual);
    
    if (rule && availablePlacements.length > 0) {
      let bestPlacement = availablePlacements[0];
      
      // Look for preferred placements
      const preferredPlacements = availablePlacements.filter(p => 
        rule.allowedLayouts.includes('all') || 
        rule.allowedLayouts.includes(p.component)
      );
      
      if (preferredPlacements.length > 0) {
        // For tables, prefer full-width placements
        if (rule.isTable) {
          const fullWidthPlacements = preferredPlacements.filter(p => 
            p.position.colSpan >= 8 || p.component.includes('table')
          );
          bestPlacement = fullWidthPlacements.length > 0 ? fullWidthPlacements[0] : preferredPlacements[0];
        } else {
          bestPlacement = preferredPlacements[0];
        }
      }
      
      assignments.push({
        visual,
        placement: bestPlacement
      });
      
      // Remove used placement
      const usedIndex = availablePlacements.indexOf(bestPlacement);
      availablePlacements.splice(usedIndex, 1);
    }
  });

  // Second pass: fill remaining slots with duplicate visuals if needed
  while (availablePlacements.length > 0 && assignments.length < layout.maxVisuals) {
    const randomVisual = sortedVisuals[Math.floor(Math.random() * sortedVisuals.length)];
    const remainingPlacement = availablePlacements.shift();
    
    if (remainingPlacement) {
      assignments.push({
        visual: randomVisual,
        placement: remainingPlacement
      });
    }
  }

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
