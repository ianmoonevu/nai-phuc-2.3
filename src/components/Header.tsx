import React, { useState } from 'react';
import { HokiLogo } from './HokiLogo';
import { PageRoute } from '../types';
import { useData } from '../context/DataContext';
import { getPathForRoute } from '../utils/router';
import { Menu, X, Globe, UserCheck } from 'lucide-react';

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

  const navItems: { label: string; route: PageRoute; path: string }[] = [
    { label: 'ABOUT US', route: 'about', path: '/about-us' },
    { label: 'PRODUCTS', route: 'products', path: '/products' },
    { label: 'PROJECTS', route: 'projects', path: '/projects' },
    { label: 'KNOWLEDGE', route: 'knowledge', path: '/knowledge' },
    { label: 'CONTACT', route: 'contact', path: '/contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, route: PageRoute) => {
    // allow ctrl/cmd/shift clicks to open standard new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(route);
  };

  const handleGlobalLocator = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
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
    <header className="sticky top-0 z-50 px-3 sm:px-6 py-3 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e5e9ee]/60 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo Lockup */}
        <a
          id="header-brand-logo-btn"
          href="/"
          aria-label="HOKI Structural Fiber — Engineering the Future of Concrete"
          title="HOKI Structural Fiber — Engineering the Future of Concrete"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="group focus:outline-none flex items-center cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
        >
          {branding.headerLogoUrl ? (
            <img
              src={branding.headerLogoUrl}
              alt="HOKI Structural Fiber"
              style={{ height: `${branding.headerLogoHeight || 44}px` }}
              className="w-auto object-contain max-w-[240px] sm:max-w-[280px]"
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
          {/* Fast CTA Button for Tablet/Mobile Header */}
          <button
            id="header-compact-consult-btn"
            onClick={onOpenConsultation}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#006e21] text-white shadow-bubble-sm hover:bg-[#005a1b] active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Consult</span>
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-full bg-[#f4f6f8] shadow-bubble-sm border border-[#e2e6eb] text-[#00356a] hover:bg-white focus:outline-none cursor-pointer transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 bg-[#f4f6f8] rounded-3xl shadow-bubble border border-[#e2e6eb] flex flex-col gap-2 transition-all">
          {navItems.map((item) => (
            <a
              key={item.route}
              id={`mobile-nav-${item.route}`}
              href={item.path}
              onClick={(e) => {
                handleLinkClick(e, item.route);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                currentRoute === item.route
                  ? 'bg-[#00356a] text-white'
                  : 'text-[#00356a] hover:bg-white'
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#e2e6eb] mt-1 flex flex-col gap-2">
            <a
              id="mobile-global-network-btn"
              href="/contact#contact-global-network-section"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleGlobalLocator(e);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#00356a] bg-white border border-[#e2e6eb] shadow-bubble-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#006e21]" />
              <span>Global Network Locator</span>
            </a>
            <button
              id="mobile-consultation-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm cursor-pointer bg-[#006e21] text-white hover:bg-[#005a1b]"
            >
              <UserCheck className="w-4 h-4" />
              <span>TALK TO AN ENGINEER</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

