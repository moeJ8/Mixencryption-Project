import { Outlet } from 'react-router-dom';
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-3 py-8 sm:px-4 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
