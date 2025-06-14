
export interface LayoutPosition {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export interface ChartPlacement {
  component: string;
  position: LayoutPosition;
  priority: number;
}

export interface LayoutTemplate {
  name: string;
  description: string;
  type: string;
  complexity: 'simple' | 'moderate' | 'complex';
  kpiLayout: LayoutPosition[];
  chartLayout: ChartPlacement[];
  maxVisuals: number;
}

// 12-column grid system layouts organized by complexity
export const layoutTemplates: LayoutTemplate[] = [
  // SIMPLE LAYOUTS (1-4 visuals)
  {
    name: "Simple Overview",
    description: "Clean layout with KPIs and basic charts",
    type: "simple-overview",
    complexity: "simple",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 4, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 10, rowSpan: 1, colSpan: 3 }
    ],
    chartLayout: [
      { component: "primary-chart", position: { row: 2, col: 1, rowSpan: 3, colSpan: 8 }, priority: 1 },
      { component: "secondary-chart", position: { row: 2, col: 9, rowSpan: 3, colSpan: 4 }, priority: 2 }
    ],
    maxVisuals: 2
  },
  {
    name: "Hero KPI Focus",
    description: "KPI cards at top, single main chart below",
    type: "hero-kpi-simple",
    complexity: "simple",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 4 },
      { row: 1, col: 5, rowSpan: 1, colSpan: 4 },
      { row: 1, col: 9, rowSpan: 1, colSpan: 4 }
    ],
    chartLayout: [
      { component: "hero-chart", position: { row: 2, col: 1, rowSpan: 4, colSpan: 12 }, priority: 1 }
    ],
    maxVisuals: 1
  },

  // MODERATE LAYOUTS (4-8 visuals)
  {
    name: "Balanced Dashboard",
    description: "KPI cards with balanced chart grid",
    type: "moderate-balanced",
    complexity: "moderate",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 4, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 10, rowSpan: 1, colSpan: 3 }
    ],
    chartLayout: [
      { component: "primary-chart", position: { row: 2, col: 1, rowSpan: 2, colSpan: 6 }, priority: 1 },
      { component: "secondary-chart", position: { row: 2, col: 7, rowSpan: 2, colSpan: 6 }, priority: 2 },
      { component: "tertiary-chart", position: { row: 4, col: 1, rowSpan: 2, colSpan: 6 }, priority: 3 },
      { component: "quaternary-chart", position: { row: 4, col: 7, rowSpan: 2, colSpan: 6 }, priority: 4 }
    ],
    maxVisuals: 4
  },
  {
    name: "Two-Column Analysis",
    description: "Split layout for comparative analysis",
    type: "two-column-moderate",
    complexity: "moderate",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 6 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 6 }
    ],
    chartLayout: [
      { component: "left-primary", position: { row: 2, col: 1, rowSpan: 3, colSpan: 6 }, priority: 1 },
      { component: "right-primary", position: { row: 2, col: 7, rowSpan: 3, colSpan: 6 }, priority: 2 },
      { component: "left-secondary", position: { row: 5, col: 1, rowSpan: 2, colSpan: 6 }, priority: 3 },
      { component: "right-secondary", position: { row: 5, col: 7, rowSpan: 2, colSpan: 6 }, priority: 4 },
      { component: "data-table", position: { row: 7, col: 1, rowSpan: 2, colSpan: 12 }, priority: 5 }
    ],
    maxVisuals: 5
  },

  // COMPLEX LAYOUTS (8+ visuals)
  {
    name: "Executive Dashboard",
    description: "Comprehensive executive view with detailed analytics",
    type: "executive-complex",
    complexity: "complex",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 3, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 5, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 9, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 11, rowSpan: 1, colSpan: 2 }
    ],
    chartLayout: [
      { component: "hero-chart", position: { row: 2, col: 1, rowSpan: 2, colSpan: 8 }, priority: 1 },
      { component: "kpi-detail", position: { row: 2, col: 9, rowSpan: 1, colSpan: 4 }, priority: 2 },
      { component: "trend-chart", position: { row: 3, col: 9, rowSpan: 1, colSpan: 4 }, priority: 3 },
      { component: "chart-1", position: { row: 4, col: 1, rowSpan: 2, colSpan: 4 }, priority: 4 },
      { component: "chart-2", position: { row: 4, col: 5, rowSpan: 2, colSpan: 4 }, priority: 5 },
      { component: "chart-3", position: { row: 4, col: 9, rowSpan: 2, colSpan: 4 }, priority: 6 },
      { component: "data-table", position: { row: 6, col: 1, rowSpan: 3, colSpan: 8 }, priority: 7 },
      { component: "summary-chart", position: { row: 6, col: 9, rowSpan: 3, colSpan: 4 }, priority: 8 }
    ],
    maxVisuals: 8
  },
  {
    name: "Analytics Hub",
    description: "Multi-dimensional analytics with tables and detailed charts",
    type: "analytics-complex",
    complexity: "complex",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 4, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 10, rowSpan: 1, colSpan: 3 }
    ],
    chartLayout: [
      { component: "primary-trend", position: { row: 2, col: 1, rowSpan: 2, colSpan: 6 }, priority: 1 },
      { component: "secondary-analysis", position: { row: 2, col: 7, rowSpan: 2, colSpan: 6 }, priority: 2 },
      { component: "detail-table", position: { row: 4, col: 1, rowSpan: 3, colSpan: 12 }, priority: 3 },
      { component: "breakdown-chart-1", position: { row: 7, col: 1, rowSpan: 2, colSpan: 4 }, priority: 4 },
      { component: "breakdown-chart-2", position: { row: 7, col: 5, rowSpan: 2, colSpan: 4 }, priority: 5 },
      { component: "breakdown-chart-3", position: { row: 7, col: 9, rowSpan: 2, colSpan: 4 }, priority: 6 }
    ],
    maxVisuals: 6
  },
  {
    name: "Banking Operations",
    description: "Banking dashboard with transaction tables and compliance metrics",
    type: "banking-complex",
    complexity: "complex",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 3, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 5, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 9, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 11, rowSpan: 1, colSpan: 2 }
    ],
    chartLayout: [
      { component: "transaction-trend", position: { row: 2, col: 1, rowSpan: 2, colSpan: 8 }, priority: 1 },
      { component: "risk-metrics", position: { row: 2, col: 9, rowSpan: 2, colSpan: 4 }, priority: 2 },
      { component: "transaction-table", position: { row: 4, col: 1, rowSpan: 4, colSpan: 12 }, priority: 3 },
      { component: "account-breakdown", position: { row: 8, col: 1, rowSpan: 2, colSpan: 6 }, priority: 4 },
      { component: "compliance-chart", position: { row: 8, col: 7, rowSpan: 2, colSpan: 6 }, priority: 5 }
    ],
    maxVisuals: 5
  }
];

export const getLayoutForComplexity = (complexity: string, visualCount: number): LayoutTemplate => {
  // Filter layouts by complexity
  const complexityLayouts = layoutTemplates.filter(t => t.complexity === complexity);
  
  if (complexityLayouts.length === 0) {
    // Fallback based on complexity string
    if (complexity === 'simple') {
      return layoutTemplates.find(t => t.complexity === 'simple') || layoutTemplates[0];
    } else if (complexity === 'complex') {
      return layoutTemplates.find(t => t.complexity === 'complex') || layoutTemplates[layoutTemplates.length - 1];
    }
    return layoutTemplates.find(t => t.complexity === 'moderate') || layoutTemplates[1];
  }

  // Find layout that can accommodate the visual count
  const suitableLayouts = complexityLayouts.filter(t => t.maxVisuals >= visualCount);
  
  if (suitableLayouts.length > 0) {
    // Prefer layouts that match visual count closely
    suitableLayouts.sort((a, b) => {
      const diffA = Math.abs(a.maxVisuals - visualCount);
      const diffB = Math.abs(b.maxVisuals - visualCount);
      return diffA - diffB;
    });
    return suitableLayouts[0];
  }
  
  // Return the largest layout for the complexity if visual count exceeds all
  return complexityLayouts.reduce((prev, current) => 
    prev.maxVisuals > current.maxVisuals ? prev : current
  );
};

export const getRandomLayoutTemplate = (): LayoutTemplate => {
  return layoutTemplates[Math.floor(Math.random() * layoutTemplates.length)];
};

export const getLayoutForPage = (pageIndex: number, totalPages: number, visualCount: number, complexity: string = 'moderate'): LayoutTemplate => {
  if (pageIndex === 0) {
    // Main page should use complexity-appropriate layout
    return getLayoutForComplexity(complexity, visualCount);
  }
  
  // For other pages, vary the layouts based on complexity
  const complexityLayouts = layoutTemplates.filter(t => t.complexity === complexity);
  
  if (complexityLayouts.length === 0) {
    return layoutTemplates[0];
  }
  
  // Rotate through layouts of the same complexity for variety
  const layoutIndex = (pageIndex - 1) % complexityLayouts.length;
  return complexityLayouts[layoutIndex];
};

export const getLayoutsByComplexity = (complexity: string): LayoutTemplate[] => {
  return layoutTemplates.filter(t => t.complexity === complexity);
};
