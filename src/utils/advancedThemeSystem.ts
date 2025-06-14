
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
  
  // Component specific
  cardBackground: string;
  cardBorder: string;
  chartColors: string[];
  tooltipBackground: string;
  tooltipBorder: string;
  progressBackground: string;
  progressFill: string;
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
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    chartColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
    tooltipBackground: '#1f2937',
    tooltipBorder: '#374151',
    progressBackground: '#e5e7eb',
    progressFill: '#3b82f6'
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
    cardBackground: '#1e293b',
    cardBorder: '#334155',
    chartColors: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#22d3ee'],
    tooltipBackground: '#374151',
    tooltipBorder: '#4b5563',
    progressBackground: '#374151',
    progressFill: '#60a5fa'
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
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    chartColors: ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c2d12', '#0284c7'],
    tooltipBackground: '#1f2937',
    tooltipBorder: '#374151',
    progressBackground: '#e5e7eb',
    progressFill: '#1e40af'
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
    cardBackground: 'rgba(255, 255, 255, 0.15)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    chartColors: ['#10dcb4', '#ff6b9d', '#ffd93d', '#6bcf7f', '#a78bfa', '#22d3ee'],
    tooltipBackground: 'rgba(0, 0, 0, 0.8)',
    tooltipBorder: 'rgba(255, 255, 255, 0.2)',
    progressBackground: 'rgba(255, 255, 255, 0.2)',
    progressFill: '#10dcb4'
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
    cardBackground: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(255, 255, 255, 0.4)',
    chartColors: ['#4299e1', '#48bb78', '#ed8936', '#f56565', '#9f7aea', '#38b2ac'],
    tooltipBackground: 'rgba(45, 55, 72, 0.95)',
    tooltipBorder: 'rgba(255, 255, 255, 0.2)',
    progressBackground: 'rgba(255, 255, 255, 0.4)',
    progressFill: '#4299e1'
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
    cardBackground: '#ffffff',
    cardBorder: '#bdc3c7',
    chartColors: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'],
    tooltipBackground: '#34495e',
    tooltipBorder: '#2c3e50',
    progressBackground: '#ecf0f1',
    progressFill: '#3498db'
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
