import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

const baseTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 500 }
  },
  shape: { 
    borderRadius: 8 
  },
});

const lightThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { 
      default: '#ffffff',
      paper: '#ffffff'
    },
    text: {
      primary: '#171717',
      secondary: '#666666'
    }
  },
};

const darkThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { 
      default: '#0a0a0a',
      paper: '#1a1a1a'
    },
    text: {
      primary: '#ededed',
      secondary: '#aaaaaa'
    }
  },
};

const componentsOverrides = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0
        },
        'html, body': {
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          WebkitTextSizeAdjust: '100%',
          height: '100%'
        },
        'body': {
          lineHeight: 1.5,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        },
        'img, picture, video, canvas, svg': {
          display: 'block',
          maxWidth: '100%'
        },
        'p, h1, h2, h3, h4, h5, h6': {
          overflowWrap: 'break-word'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 40,
          padding: '8px 16px',
          letterSpacing: '0.01em',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    },
  }
};

export const lightTheme = responsiveFontSizes(
  createTheme(deepmerge(deepmerge(baseTheme, lightThemeOptions), componentsOverrides))
);

export const darkTheme = responsiveFontSizes(
  createTheme(deepmerge(deepmerge(baseTheme, darkThemeOptions), componentsOverrides))
);
