
export interface AdvancedThemeColors {
  // Background colors
  primary: string;
  secondary: string;
  surface: string;
  background: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // State colors
  positive: string;
  negative: string;
  warning: string;
  info: string;
  
  // Interactive colors
  hover: string;
  active: string;
  focus: string;
  
  // Navigation specific
  navigationBackground: string;
  navigationBorder: string;
  navigationText: string;
  navigationTextSecondary: string;
  navigationHover: string;
  navigationActive: string;
  
  // Component specific
  cardBackground: string;
  cardBorder: string;
  chartColors: string[];
  chartBackground: string;
  chartGridLines: string;
  chartAxes: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tooltipText: string;
  progressBackground: string;
  progressFill: string;
  
  // Enhanced color categories
  buttonPrimary: string;
  buttonSecondary: string;
  buttonHover: string;
  inputBackground: string;
  inputBorder: string;
  inputFocus: string;
  badgeColors: string[];
  accentColors: string[];
  shadowColors: string[];
}

export const advancedThemes: Record<string, AdvancedThemeColors> = {
  minimal: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    surface: '#f1f5f9',
    background: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    positive: '#10b981',
    negative: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    hover: '#f1f5f9',
    active: '#e2e8f0',
    focus: '#3b82f6',
    navigationBackground: '#ffffff',
    navigationBorder: '#e2e8f0',
    navigationText: '#0f172a',
    navigationTextSecondary: '#64748b',
    navigationHover: '#f8fafc',
    navigationActive: '#e2e8f0',
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    chartColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
    chartBackground: '#ffffff',
    chartGridLines: '#f1f5f9',
    chartAxes: '#94a3b8',
    tooltipBackground: '#1f2937',
    tooltipBorder: '#374151',
    tooltipText: '#ffffff',
    progressBackground: '#e5e7eb',
    progressFill: '#3b82f6',
    // Enhanced colors
    buttonPrimary: '#3b82f6',
    buttonSecondary: '#6b7280',
    buttonHover: '#2563eb',
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#3b82f6',
    badgeColors: ['#dbeafe', '#dcfce7', '#fef3c7', '#fecaca'],
    accentColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    shadowColors: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.2)']
  },
  dark: {
    primary: '#0f172a',
    secondary: '#1e293b',
    surface: '#334155',
    background: '#020617',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    positive: '#22c55e',
    negative: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    hover: '#1e293b',
    active: '#334155',
    focus: '#60a5fa',
    navigationBackground: '#0f172a',
    navigationBorder: '#1e293b',
    navigationText: '#f8fafc',
    navigationTextSecondary: '#94a3b8',
    navigationHover: '#1e293b',
    navigationActive: '#334155',
    cardBackground: '#1e293b',
    cardBorder: '#334155',
    chartColors: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#22d3ee'],
    chartBackground: '#1e293b',
    chartGridLines: '#334155',
    chartAxes: '#64748b',
    tooltipBackground: '#374151',
    tooltipBorder: '#4b5563',
    tooltipText: '#f9fafb',
    progressBackground: '#374151',
    progressFill: '#60a5fa',
    // Enhanced colors
    buttonPrimary: '#3b82f6',
    buttonSecondary: '#4b5563',
    buttonHover: '#2563eb',
    inputBackground: '#1f2937',
    inputBorder: '#374151',
    inputFocus: '#60a5fa',
    badgeColors: ['#1e3a8a', '#166534', '#92400e', '#991b1b'],
    accentColors: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'],
    shadowColors: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.5)']
  },
  corporate: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    surface: '#dbeafe',
    background: '#f8fafc',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#64748b',
    positive: '#059669',
    negative: '#dc2626',
    warning: '#d97706',
    info: '#0284c7',
    hover: '#eff6ff',
    active: '#dbeafe',
    focus: '#3b82f6',
    navigationBackground: '#ffffff',
    navigationBorder: '#e2e8f0',
    navigationText: '#1e40af',
    navigationTextSecondary: '#64748b',
    navigationHover: '#eff6ff',
    navigationActive: '#dbeafe',
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    chartColors: ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c2d12', '#0284c7'],
    chartBackground: '#ffffff',
    chartGridLines: '#f1f5f9',
    chartAxes: '#64748b',
    tooltipBackground: '#1f2937',
    tooltipBorder: '#374151',
    tooltipText: '#ffffff',
    progressBackground: '#e5e7eb',
    progressFill: '#1e40af',
    // Enhanced colors
    buttonPrimary: '#1e40af',
    buttonSecondary: '#6b7280',
    buttonHover: '#1e3a8a',
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#1e40af',
    badgeColors: ['#dbeafe', '#dcfce7', '#fef3c7', '#fecaca'],
    accentColors: ['#1e40af', '#059669', '#d97706', '#dc2626'],
    shadowColors: ['rgba(30, 64, 175, 0.1)', 'rgba(0, 0, 0, 0.05)', 'rgba(30, 64, 175, 0.2)']
  },
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    surface: 'rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    positive: '#10dcb4',
    negative: '#ff6b9d',
    warning: '#ffd93d',
    info: '#6bcf7f',
    hover: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(255, 255, 255, 0.2)',
    focus: '#6bcf7f',
    navigationBackground: 'rgba(255, 255, 255, 0.1)',
    navigationBorder: 'rgba(255, 255, 255, 0.2)',
    navigationText: '#ffffff',
    navigationTextSecondary: 'rgba(255, 255, 255, 0.7)',
    navigationHover: 'rgba(255, 255, 255, 0.15)',
    navigationActive: 'rgba(255, 255, 255, 0.25)',
    cardBackground: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    chartColors: ['#10dcb4', '#ff6b9d', '#ffd93d', '#6bcf7f', '#a78bfa', '#22d3ee'],
    chartBackground: 'rgba(255, 255, 255, 0.05)',
    chartGridLines: 'rgba(255, 255, 255, 0.1)',
    chartAxes: 'rgba(255, 255, 255, 0.4)',
    tooltipBackground: 'rgba(0, 0, 0, 0.8)',
    tooltipBorder: 'rgba(255, 255, 255, 0.2)',
    tooltipText: '#ffffff',
    progressBackground: 'rgba(255, 255, 255, 0.2)',
    progressFill: '#10dcb4',
    // Enhanced colors
    buttonPrimary: 'linear-gradient(135deg, #10dcb4 0%, #6bcf7f 100%)',
    buttonSecondary: 'rgba(255, 255, 255, 0.2)',
    buttonHover: 'linear-gradient(135deg, #0bb89e 0%, #5bb96b 100%)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    inputBorder: 'rgba(255, 255, 255, 0.3)',
    inputFocus: '#6bcf7f',
    badgeColors: ['rgba(16, 220, 180, 0.2)', 'rgba(255, 107, 157, 0.2)', 'rgba(255, 217, 61, 0.2)', 'rgba(107, 207, 127, 0.2)'],
    accentColors: ['#10dcb4', '#ff6b9d', '#ffd93d', '#6bcf7f'],
    shadowColors: ['rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.3)']
  },
  creative: {
    primary: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    secondary: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    surface: 'rgba(255, 255, 255, 0.9)',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    textPrimary: '#2d3748',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    positive: '#48bb78',
    negative: '#f56565',
    warning: '#ed8936',
    info: '#4299e1',
    hover: 'rgba(255, 255, 255, 0.7)',
    active: 'rgba(255, 255, 255, 0.9)',
    focus: '#4299e1',
    navigationBackground: 'rgba(255, 255, 255, 0.8)',
    navigationBorder: 'rgba(255, 255, 255, 0.4)',
    navigationText: '#2d3748',
    navigationTextSecondary: '#718096',
    navigationHover: 'rgba(255, 255, 255, 0.9)',
    navigationActive: 'rgba(255, 255, 255, 0.95)',
    cardBackground: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(255, 255, 255, 0.4)',
    chartColors: ['#4299e1', '#48bb78', '#ed8936', '#f56565', '#9f7aea', '#38b2ac'],
    chartBackground: 'rgba(255, 255, 255, 0.6)',
    chartGridLines: 'rgba(255, 255, 255, 0.8)',
    chartAxes: '#718096',
    tooltipBackground: 'rgba(45, 55, 72, 0.95)',
    tooltipBorder: 'rgba(255, 255, 255, 0.2)',
    tooltipText: '#ffffff',
    progressBackground: 'rgba(255, 255, 255, 0.4)',
    progressFill: '#4299e1',
    // Enhanced colors
    buttonPrimary: 'linear-gradient(135deg, #4299e1 0%, #48bb78 100%)',
    buttonSecondary: 'rgba(255, 255, 255, 0.6)',
    buttonHover: 'linear-gradient(135deg, #3182ce 0%, #38a169 100%)',
    inputBackground: 'rgba(255, 255, 255, 0.9)',
    inputBorder: 'rgba(255, 255, 255, 0.5)',
    inputFocus: '#4299e1',
    badgeColors: ['rgba(66, 153, 225, 0.2)', 'rgba(72, 187, 120, 0.2)', 'rgba(237, 137, 54, 0.2)', 'rgba(245, 101, 101, 0.2)'],
    accentColors: ['#4299e1', '#48bb78', '#ed8936', '#f56565'],
    shadowColors: ['rgba(255, 154, 158, 0.2)', 'rgba(168, 237, 234, 0.2)', 'rgba(254, 207, 239, 0.2)']
  },
  flat: {
    primary: '#34495e',
    secondary: '#95a5a6',
    surface: '#ecf0f1',
    background: '#bdc3c7',
    textPrimary: '#2c3e50',
    textSecondary: '#34495e',
    textMuted: '#7f8c8d',
    positive: '#27ae60',
    negative: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
    hover: '#ecf0f1',
    active: '#d5dbdb',
    focus: '#3498db',
    navigationBackground: '#34495e',
    navigationBorder: '#2c3e50',
    navigationText: '#ecf0f1',
    navigationTextSecondary: '#95a5a6',
    navigationHover: '#4a5f7a',
    navigationActive: '#5d6d7e',
    cardBackground: '#ffffff',
    cardBorder: '#bdc3c7',
    chartColors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'],
    chartBackground: '#ffffff',
    chartGridLines: '#ecf0f1',
    chartAxes: '#7f8c8d',
    tooltipBackground: '#34495e',
    tooltipBorder: '#2c3e50',
    tooltipText: '#ecf0f1',
    progressBackground: '#ecf0f1',
    progressFill: '#3498db',
    // Enhanced colors
    buttonPrimary: '#3498db',
    buttonSecondary: '#95a5a6',
    buttonHover: '#2980b9',
    inputBackground: '#ffffff',
    inputBorder: '#bdc3c7',
    inputFocus: '#3498db',
    badgeColors: ['#d6eaf8', '#d5f4e6', '#fdeaa7', '#fadbd8'],
    accentColors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c'],
    shadowColors: ['rgba(52, 73, 94, 0.1)', 'rgba(0, 0, 0, 0.05)', 'rgba(52, 73, 94, 0.2)']
  }
};

export const getNavigationThemeDefaults = (navigationStyle: string, baseTheme: AdvancedThemeColors) => {
  switch (navigationStyle) {
    case 'left-full':
    case 'left-collapsible':
      return {
        ...baseTheme,
        navigationBackground: baseTheme.navigationBackground,
        navigationBorder: baseTheme.navigationBorder,
        navigationText: baseTheme.navigationText,
        navigationTextSecondary: baseTheme.navigationTextSecondary,
        navigationHover: baseTheme.navigationHover,
        navigationActive: baseTheme.navigationActive,
      };
    
    case 'top-wide':
      return {
        ...baseTheme,
        navigationBackground: baseTheme.cardBackground,
        navigationBorder: baseTheme.cardBorder,
        navigationText: baseTheme.textPrimary,
        navigationTextSecondary: baseTheme.textSecondary,
        navigationHover: baseTheme.hover,
        navigationActive: baseTheme.active,
      };
    
    case 'top-tabs':
      return {
        ...baseTheme,
        navigationBackground: baseTheme.surface,
        navigationBorder: baseTheme.cardBorder,
        navigationText: baseTheme.textPrimary,
        navigationTextSecondary: baseTheme.textMuted,
        navigationHover: baseTheme.hover,
        navigationActive: baseTheme.primary,
      };
    
    case 'top-minimal':
      return {
        ...baseTheme,
        navigationBackground: 'transparent',
        navigationBorder: 'transparent',
        navigationText: baseTheme.textPrimary,
        navigationTextSecondary: baseTheme.textMuted,
        navigationHover: baseTheme.hover,
        navigationActive: baseTheme.surface,
      };
    
    default:
      return baseTheme;
  }
};

export const generateColorPalette = (baseColors: string[]): string[] => {
  // Generate variations of base colors for charts
  const variations: string[] = [];
  
  baseColors.forEach(color => {
    variations.push(color);
    // Add lighter version
    variations.push(adjustColorBrightness(color, 0.3));
    // Add darker version
    variations.push(adjustColorBrightness(color, -0.2));
  });
  
  return variations;
};

export const updateThemeFromPalette = (palette: string[], baseTheme: AdvancedThemeColors): AdvancedThemeColors => {
  return {
    ...baseTheme,
    chartColors: palette,
    buttonPrimary: palette[0] || baseTheme.buttonPrimary,
    buttonSecondary: palette[1] || baseTheme.buttonSecondary,
    buttonHover: adjustColorBrightness(palette[0] || baseTheme.buttonPrimary, -0.1),
    inputFocus: palette[0] || baseTheme.inputFocus,
    focus: palette[0] || baseTheme.focus,
    progressFill: palette[0] || baseTheme.progressFill,
    positive: palette[1] || baseTheme.positive,
    info: palette[2] || baseTheme.info,
    warning: palette[3] || baseTheme.warning,
    negative: palette[4] || baseTheme.negative,
    accentColors: palette.slice(0, 4),
    badgeColors: palette.slice(0, 4).map(color => adjustColorBrightness(color, 0.4))
  };
};

const adjustColorBrightness = (color: string, amount: number): string => {
  // Simple color brightness adjustment
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount * 255;
  let g = (num >> 8 & 0x00FF) + amount * 255;
  let b = (num & 0x0000FF) + amount * 255;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
};

// Filter layout types
export const filterLayouts = [
  { 
    id: 'horizontal-cards', 
    name: 'Horizontal Cards', 
    description: 'Filter options displayed as horizontal cards',
    preview: 'Cards in a row'
  },
  { 
    id: 'vertical-sidebar', 
    name: 'Vertical Sidebar', 
    description: 'Filters in a collapsible side panel',
    preview: 'Side panel layout'
  },
  { 
    id: 'dropdown-compact', 
    name: 'Dropdown Compact', 
    description: 'Compact dropdown filters',
    preview: 'Minimal dropdowns'
  },
  { 
    id: 'tabs-grouped', 
    name: 'Tabs Grouped', 
    description: 'Filters organized in tab groups',
    preview: 'Tabbed interface'
  },
  { 
    id: 'accordion-sections', 
    name: 'Accordion Sections', 
    description: 'Collapsible filter sections',
    preview: 'Expandable sections'
  },
  { 
    id: 'floating-panel', 
    name: 'Floating Panel', 
    description: 'Floating filter panel overlay',
    preview: 'Overlay panel'
  }
];

export const getFilterLayoutComponent = (layoutId: string, theme: AdvancedThemeColors) => {
  const filterOptions = [
    { id: 'category', label: 'Category', type: 'select', options: ['All', 'Sales', 'Marketing', 'Finance'] },
    { id: 'dateRange', label: 'Date Range', type: 'select', options: ['Last 7 days', 'Last 30 days', 'Last 90 days'] },
    { id: 'status', label: 'Status', type: 'checkbox', options: ['Active', 'Pending', 'Completed'] },
    { id: 'priority', label: 'Priority', type: 'radio', options: ['High', 'Medium', 'Low'] }
  ];

  return { layoutId, filterOptions, theme };
};
