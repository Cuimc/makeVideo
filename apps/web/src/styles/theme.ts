import type { GlobalThemeOverrides } from 'naive-ui';

export const appThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2563EB',
    primaryColorHover: '#1D4ED8',
    primaryColorPressed: '#1E40AF',
    successColor: '#16A34A',
    warningColor: '#D97706',
    errorColor: '#DC2626',
    textColorBase: '#374151',
    textColor1: '#111827',
    textColor2: '#374151',
    textColor3: '#6B7280',
    borderColor: '#E5E7EB',
    borderRadius: '12px',
    borderRadiusSmall: '8px',
  },
  Card: {
    borderRadius: '12px',
  },
  Button: {
    borderRadiusSmall: '8px',
    borderRadiusMedium: '8px',
  },
  Input: {
    borderRadius: '8px',
  },
  Select: {
    peers: {
      InternalSelection: {
        borderRadius: '8px',
      },
    },
  },
  Modal: {
    borderRadius: '12px',
  },
};
