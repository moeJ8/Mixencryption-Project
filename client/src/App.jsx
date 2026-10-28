import { BrowserRouter } from 'react-router-dom';
import AuthToastSync from './components/auth/AuthToastSync';
import RouteDocumentTitle from './components/routing/RouteDocumentTitle';
import ScrollToTop from './components/routing/ScrollToTop';
import { ApiStatusProvider } from './context/ApiStatusContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ThemedToaster } from './theme/toast';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiStatusProvider>
          <RouteDocumentTitle />
          <ScrollToTop />
          <ThemedToaster />
          <AuthToastSync />
          <AppRoutes />
        </ApiStatusProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
