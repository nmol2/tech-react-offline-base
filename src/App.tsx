import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { Suspense } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Reports />} />
            </Routes>
          </Suspense>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
