import { Outlet } from 'react-router-dom';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-4 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
