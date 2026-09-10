import React, { useState, useEffect } from 'react';
import { HokiLogo } from './HokiLogo';
import { PageRoute } from '../types';
import { useData } from '../context/DataContext';
import { Menu, X, Globe, UserCheck, PhoneCall, ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenConsultation,
}) => {
  const { branding } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rawPhone = branding.hotlinePhone || '0916 576 156';
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems: { label: string; route: PageRoute; path: string; desc?: string }[] = [
    { label: 'ABOUT US', route: 'about', path: '/about-us', desc: 'Alpha Hub Manufacturing & Science' },
    { label: 'PRODUCTS', route: 'products', path: '/products', desc: 'Steel Fiber Portfolio & Dosage Engine' },
    { label: 'PROJECTS', route: 'projects', path: '/projects', desc: 'Mega-Infrastructure Case Studies' },
    { label: 'KNOWLEDGE', route: 'knowledge', path: '/knowledge', desc: 'TR34 Research & LCA Intelligence' },
    { label: 'CONTACT', route: 'contact', path: '/contact', desc: 'RFQ Calculator & Jobsite Samples' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, route: PageRoute) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  const handleGlobalLocator = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate('contact');
    setTimeout(() => {
      const el = document.getElementById('contact-global-network-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 900, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <header className="sticky top-0 z-50 px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e5e9ee]/80 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo Lockup */}
          <a
            id="header-brand-logo-btn"
            href="/"
            aria-label="HOKI Structural Fiber — Engineering the Future of Concrete"
            title="HOKI Structural Fiber — Engineering the Future of Concrete"
            onClick={(e) => handleLinkClick(e, 'home')}
            className="group focus:outline-none flex items-center cursor-pointer transition-transform duration-200 active:scale-[0.98]"
          >
            {branding.headerLogoUrl ? (
              <img
                src={branding.headerLogoUrl}
                alt="HOKI Structural Fiber"
                style={{ height: `${branding.headerLogoHeight || 40}px` }}
                className="w-auto object-contain max-h-10 sm:max-h-12 max-w-[200px] sm:max-w-[280px]"
              />
            ) : (
              <HokiLogo size="md" />
            )}
          </a>

          {/* Desktop Navigation Links: 5 Pillars with dedicated clean URLs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f4f6f8] px-3 py-1.5 rounded-full shadow-bubble-sm border border-[#e2e6eb]">
            {navItems.map((item) => {
              const isActive =
                currentRoute === item.route ||
                (item.route === 'projects' && currentRoute === 'project-detail') ||
                (item.route === 'knowledge' && (currentRoute === 'blog' || currentRoute === 'esg'));
              return (
                <a
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  href={item.path}
                  onClick={(e) => handleLinkClick(e, item.route)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#00356a] text-white shadow-sm'
                      : 'text-[#00356a]/75 hover:text-[#00356a] hover:bg-white/80'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Global Utilities: Visible on Large Screens */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Global Network Locator */}
            <a
              id="header-global-locator-btn"
              href="/contact#contact-global-network-section"
              onClick={(e) => handleGlobalLocator(e)}
              title="Global Supply Network & Regional Facilities"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#00356a] bg-[#f4f6f8] hover:bg-white border border-[#e2e6eb] shadow-bubble-sm hover:shadow-bubble active:scale-[0.98] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#006e21]" />
              <span className="hidden xl:inline">Global Network</span>
              <span className="xl:hidden">Locations</span>
            </a>

            {/* Primary CTA: TALK TO AN ENGINEER */}
            <button
              id="header-talk-to-engineer-btn"
              onClick={onOpenConsultation}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-bubble-sm hover:shadow-bubble active:scale-[0.98] transition-all duration-200 cursor-pointer bg-[#006e21] text-white hover:bg-[#005a1b]"
            >
              <UserCheck className="w-4 h-4" />
              <span>TALK TO AN ENGINEER</span>
            </button>
          </div>

          {/* Mobile & Tablet Controls (Below lg / 1024px) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Compact Call Button on Tablet */}
            {branding.hotlineEnabled !== false && (
              <a
                id="header-mobile-call-btn"
                href={`tel:${cleanPhone}`}
                title={`Call ${rawPhone}`}
                className="flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-[#006e21]/10 text-[#006e21] border border-[#006e21]/20 shadow-bubble-sm active:scale-95 transition-all"
                aria-label="Call Hotline"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            )}

            {/* Fast CTA Button for Tablet */}
            <button
              id="header-compact-consult-btn"
              onClick={onOpenConsultation}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#006e21] text-white shadow-bubble-sm hover:bg-[#005a1b] active:scale-[0.98] transition-all cursor-pointer min-h-[40px]"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Consult</span>
            </button>

            {/* Hamburger Menu Toggle Button - 44px touch target */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f4f6f8] shadow-bubble-sm border border-[#e2e6eb] text-[#00356a] hover:bg-white active:scale-95 focus:outline-none cursor-pointer transition-all"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Overlay & Panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-white/98 backdrop-blur-xl border-b border-[#e2e6eb] shadow-2xl p-4 sm:p-6 flex flex-col gap-2 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-3 duration-200 z-50">
            {/* Nav Items List */}
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive =
                  currentRoute === item.route ||
                  (item.route === 'projects' && currentRoute === 'project-detail') ||
                  (item.route === 'knowledge' && (currentRoute === 'blog' || currentRoute === 'esg'));
                return (
                  <a
                    key={item.route}
                    id={`mobile-nav-${item.route}`}
                    href={item.path}
                    onClick={(e) => handleLinkClick(e, item.route)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer min-h-[46px] ${
                      isActive
                        ? 'bg-[#00356a] text-white shadow-bubble-sm'
                        : 'text-[#00356a] bg-[#f4f6f8] hover:bg-white border border-[#e2e6eb]/60'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span>{item.label}</span>
                      {item.desc && (
                        <span className={`text-[10px] font-normal normal-case tracking-normal ${
                          isActive ? 'text-white/80' : 'text-[#00356a]/60'
                        }`}>
                          {item.desc}
                        </span>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#00356a]/40'}`} />
                  </a>
                );
              })}
            </div>

            {/* Mobile Actions Section */}
            <div className="pt-3 border-t border-[#e2e6eb] mt-2 flex flex-col gap-2.5">
              <a
                id="mobile-global-network-btn"
                href="/contact#contact-global-network-section"
                onClick={(e) => handleGlobalLocator(e)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-semibold text-[#00356a] bg-[#f4f6f8] hover:bg-white border border-[#e2e6eb] shadow-bubble-sm cursor-pointer min-h-[46px]"
              >
                <Globe className="w-4 h-4 text-[#006e21]" />
                <span>Global Network & Facilities</span>
              </a>

              {branding.hotlineEnabled !== false && (
                <a
                  id="mobile-drawer-hotline-btn"
                  href={`tel:${cleanPhone}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold text-[#00356a] bg-white border border-[#006e21]/30 shadow-bubble-sm cursor-pointer min-h-[46px]"
                >
                  <PhoneCall className="w-4 h-4 text-[#006e21]" />
                  <span>Call Hotline: {rawPhone}</span>
                </a>
              )}

              <button
                id="mobile-consultation-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-bubble-sm cursor-pointer bg-[#006e21] text-white hover:bg-[#005a1b] active:scale-[0.98] transition-all min-h-[48px]"
              >
                <UserCheck className="w-4 h-4" />
                <span>TALK TO AN ENGINEER</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}
    </>
  );
};


