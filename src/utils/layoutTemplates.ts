
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
  kpiLayout: LayoutPosition[];
  chartLayout: ChartPlacement[];
  maxVisuals: number;
}

// 12-column grid system layouts
export const layoutTemplates: LayoutTemplate[] = [
  {
    name: "Hero KPI Top",
    description: "KPI cards at top, charts below in grid",
    type: "hero-kpi",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 4, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 10, rowSpan: 1, colSpan: 3 }
    ],
    chartLayout: [
      { component: "primary-chart", position: { row: 2, col: 1, rowSpan: 2, colSpan: 8 }, priority: 1 },
      { component: "secondary-chart", position: { row: 2, col: 9, rowSpan: 2, colSpan: 4 }, priority: 2 },
      { component: "tertiary-chart", position: { row: 4, col: 1, rowSpan: 2, colSpan: 6 }, priority: 3 },
      { component: "quaternary-chart", position: { row: 4, col: 7, rowSpan: 2, colSpan: 6 }, priority: 4 }
    ],
    maxVisuals: 4
  },
  {
    name: "Two-Column Split",
    description: "Split layout for department-specific dashboards",
    type: "two-column",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 6 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 6 }
    ],
    chartLayout: [
      { component: "left-primary", position: { row: 2, col: 1, rowSpan: 3, colSpan: 6 }, priority: 1 },
      { component: "right-primary", position: { row: 2, col: 7, rowSpan: 3, colSpan: 6 }, priority: 2 },
      { component: "left-secondary", position: { row: 5, col: 1, rowSpan: 2, colSpan: 6 }, priority: 3 },
      { component: "right-secondary", position: { row: 5, col: 7, rowSpan: 2, colSpan: 6 }, priority: 4 }
    ],
    maxVisuals: 4
  },
  {
    name: "Z-Pattern Layout",
    description: "Balanced storytelling flow",
    type: "z-pattern",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 4 },
      { row: 1, col: 5, rowSpan: 1, colSpan: 4 },
      { row: 1, col: 9, rowSpan: 1, colSpan: 4 }
    ],
    chartLayout: [
      { component: "hero-chart", position: { row: 2, col: 1, rowSpan: 2, colSpan: 12 }, priority: 1 },
      { component: "left-detail", position: { row: 4, col: 1, rowSpan: 2, colSpan: 6 }, priority: 2 },
      { component: "right-detail", position: { row: 4, col: 7, rowSpan: 2, colSpan: 6 }, priority: 3 },
      { component: "bottom-insight", position: { row: 6, col: 1, rowSpan: 1, colSpan: 12 }, priority: 4 }
    ],
    maxVisuals: 4
  },
  {
    name: "Grid 2x2",
    description: "Equal chart weight for exploration",
    type: "grid-2x2",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 4, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 10, rowSpan: 1, colSpan: 3 }
    ],
    chartLayout: [
      { component: "top-left", position: { row: 2, col: 1, rowSpan: 2, colSpan: 6 }, priority: 1 },
      { component: "top-right", position: { row: 2, col: 7, rowSpan: 2, colSpan: 6 }, priority: 2 },
      { component: "bottom-left", position: { row: 4, col: 1, rowSpan: 2, colSpan: 6 }, priority: 3 },
      { component: "bottom-right", position: { row: 4, col: 7, rowSpan: 2, colSpan: 6 }, priority: 4 }
    ],
    maxVisuals: 4
  },
  {
    name: "Grid 3x3",
    description: "Comprehensive dashboard view",
    type: "grid-3x3",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 4, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 3 },
      { row: 1, col: 10, rowSpan: 1, colSpan: 3 }
    ],
    chartLayout: [
      { component: "chart-1", position: { row: 2, col: 1, rowSpan: 2, colSpan: 4 }, priority: 1 },
      { component: "chart-2", position: { row: 2, col: 5, rowSpan: 2, colSpan: 4 }, priority: 2 },
      { component: "chart-3", position: { row: 2, col: 9, rowSpan: 2, colSpan: 4 }, priority: 3 },
      { component: "chart-4", position: { row: 4, col: 1, rowSpan: 2, colSpan: 4 }, priority: 4 },
      { component: "chart-5", position: { row: 4, col: 5, rowSpan: 2, colSpan: 4 }, priority: 5 },
      { component: "chart-6", position: { row: 4, col: 9, rowSpan: 2, colSpan: 4 }, priority: 6 }
    ],
    maxVisuals: 6
  },
  {
    name: "Focus + Detail",
    description: "Main chart with supporting details",
    type: "focus-detail",
    kpiLayout: [
      { row: 1, col: 1, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 3, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 5, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 7, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 9, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 11, rowSpan: 1, colSpan: 2 }
    ],
    chartLayout: [
      { component: "main-focus", position: { row: 2, col: 1, rowSpan: 3, colSpan: 8 }, priority: 1 },
      { component: "detail-1", position: { row: 2, col: 9, rowSpan: 1, colSpan: 4 }, priority: 2 },
      { component: "detail-2", position: { row: 3, col: 9, rowSpan: 1, colSpan: 4 }, priority: 3 },
      { component: "detail-3", position: { row: 4, col: 9, rowSpan: 1, colSpan: 4 }, priority: 4 },
      { component: "bottom-summary", position: { row: 5, col: 1, rowSpan: 1, colSpan: 12 }, priority: 5 }
    ],
    maxVisuals: 5
  }
];

export const getLayoutForComplexity = (complexity: string, visualCount: number): LayoutTemplate => {
  if (complexity === 'simple' || visualCount <= 4) {
    return layoutTemplates.find(t => t.type === 'hero-kpi') || layoutTemplates[0];
  } else if (complexity === 'moderate' || visualCount <= 6) {
    return layoutTemplates.find(t => t.type === 'grid-2x2') || layoutTemplates[1];
  } else {
    return layoutTemplates.find(t => t.type === 'grid-3x3') || layoutTemplates[2];
  }
};

export const getRandomLayoutTemplate = (): LayoutTemplate => {
  return layoutTemplates[Math.floor(Math.random() * layoutTemplates.length)];
};

export const getLayoutForPage = (pageIndex: number, totalPages: number, visualCount: number): LayoutTemplate => {
  if (pageIndex === 0) {
    return layoutTemplates.find(t => t.type === 'hero-kpi') || layoutTemplates[0];
  }
  
  // Rotate through different layouts for variety
  const layoutIndex = (pageIndex - 1) % (layoutTemplates.length - 1) + 1;
  return layoutTemplates[layoutIndex];
};
