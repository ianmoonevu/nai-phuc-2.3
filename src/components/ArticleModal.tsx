import React from 'react';
import { X, BookOpen, Clock, Calendar, User, ShieldCheck, Download } from 'lucide-react';
import { JournalArticle } from '../types';

interface ArticleModalProps {
  article: JournalArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00356a]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-6 md:p-8 shadow-bubble-lg border border-[#e5e9ee] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-colors cursor-pointer shadow-bubble-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> {article.category}
          </span>
          <span className="text-[10px] font-bold tracking-wider text-[#00356a]/60 uppercase bg-[#f4f6f8] px-2.5 py-1 rounded-full border border-[#e2e6eb]">
            {article.standards}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold text-[#00356a] leading-tight">
          {article.title}
        </h2>
        <p className="text-xs text-[#00356a]/70 mt-2 italic">
          {article.subtitle}
        </p>

        {/* Featured Image */}
        {article.image && (
          <div className="mt-4 rounded-3xl overflow-hidden border border-[#e2e6eb] shadow-bubble-sm relative w-full bg-[#f4f6f8] max-h-80">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full max-h-80 object-cover"
            />
          </div>
        )}

        {/* Metadata Line */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#00356a]/70 mt-4 pb-4 border-b border-[#e2e6eb]">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#006e21]" /> {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#006e21]" /> {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#006e21]" /> {article.readTime}
          </span>
        </div>

        {/* Article Body */}
        <div className="mt-6 space-y-4 text-xs md:text-sm text-[#00356a]/85 leading-relaxed font-normal">
          {article.fullContent ? (
            article.fullContent.map((paragraph, index) => (
              <p key={index} className="p-3 bg-[#f4f6f8] rounded-2xl border border-[#e2e6eb]/60">
                {paragraph}
              </p>
            ))
          ) : (
            <div className="space-y-4">
              <p className="p-4 bg-[#f4f6f8] rounded-2xl border border-[#e2e6eb]">
                {article.contentSnippet}
              </p>
              <p>
                In high-stress subterranean and industrial structures, traditional rebar reinforcement creates planar vulnerability planes that are incapable of arresting multi-axial tensile stress paths. By introducing cold-drawn hooked-end 3D steel fibers at dosages between 25 kg/m³ and 35 kg/m³, the concrete composite exhibits substantial post-cracking residual tensile strength.
              </p>
              <p>
                Laboratory testing under EN 14651 notched beam flexural protocols demonstrates an f_R1k value of 1.62 MPa and an f_R3k value of 1.34 MPa, satisfying all TR34 4th edition yield-line design limits without the need for supplementary bottom steel fabric.
              </p>
            </div>
          )}
        </div>

        {/* Standards & Citations Box */}
        <div className="mt-6 p-5 rounded-2xl bg-white border border-[#006e21]/30 shadow-bubble-sm">
          <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider mb-1 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#006e21]" /> Referenced Design Norms & Standards
          </h4>
          <p className="text-[11px] text-[#00356a]/70">
            Concrete Society TR34 (4th Edition), ACI 544.4R-18 (Guide to Design with Fiber-Reinforced Concrete), fib Model Code 2020 (SFRC constitutive law), EN 14651 (Flexural tensile strength test method).
          </p>
        </div>

        {/* Technical Figures & Gallery */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold text-[#00356a] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006e21]" /> Technical Figures & Micro-Structure Documentation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.gallery.map((fig, idx) => (
                <div key={idx} className="bg-[#f4f6f8] rounded-2xl p-3 border border-[#e2e6eb]">
                  <div className="rounded-xl overflow-hidden bg-white border border-[#dce0e6] max-h-48">
                    <img src={fig.url} alt={fig.title || `Figure ${idx + 1}`} className="w-full h-40 object-cover" />
                  </div>
                  {fig.title && <p className="text-xs font-bold text-[#00356a] mt-2">{fig.title}</p>}
                  {fig.caption && <p className="text-[11px] text-[#00356a]/70 mt-0.5">{fig.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Bottom */}
        <div className="mt-6 pt-4 border-t border-[#e2e6eb] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#00356a]/70 hover:text-[#00356a] cursor-pointer"
          >
            Close Article
          </button>
          <button
            onClick={() => {
              const blob = new Blob([
                `HOKI TECHNICAL MONOGRAPH: ${article.title}\nAuthor: ${article.author}\nDate: ${article.date}\n\n${article.contentSnippet}`
              ], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${article.id}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00356a] text-white shadow-bubble-sm hover:bg-[#002244] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Paper (.PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
