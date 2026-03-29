import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Globe, ChevronDown, Store } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const cartItemsCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const navLinks = [
    { href: '/', label: t('nav.home'), isAnchor: false },
    { href: '/#shop', label: t('nav.shop'), isAnchor: true },
    { href: '/#about', label: t('nav.about'), isAnchor: true },
    { href: '/#contact', label: t('nav.contact'), isAnchor: true },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full section-padding">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663271387062/VF4RMPmDrzh3fniVRJQ8RL/ak-store-logo-5Bhifpi6HoyoBum9BqZXBB.webp" 
              alt="AKRENACE Logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-110" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[#211e0f] font-semibold text-lg hover:text-[#f58a1f] 
                           transition-colors duration-300 group"
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      const targetId = link.href.replace('/#', '#');
                      const element = document.querySelector(targetId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f6b638] 
                             transition-all duration-300 group-hover:w-full"
                  />
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-[#211e0f] font-semibold text-lg hover:text-[#f58a1f] 
                           transition-colors duration-300 group"
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f6b638] 
                             transition-all duration-300 group-hover:w-full"
                  />
                </Link>
              )
            ))}
            {/* Products Link */}
            <Link
              to="/products"
              className="relative text-[#211e0f] font-semibold text-lg hover:text-[#f58a1f] 
                       transition-colors duration-300 group flex items-center gap-1"
            >
              <Store className="w-5 h-5" />
              Products
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f6b638] 
                         transition-all duration-300 group-hover:w-full"
              />
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full 
                           bg-[#f6b638]/10 hover:bg-[#f6b638]/20 
                           transition-colors duration-300"
                >
                  <Globe className="w-5 h-5 text-[#211e0f]" />
                  <span className="hidden sm:inline text-sm font-semibold text-[#211e0f]">
                    {languages.find((l) => l.code === i18n.language)?.label || 'English'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#211e0f]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-[#f6b638]/20">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-[#f6b638]/10"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-3 rounded-full bg-[#f6b638] hover:bg-[#f58a1f] 
                       transition-all duration-300 hover:scale-110 group"
            >
              <ShoppingBag className="w-5 h-5 text-[#211e0f] transition-transform duration-300 group-hover:rotate-12" />
              {cartItemsCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#211e0f] text-white 
                           text-xs font-bold rounded-full flex items-center justify-center
                           animate-bounce"
                >
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden p-3 rounded-full bg-[#211e0f] hover:bg-[#f58a1f] 
                           transition-all duration-300 hover:scale-110"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-white" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#fff9ed] border-l-[#f6b638]/20 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-[#211e0f] text-2xl" style={{ fontFamily: 'Rowdies, cursive' }}>
                    AKRENACE
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-10">
                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-[#211e0f]/60 font-bold px-2">Menu</p>
                    {navLinks.map((link) => (
                      link.isAnchor ? (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => {
                            setIsMobileMenuOpen(false);
                            if (window.location.pathname === '/') {
                              e.preventDefault();
                              const targetId = link.href.replace('/#', '#');
                              const element = document.querySelector(targetId);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }
                          }}
                          className="block px-4 py-3 rounded-lg text-lg font-semibold text-[#211e0f] hover:bg-[#f6b638]/20 hover:text-[#f58a1f] transition-all duration-300"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-lg font-semibold text-[#211e0f] hover:bg-[#f6b638]/20 hover:text-[#f58a1f] transition-all duration-300"
                        >
                          {link.label}
                        </Link>
                      )
                    ))}
                    <Link
                      to="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold text-[#211e0f] hover:bg-[#f6b638]/20 hover:text-[#f58a1f] transition-all duration-300"
                    >
                      <Store className="w-5 h-5" />
                      All Products
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#f6b638]/20"></div>

                  {/* Language Selector */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#211e0f]/60 font-bold px-2 mb-3">Language</p>
                    <div className="space-y-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            i18n.language === lang.code
                              ? 'bg-[#f6b638] text-[#211e0f] shadow-md'
                              : 'text-[#211e0f] hover:bg-[#f6b638]/20 hover:text-[#f58a1f]'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
