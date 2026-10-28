import { BrowserRouter } from 'react-router-dom';
import AuthToastSync from './components/auth/AuthToastSync';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ThemedToaster } from './theme/toast';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemedToaster />
        <AuthToastSync />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
