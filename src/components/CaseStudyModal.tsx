import React from 'react';
import { X, CheckCircle2, Building, MapPin, Gauge, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProjectCaseStudy } from '../types';
import { ProjectCarousel } from './ProjectCarousel';

interface CaseStudyModalProps {
  caseStudy: ProjectCaseStudy | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  onOpenConsultation,
}) => {
  if (!caseStudy) return null;

  const carouselItems = caseStudy.gallery && caseStudy.gallery.length > 0
    ? caseStudy.gallery
    : [
        {
          url: caseStudy.image,
          title: caseStudy.title,
          caption: `${caseStudy.facilityType} — ${caseStudy.location}`,
          phaseTag: '01 OVERVIEW',
        },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00356a]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-6 md:p-8 shadow-bubble-lg border border-[#e5e9ee] max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-colors cursor-pointer shadow-bubble-sm z-30"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#006e21] uppercase bg-[#006e21]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Field Verified Case Study
          </span>
          <span className="text-[10px] font-bold tracking-wider text-[#00356a]/60 uppercase">
            ID: {caseStudy.code}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#00356a]">
          {caseStudy.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#00356a]/70 mt-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Building className="w-3.5 h-3.5 text-[#006e21]" /> {caseStudy.sectorLabel}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#006e21]" /> {caseStudy.location}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Gauge className="w-3.5 h-3.5 text-[#006e21]" /> {caseStudy.area}
          </span>
        </div>

        {/* Project Multi-Picture Carousel */}
        <div className="mt-5">
          <ProjectCarousel
            items={carouselItems}
            projectTitle={caseStudy.title}
            aspectRatio="h-64 sm:h-80 md:h-[26rem]"
            showThumbnails={true}
            showCaption={true}
            autoplayDefault={false}
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {caseStudy.metrics.map((metric, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] shadow-bubble-sm text-center"
            >
              <span className="text-[10px] font-semibold text-[#00356a]/60 uppercase tracking-wider block">
                {metric.label}
              </span>
              <span className={`text-lg md:text-2xl font-bold mt-1 block ${metric.isHighlight ? 'text-[#006e21]' : 'text-[#00356a]'}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* Case Narrative */}
        <div className="mt-6 p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#00356a] mb-2">
            Engineering Challenge & Solution
          </h4>
          <p className="text-xs text-[#00356a]/80 leading-relaxed">
            {caseStudy.description}
          </p>
          <div className="mt-4 pt-4 border-t border-[#e2e6eb] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#00356a]">
            <div>
              <span className="font-bold text-[#00356a]/60 block text-[10px] uppercase">Fiber Specified:</span>
              <span className="font-semibold">{caseStudy.specifications.fiberSeries}</span>
            </div>
            <div>
              <span className="font-bold text-[#00356a]/60 block text-[10px] uppercase">Dosage Rate:</span>
              <span className="font-semibold">{caseStudy.specifications.dosage}</span>
            </div>
            <div>
              <span className="font-bold text-[#00356a]/60 block text-[10px] uppercase">Concrete Grade:</span>
              <span className="font-semibold">{caseStudy.specifications.concreteGrade}</span>
            </div>
            <div>
              <span className="font-bold text-[#00356a]/60 block text-[10px] uppercase">Joint Layout:</span>
              <span className="font-semibold">{caseStudy.specifications.jointSpacing}</span>
            </div>
          </div>
        </div>

        {/* Client Quote if available */}
        {caseStudy.clientQuote && (
          <div className="mt-4 p-5 rounded-2xl bg-white border border-[#006e21]/30 shadow-bubble-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#006e21] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs italic text-[#00356a] font-medium leading-relaxed">
                "{caseStudy.clientQuote}"
              </p>
              {caseStudy.quoteAuthor && (
                <span className="text-[10.5px] font-bold text-[#006e21] mt-1.5 block">
                  — {caseStudy.quoteAuthor}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#e2e6eb] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#00356a]/70 hover:text-[#00356a] cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#006e21] text-white shadow-bubble-sm hover:bg-[#005a1b] cursor-pointer"
          >
            <span>Apply This Spec to My Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
