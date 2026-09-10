import React, { useState } from 'react';
import { JOURNAL_ARTICLES } from '../data/mockData';
import { JournalArticle } from '../types';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Download,
  FileText,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Quote
} from 'lucide-react';

interface BlogPageProps {
  onOpenArticle: (article: JournalArticle) => void;
  onOpenConsultation: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onOpenArticle,
  onOpenConsultation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'ALL APPLICATION' },
    { id: 'precast', label: 'PRECAST' },
    { id: 'tunneling', label: 'TUNNELING' },
    { id: 'industrial', label: 'INDUSTRIAL' },
    { id: 'infrastructure', label: 'INFRASTRUCTURE' },
    { id: 'esg', label: 'DECARBONIZATION / ESG' },
  ];

  const defaultArticle: JournalArticle = {
    id: 'art-default',
    title: 'Plastic Shrinkage & Structural Crack Control Mechanics in Industrial Concrete',
    subtitle: 'Micro-mechanical bridging analysis comparing 2D welded wire fabric with 3D hooked steel fibers during hydration.',
    category: 'CRACK CONTROL MECHANICS',
    categorySlug: 'crack-control',
    date: 'Oct 2024',
    readTime: '7 MIN READ',
    author: 'Dr. Henrik Lindqvist, PhD, FICE',
    standards: 'ASTM C1579 / EN 14889-1',
    contentSnippet: 'Cold-drawn 3D steel fibers provide millions of isotropic mechanical anchors per cubic meter.'
  };

  const flagshipArticle = JOURNAL_ARTICLES.find((a) => a.isFlagship) || JOURNAL_ARTICLES[0] || defaultArticle;
  const regularArticles = JOURNAL_ARTICLES.filter((a) => !a.isFlagship);

  const filteredArticles = regularArticles.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.categorySlug === selectedCategory;
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header & Title Module */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-6">
        <div className="bg-[#f4f6f8] rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee] text-center max-w-4xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            TECHNICAL DISPATCH & RESEARCH HUB
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00356a] leading-tight">
            Structural Intelligence & Engineering Journal
          </h1>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-[#00356a]/75 leading-relaxed font-normal max-w-2xl mx-auto">
            Peer-reviewed structural research, field-validated case studies, and low-carbon metallurgical breakthroughs in 3D hooked steel fiber reinforced concrete (SFRC).
          </p>
        </div>
      </section>

      {/* 2. Flagship Monograph (matching Image 2) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee] hover:shadow-bubble-lg transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> FLAGSHIP MONOGRAPH
            </span>
            <span className="text-xs font-semibold text-[#00356a]/60">
              ASTM A820 / EN 14889-1 Standard
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#00356a] leading-tight">
            {flagshipArticle.title}
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#00356a]/75 leading-relaxed max-w-3xl">
            {flagshipArticle.subtitle}
          </p>

          <div className="mt-6 pt-6 border-t border-[#e2e6eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#00356a]/70">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-[#006e21]" /> {flagshipArticle.author}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#006e21]" /> {flagshipArticle.date}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#006e21]" /> {flagshipArticle.readTime}
              </span>
            </div>

            <button
              id="read-flagship-monograph-btn"
              onClick={() => onOpenArticle(flagshipArticle)}
              className="flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00356a] text-white shadow-bubble-sm hover:bg-[#002244] hover:shadow-bubble active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>READ MONOGRAPH</span>
              <ArrowRight className="w-4 h-4 text-[#006e21]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Quote Bubble Banner (matching Image 2) */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#f4f6f8] rounded-[2rem] p-8 shadow-bubble border border-[#e2e6eb] relative">
          <Quote className="w-10 h-10 text-[#006e21]/30 mb-3" />
          <p className="text-sm sm:text-base md:text-lg italic font-medium text-[#00356a] leading-relaxed">
            "Replacing planar 2D rebar mesh with isotropic 3D cold-drawn steel fibers isn't merely an incremental scheduling optimization—it fundamentally shifts concrete from a brittle, defect-susceptible composite into an energy-dissipating, high-ductility structural system."
          </p>
          <div className="mt-4 pt-3 border-t border-[#e2e6eb] flex items-center justify-between">
            <span className="text-xs font-bold text-[#00356a]">
              Dr. Henrik Lindqvist, PhD, FICE
            </span>
            <span className="text-[11px] font-semibold text-[#006e21]">
              Chief Technical Officer & Principal Structural Advisor, HOKI Research Labs
            </span>
          </div>
        </div>
      </section>

      {/* 4. Filter Pills */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-[2rem] shadow-bubble border border-[#e5e9ee]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`blog-category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00356a] text-white shadow-bubble-sm'
                  : 'bg-[#f4f6f8] text-[#00356a]/70 hover:bg-[#e2e6eb] hover:text-[#00356a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 5. Article Grid */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="group bg-[#f4f6f8] rounded-[2.5rem] p-7 shadow-bubble border border-[#e5e9ee] flex flex-col justify-between hover:shadow-bubble-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006e21] bg-white px-3 py-1 rounded-full border border-[#e2e6eb]">
                    {article.category}
                  </span>
                  <span className="text-[10.5px] font-mono text-[#00356a]/50">
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#00356a] group-hover:text-[#006e21] transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-[#00356a]/70 mt-2.5 leading-relaxed font-normal">
                  {article.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e2e6eb] flex items-center justify-between">
                <div className="text-[10.5px] text-[#00356a]/60 font-medium">
                  <span>{article.author}</span>
                  <span className="block text-[9.5px] text-[#00356a]/40">{article.date}</span>
                </div>
                <button
                  id={`read-article-${article.id}-btn`}
                  onClick={() => onOpenArticle(article)}
                  className="flex items-center gap-1 text-xs font-bold text-[#00356a] hover:text-[#006e21] cursor-pointer"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 2025 SFRC Structural Conversion & TR34 Dosage Guideline Card (matching Image 2) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mb-6">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-bubble border border-[#e5e9ee]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006e21] bg-[#006e21]/10 px-3 py-1 rounded-full inline-block mb-3">
                STANDARDS MANUAL & REBAR REPLACEMENT
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00356a]">
                2025 SFRC Structural Conversion & TR34 Dosage Guideline
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-[#00356a]/75 leading-relaxed font-normal max-w-2xl">
                A 74-page comprehensive handbook detailing yield-line equations, moment capacity verification, crack width limitation (w_k ≤ 0.15 mm), and step-by-step conversion from rebar mesh to cold-drawn steel fibers.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-[#00356a]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006e21]" /> TR34 4th Edition Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006e21]" /> ACI 544.4R Yield-Line Nomographs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006e21]" /> Parametric Excel Calculation Tools
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  const blob = new Blob(['HOKI 2025 SFRC Structural Conversion Handbook (.PDF)'], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'HOKI-2025-SFRC-Conversion-Manual.pdf';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00356a] text-white shadow-bubble-sm hover:bg-[#002244] hover:shadow-bubble transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#006e21]" />
                <span>DOWNLOAD WHITE PAPER (.PDF)</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob(['HOKI TR34 Excel Dosage & Moment Calculation Model (.XLSX)'], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'HOKI-TR34-Dosage-Model.xlsx';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f4f6f8] text-[#00356a] border border-[#e2e6eb] shadow-bubble-sm hover:bg-white transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#006e21]" />
                <span>DOSAGE CALC MODEL (.XLSX)</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
