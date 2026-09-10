import React, { useState, useEffect, lazy, Suspense } from 'react';
import { PageRoute, FiberProduct, ProjectCaseStudy, JournalArticle } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageLoadingSkeleton } from './components/PageLoadingSkeleton';
import { ConsultationModal } from './components/ConsultationModal';
import { DossierModal } from './components/DossierModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ArticleModal } from './components/ArticleModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FloatingCallButton } from './components/FloatingCallButton';
import { SeoHead } from './components/SeoHead';
import { useData } from './context/DataContext';
import { getRouteFromPath, getPathForRoute, getProjectSlugFromPath } from './utils/router';
import { ArrowUp, Lock, ShieldCheck } from 'lucide-react';

// Lazy-loaded page components for lightweight page chunks and optimized loading performance
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ProductPage = lazy(() => import('./pages/ProductPage').then(module => ({ default: module.ProductPage })));
const ProjectPage = lazy(() => import('./pages/ProjectPage').then(module => ({ default: module.ProjectPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage').then(module => ({ default: module.KnowledgePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));

export default function App() {
  const { isAdminAuthenticated } = useData();

  // Initialize route from current window.location.pathname
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => {
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname);
    }
    return 'home';
  });

  const [consultationOpen, setConsultationOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<FiberProduct | null>(null);
  const [selectedCase, setSelectedCase] = useState<ProjectCaseStudy | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync route on popstate (browser back/forward button navigation)
  useEffect(() => {
    const handlePopState = () => {
      const targetRoute = getRouteFromPath(window.location.pathname);
      setCurrentRoute(targetRoute);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial URL if clean path normalization needed
  useEffect(() => {
    if (currentRoute === 'project-detail') {
      // Keep existing /projects/:slug in URL
      return;
    }
    const expectedPath = getPathForRoute(currentRoute);
    if (window.location.pathname !== expectedPath && !window.location.pathname.startsWith(expectedPath)) {
      window.history.replaceState(null, '', expectedPath + window.location.search);
    }
  }, [currentRoute]);

  // Scroll listener for floating scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (route: PageRoute, customUrlParams?: string) => {
    if (route === 'admin' && !isAdminAuthenticated) {
      setAdminLoginOpen(true);
      return;
    }

    const newPath = getPathForRoute(route) + (customUrlParams ? (customUrlParams.startsWith('?') ? customUrlParams : `?${customUrlParams}`) : '');
    
    if (window.location.pathname !== getPathForRoute(route)) {
      window.history.pushState(null, '', newPath);
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#00356a] font-['Montserrat',sans-serif] flex flex-col selection:bg-[#006e21]/20 selection:text-[#00356a]">
      {/* Dynamic SEO Meta Header & Structured Data Schema Engine */}
      <SeoHead
        currentRoute={currentRoute}
        selectedDossier={selectedDossier}
        selectedCase={selectedCase}
        selectedArticle={selectedArticle}
      />

      {/* 1. Standardized Sticky Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      {/* 2. Main Content Canvas with Suspense Code Splitting */}
      <main className="flex-grow w-full">
        <Suspense fallback={<PageLoadingSkeleton />}>
          {currentRoute === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenConsultation={() => setConsultationOpen(true)}
            />
          )}

          {currentRoute === 'products' && (
            <ProductPage
              onOpenDossier={(spec) => setSelectedDossier(spec)}
              onOpenConsultation={() => setConsultationOpen(true)}
            />
          )}

          {currentRoute === 'projects' && (
            <ProjectPage
              onNavigate={handleNavigate}
              onOpenConsultation={() => setConsultationOpen(true)}
            />
          )}

          {currentRoute === 'project-detail' && (
            <ProjectDetailPage
              projectSlug={getProjectSlugFromPath(window.location.pathname)}
              onNavigate={handleNavigate}
              onOpenConsultation={() => setConsultationOpen(true)}
            />
          )}

          {(currentRoute === 'knowledge' || currentRoute === 'blog' || currentRoute === 'esg') && (
            <KnowledgePage
              onOpenArticle={(article) => setSelectedArticle(article)}
              onOpenConsultation={() => setConsultationOpen(true)}
            />
          )}

          {currentRoute === 'about' && (
            <AboutPage
              onOpenConsultation={() => setConsultationOpen(true)}
            />
          )}

          {currentRoute === 'contact' && (
            <ContactPage />
          )}

          {currentRoute === 'admin' && (
            isAdminAuthenticated ? (
              <AdminPage
                onNavigate={handleNavigate}
                onPreviewArticle={(article) => setSelectedArticle(article)}
                onPreviewProject={(project) => setSelectedCase(project)}
              />
            ) : (
              <div className="max-w-xl mx-auto my-24 px-4">
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-bubble-lg border border-[#e5e9ee] text-center">
                  <div className="w-16 h-16 rounded-3xl bg-[#00356a]/10 text-[#00356a] flex items-center justify-center mx-auto mb-4 shadow-bubble-inset">
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3">
                    <ShieldCheck className="w-3 h-3" />
                    Engineering Security Protocol
                  </span>
                  <h2 className="text-2xl font-black text-[#00356a] mb-2">
                    Admin Console Locked
                  </h2>
                  <p className="text-xs text-[#00356a]/70 leading-relaxed max-w-md mx-auto mb-6">
                    Access to the HOKI Engineering Administration Console requires verified administrator credentials. Please authenticate to continue.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleNavigate('home')}
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-[#00356a] hover:bg-[#f4f6f8] transition-all cursor-pointer"
                    >
                      Return Home
                    </button>
                    <button
                      id="admin-unlock-console-btn"
                      onClick={() => setAdminLoginOpen(true)}
                      className="px-6 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002850] shadow-bubble-sm flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Log In to Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </Suspense>
      </main>

      {/* 3. Standardized Corporate Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={() => setConsultationOpen(true)}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* 4. Global Modals */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setCurrentRoute('admin');
          window.history.pushState(null, '', '/admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />

      <DossierModal
        product={selectedDossier}
        onClose={() => setSelectedDossier(null)}
      />

      <CaseStudyModal
        caseStudy={selectedCase}
        onClose={() => setSelectedCase(null)}
        onOpenConsultation={() => {
          setSelectedCase(null);
          setConsultationOpen(true);
        }}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenConsultation={() => {
          setSelectedArticle(null);
          setConsultationOpen(true);
        }}
      />

      {/* 5. Floating Oversized Call Now Corner Widget */}
      <FloatingCallButton />

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white text-[#00356a] shadow-bubble flex items-center justify-center border border-[#e2e6eb] hover:bg-[#00356a] hover:text-white hover:border-[#00356a] hover:-translate-y-1 active:translate-y-0 active:shadow-bubble-inset transition-all duration-200 cursor-pointer group"
          aria-label="Scroll to top of page"
          title="Scroll to top of page"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
