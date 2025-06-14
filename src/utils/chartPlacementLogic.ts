
import { LayoutTemplate, ChartPlacement } from './layoutTemplates';

export interface ChartTypeRule {
  type: string;
  priority: number;
  preferredPosition: 'top' | 'center' | 'side' | 'bottom';
  allowedLayouts: string[];
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
    allowedLayouts: ['primary-chart', 'hero-chart', 'main-focus', 'top-left']
  },
  {
    type: 'bar-charts',
    priority: 3,
    preferredPosition: 'center',
    allowedLayouts: ['secondary-chart', 'left-primary', 'top-right']
  },
  {
    type: 'pie-charts',
    priority: 4,
    preferredPosition: 'side',
    allowedLayouts: ['tertiary-chart', 'right-primary', 'detail-1', 'detail-2']
  },
  {
    type: 'area-charts',
    priority: 5,
    preferredPosition: 'center',
    allowedLayouts: ['quaternary-chart', 'bottom-left', 'chart-1', 'chart-2']
  },
  {
    type: 'filters',
    priority: 6,
    preferredPosition: 'top',
    allowedLayouts: ['detail-3', 'right-secondary']
  },
  {
    type: 'time-controls',
    priority: 7,
    preferredPosition: 'top',
    allowedLayouts: ['bottom-summary', 'bottom-insight']
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

  sortedVisuals.forEach((visual, index) => {
    if (index < availablePlacements.length) {
      const rule = chartTypeRules.find(r => r.type === visual);
      
      // Find best placement based on rules
      let bestPlacement = availablePlacements[0];
      
      if (rule) {
        const preferredPlacements = availablePlacements.filter(p => 
          rule.allowedLayouts.includes('all') || 
          rule.allowedLayouts.includes(p.component)
        );
        
        if (preferredPlacements.length > 0) {
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

  return assignments;
};
