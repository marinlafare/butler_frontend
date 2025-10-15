// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 1. Import tools from TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Import tools from Material-UI (MUI)
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 3. Create a client for TanStack Query
const queryClient = new QueryClient();

// 4. Create a basic dark theme for MUI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 5. Wrap the App with the providers */}
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline /> {/* A reset for consistent styling */}
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);