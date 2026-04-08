import { ReactNode } from 'react';
import Navigation from './Navigation';
import CartDrawer from './CartDrawer';
import Footer from '@/sections/Footer';

interface MainLayoutProps {
  children: ReactNode;
  showCartDrawer?: boolean;
}

/**
 * MainLayout Component
 * 
 * Provides a consistent layout with Navigation and Footer for all pages.
 * Supports multi-language (Arabic, French, English) through i18n.
 * 
 * Usage:
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 */
export default function MainLayout({ children, showCartDrawer = true }: MainLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-[#fff9ed] flex flex-col">
      {/* Navigation Header */}
      <Navigation />

      {/* Cart Drawer */}
      {showCartDrawer && <CartDrawer />}

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
