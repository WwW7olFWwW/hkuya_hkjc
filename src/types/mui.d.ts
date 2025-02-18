import '@mui/material/styles';
import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
    custom: {
      maxWidth: string;
    };
  }

  interface ThemeOptions {
    custom?: {
      maxWidth: string;
    };
  }
}

declare module '@emotion/react' {
  export interface Theme extends MuiTheme {
    custom: {
      maxWidth: string;
    };
  }
}