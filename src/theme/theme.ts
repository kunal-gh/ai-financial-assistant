import {MD3LightTheme} from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#667eea',
    secondary: '#764ba2',
    tertiary: '#f093fb',
    surface: '#ffffff',
    background: '#f8fafc',
    onSurface: '#1a202c',
    onBackground: '#2d3748',
    accent: '#4fd1c7',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
  },
};

export const gradients = {
  primary: ['#667eea', '#764ba2'],
  secondary: ['#f093fb', '#f5576c'],
  success: ['#48bb78', '#38a169'],
  warning: ['#ed8936', '#dd6b20'],
  error: ['#f56565', '#e53e3e'],
  info: ['#4299e1', '#3182ce'],
  dark: ['#2d3748', '#1a202c'],
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};