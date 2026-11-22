export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  variables: {
    bgCanvas: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accentPrimary: string;
    accentSun: string;
    success: string;
    alert: string;
    info: string;
    borderSubtle: string;
    cardShadow: string;
    radiusCard: string;
    radiusPill: string;
  };
}

export const THEMES: Record<string, ThemeDefinition> = {
  'sunny-family': {
    id: 'sunny-family',
    name: 'Sunny Family',
    description: 'Bright, warm, and inviting family dining theme with joyful coral & sun accents',
    variables: {
      bgCanvas: '#FFF9F2',
      bgCard: '#FFFFFF',
      textPrimary: '#3A2A22',
      textSecondary: '#7A6658',
      textMuted: '#A89689',
      accentPrimary: '#FF7A45',
      accentSun: '#FFC233',
      success: '#2DBE7E',
      alert: '#FF5A6E',
      info: '#8B6CF6',
      borderSubtle: 'rgba(58, 42, 34, 0.08)',
      cardShadow: '0 8px 30px rgba(58, 42, 34, 0.06)',
      radiusCard: '24px',
      radiusPill: '999px',
    },
  },
  'modern-green': {
    id: 'modern-green',
    name: 'Modern Green',
    description: 'Lush botanical garden aesthetic with rich sage & pistachio highlights',
    variables: {
      bgCanvas: '#F4F8F5',
      bgCard: '#FFFFFF',
      textPrimary: '#1C2E24',
      textSecondary: '#526A5C',
      textMuted: '#829C8E',
      accentPrimary: '#2D7A58',
      accentSun: '#A3E635',
      success: '#10B981',
      alert: '#EF4444',
      info: '#6366F1',
      borderSubtle: 'rgba(28, 46, 36, 0.08)',
      cardShadow: '0 8px 30px rgba(28, 46, 36, 0.06)',
      radiusCard: '24px',
      radiusPill: '999px',
    },
  },
};

export const DEFAULT_THEME_ID = 'sunny-family';
