// src/components/layout/MainLayout.tsx
import React from 'react';
import type { ReactNode } from 'react'; 
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    // AGREGAMOS: 'animate-enter' (nuestra clase custom)
    // Esto hará que todo el dashboard entre suavemente
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 animate-enter">
      
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};