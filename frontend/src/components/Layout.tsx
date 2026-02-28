import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <img 
          src="/assets/generated/cosmic-background.dim_1920x1080.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
