'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useTheme } from 'next-themes';
import { lightTheme, darkTheme } from '@/theme/theme';

const muiCache = createCache({ key: 'mui', prepend: true });

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}