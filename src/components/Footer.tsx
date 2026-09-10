import React, { useState } from 'react';
import { HokiLogo } from './HokiLogo';
import { PageRoute } from '../types';
import { useData } from '../context/DataContext';
import { Mail, CheckCircle2, ArrowUpRight, ShieldCheck, Leaf, Award, ArrowUp, Facebook, Youtube, Linkedin, Globe, PhoneCall } from 'lucide-react';
import { ZaloIcon, TikTokIcon } from './FloatingCallButton';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onOpenConsultation: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation, onOpenAdminLogin }) => {
  const { isAdminAuthenticated, branding, addConsultationRequest } = useData();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [legalModalTitle, setLegalModalTitle] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addConsultationRequest({
        name: 'Technical Bulletin Subscriber',
        firm: 'Civil / Materials Specifier',
        email: email.trim(),
        projectType: 'Technical Intelligence Dispatch Subscription',
        status: 'new',
        notes: 'Subscribed to monthly HOKI peer-reviewed technical monographs, TR34 design updates, and carbon abatement studies.'
      });
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f4f6f8] border-t border-[#e2e6eb] pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Pneumatic Bubble Card: Newsletter & Engineering Bulletin */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-bubble mb-10 sm:mb-16 border border-[#e5e9ee] flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3">
              <Leaf className="w-3.5 h-3.5" /> Technical Intelligence Dispatch
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#00356a]">
              Stay updated with peer-reviewed SFRC engineering.
            </h3>
            <p className="text-xs sm:text-sm text-[#00356a]/70 mt-1 leading-relaxed">
              Receive monthly technical monographs, TR34 design updates, and carbon abatement field case studies directly from HOKI Research Labs.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            {isSubscribed ? (
              <div className="flex items-center gap-2 bg-[#006e21]/10 text-[#006e21] px-5 py-3 rounded-full text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscription Confirmed. Welcome to HOKI Technical Dispatch.</span>
              </div>
            ) : (
              <>
                <div className="relative w-full sm:w-80">
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    placeholder="Enter engineering email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-full text-xs text-[#00356a] placeholder:text-[#00356a]/40 bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00356a]/40" />
                </div>
                <button
                  id="footer-newsletter-submit-btn"
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#00356a] text-white text-xs font-bold tracking-wider uppercase shadow-bubble-sm hover:bg-[#002244] hover:shadow-bubble transition-all cursor-pointer whitespace-nowrap"
                >
                  JOIN
                </button>
              </>
            )}
          </form>
        </div>

        {/* 4 Standard Columns + Brand Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#e2e6eb]">
          {/* Brand Intro Column per Mindnote */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <a
              href="/"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('home');
                }
              }}
              className="focus:outline-none cursor-pointer mb-2"
              title="HOKI — Innovative and Sustainable"
            >
              {branding.footerLogoUrl ? (
                <img
                  src={branding.footerLogoUrl}
                  alt="HOKI Structural Fiber"
                  style={{ height: `${branding.footerLogoHeight || 56}px` }}
                  className="w-auto object-contain max-w-[280px] sm:max-w-[320px]"
                />
              ) : (
                <HokiLogo size="lg" />
              )}
            </a>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#006e21] bg-[#006e21]/10 px-2.5 py-0.5 rounded-full">
                Innovative & Sustainable
              </span>
              <span className="text-xs font-semibold text-[#00356a]/70">
                Steel Fiber for Concrete Reinforcement
              </span>
            </div>
            <p className="text-xs text-[#00356a]/75 leading-relaxed mt-3 max-w-sm">
              HOKI delivers high-performance cold-drawn hooked-end and collated 3D steel fiber concrete reinforcement systems engineered to displace traditional welded wire mesh and rebar cages, accelerate construction cycles by up to 40%, and deliver verifiable net-zero carbon infrastructure.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#00356a]">
                <Award className="w-3 h-3 text-[#006e21]" /> ASTM A820 Type I
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#00356a]">
                <ShieldCheck className="w-3 h-3 text-[#00356a]" /> EN 14889-1 System 1
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#006e21]">
                <Leaf className="w-3 h-3" /> ISO 14040 EPD
              </span>
            </div>

            {/* Dynamic Hotline Pill */}
            {branding.hotlineEnabled !== false && (
              <div className="mt-5 p-3 rounded-2xl bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-between gap-3 w-full max-w-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#006e21]/10 text-[#006e21] flex items-center justify-center">
                    <PhoneCall className="w-4 h-4 text-[#006e21]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00356a]/60">
                      {branding.hotlineLabel || 'Engineering Hotline'}
                    </span>
                    <span className="text-xs font-black font-mono text-[#00356a]">
                      {branding.hotlinePhone || '0916 576 156'}
                    </span>
                  </div>
                </div>
                <a
                  id="footer-call-now-pill"
                  href={`tel:${(branding.hotlinePhone || '0916 576 156').replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#006e21] hover:bg-[#005a1b] text-white text-[11px] font-bold tracking-wider uppercase shadow-bubble-sm transition-all"
                >
                  CALL NOW
                </a>
              </div>
            )}

            {/* Social Channels: Zalo, Facebook, LinkedIn, YouTube, TikTok + Global Locations */}
            <div className="mt-5 flex flex-col items-start gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00356a]/60">
                Global &amp; Social Channels
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Zalo */}
                {branding.socialLinks?.zalo?.enabled !== false && branding.socialLinks?.zalo?.url && (
                  <a
                    id="footer-social-zalo"
                    href={branding.socialLinks.zalo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with HOKI on Zalo"
                    title="Zalo Official Support"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center text-[#00356a] hover:text-[#0068FF] hover:border-[#0068FF]/40 hover:shadow-bubble hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                  >
                    <ZaloIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}

                {/* Facebook */}
                {branding.socialLinks?.facebook?.enabled !== false && branding.socialLinks?.facebook?.url && (
                  <a
                    id="footer-social-facebook"
                    href={branding.socialLinks.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow HOKI on Facebook"
                    title="Facebook"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center text-[#00356a] hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:shadow-bubble hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                  >
                    <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}

                {/* LinkedIn */}
                {branding.socialLinks?.linkedin?.enabled !== false && branding.socialLinks?.linkedin?.url && (
                  <a
                    id="footer-social-linkedin"
                    href={branding.socialLinks.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with HOKI on LinkedIn"
                    title="LinkedIn"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center text-[#00356a] hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:shadow-bubble hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                  >
                    <Linkedin className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}

                {/* TikTok */}
                {branding.socialLinks?.tiktok?.enabled !== false && branding.socialLinks?.tiktok?.url && (
                  <a
                    id="footer-social-tiktok"
                    href={branding.socialLinks.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Watch HOKI on TikTok"
                    title="TikTok"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center text-[#00356a] hover:text-[#000000] hover:border-[#000000]/40 hover:shadow-bubble hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                  >
                    <TikTokIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}

                {/* YouTube */}
                {branding.socialLinks?.youtube?.enabled !== false && branding.socialLinks?.youtube?.url && (
                  <a
                    id="footer-social-youtube"
                    href={branding.socialLinks.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe to HOKI on YouTube"
                    title="YouTube"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center justify-center text-[#00356a] hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:shadow-bubble hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                  >
                    <Youtube className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                )}

                <a
                  id="footer-global-locations-link"
                  href="/contact#contact-global-network-section"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('contact');
                      setTimeout(() => {
                        const el = document.getElementById('contact-global-network-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  title="View Global Locations"
                  className="px-3 py-2 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm flex items-center gap-1.5 text-xs font-semibold text-[#00356a] hover:text-[#006e21] hover:border-[#006e21]/30 transition-all cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Global Locations</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: PRODUCTS & SOLUTIONS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00356a] mb-4">
              PRODUCTS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#00356a]/80">
              <li>
                <a
                  href="/products?id=hf-8060"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('products');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  HF-8060 Heavy Duty Slabs
                </a>
              </li>
              <li>
                <a
                  href="/products?id=hf-6535"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('products');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  HF-6535 Crack Control
                </a>
              </li>
              <li>
                <a
                  href="/products?id=hf-10020"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('products');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  HF-10020 Ultra-High Tensile
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('products');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  TR34 Dosage Selector
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('products');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Technical Data Sheets (TDS)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: SECTORS & PROJECTS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00356a] mb-4">
              PROJECTS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#00356a]/80">
              <li>
                <a
                  href="/projects?id=geely"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('projects');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Geely Automobile (250,000 m²)
                </a>
              </li>
              <li>
                <a
                  href="/projects?id=sailun"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('projects');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Sailun Tay Ninh (200,000 m²)
                </a>
              </li>
              <li>
                <a
                  href="/projects?id=jinyu"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('projects');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Jinyu Vietnam Tires (180,000 m²)
                </a>
              </li>
              <li>
                <a
                  href="/projects?id=nikko"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('projects');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Nikko Material (150,000 m²)
                </a>
              </li>
              <li>
                <a
                  href="/projects?id=hamaco"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('projects');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Hamaco Concrete (120,000 m²)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: KNOWLEDGE & COMPANY */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00356a] mb-4">
              KNOWLEDGE & COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#00356a]/80">
              <li>
                <a
                  href="/knowledge"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('knowledge');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Sustainable Thinking & LCA
                </a>
              </li>
              <li>
                <a
                  href="/knowledge"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('knowledge');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  Technical Articles & Guidelines
                </a>
              </li>
              <li>
                <a
                  href="/knowledge"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('knowledge');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  HOKI Academy & Design Standards
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('about');
                    }
                  }}
                  className="hover:text-[#006e21] transition-colors cursor-pointer text-left block"
                >
                  About HOKI & Leadership
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-[#006e21] transition-colors cursor-pointer flex items-center gap-1 text-left font-semibold text-[#006e21]"
                >
                  <span>Schedule Consultation</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <a
                  href="mailto:engineering@hoki-fiber.com"
                  className="hover:text-[#006e21] transition-colors cursor-pointer flex items-center gap-1.5 text-left text-xs text-[#00356a]/80"
                  title="Send email to HOKI Engineering"
                >
                  <Mail className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>engineering@hoki-fiber.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal & Compliance per Mindnote */}
        <div className="pt-8 flex flex-col xl:flex-row items-center justify-between gap-5 text-[11px] text-[#00356a]/60">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>Copyright © HOKI. All Rights Reserved. Engineered for Net Zero Infrastructure.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => setLegalModalTitle('Privacy Policy')}
              className="hover:text-[#00356a] cursor-pointer transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModalTitle('Cookie Policy')}
              className="hover:text-[#00356a] cursor-pointer transition-colors"
            >
              Cookie Policy
            </button>
            <button
              onClick={() => setLegalModalTitle('Terms of Use')}
              className="hover:text-[#00356a] cursor-pointer transition-colors"
            >
              Terms of Use
            </button>
            <a
              id="footer-admin-link"
              href="/admin"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  if (isAdminAuthenticated) {
                    onNavigate('admin');
                  } else {
                    onOpenAdminLogin();
                  }
                }
              }}
              className="text-[#00356a]/50 hover:text-[#00356a] cursor-pointer transition-colors text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-white hover:shadow-bubble-sm border border-transparent hover:border-[#e2e6eb]"
              title="Engineering Administration Console (Restricted)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#006e21]" />
              <span className="font-semibold">Admin</span>
            </a>
            <button
              id="footer-scroll-to-top-btn"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#e2e6eb] shadow-bubble-sm text-[#00356a] font-bold text-xs hover:bg-[#00356a] hover:text-white hover:border-[#00356a] active:shadow-bubble-inset transition-all cursor-pointer group ml-1"
              aria-label="Scroll to top of page"
              title="Scroll to top of page"
            >
              <span>Scroll to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Compliance Modal */}
      {legalModalTitle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-bubble border border-[#e2e6eb]">
            <h3 className="text-lg font-bold text-[#00356a] mb-2">{legalModalTitle}</h3>
            <p className="text-xs text-[#00356a]/70 leading-relaxed mb-4">
              HOKI Steel Fiber is committed to full regulatory compliance, data privacy, and ethical manufacturing transparency across all international jurisdictions in compliance with ISO 9001, ISO 14001, and GDPR guidelines. All technical telemetry and mill test data are audited by accredited third-party verification bodies.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setLegalModalTitle(null)}
                className="px-5 py-2 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
