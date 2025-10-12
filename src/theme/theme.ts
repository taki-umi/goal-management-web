import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // indigo-500
    },
    secondary: {
      main: '#EC4899', // pink-500
    },
    background: {
      default: '#F9FAFB', // gray-50
      paper: '#FFFFFF',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8', // indigo-400
    },
    secondary: {
      main: '#F472B6', // pink-400
    },
    background: {
      default: '#111827', // gray-900
      paper: '#1F2937', // gray-800
    },
  },
});

export { lightTheme, darkTheme };
