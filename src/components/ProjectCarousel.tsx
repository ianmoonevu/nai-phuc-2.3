import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import { ProjectGalleryItem } from '../types';

interface ProjectCarouselProps {
  items: ProjectGalleryItem[];
  projectTitle: string;
  className?: string;
  aspectRatio?: string; // e.g. 'aspect-16/10' or 'h-64 sm:h-80'
  showThumbnails?: boolean;
  showCaption?: boolean;
  autoplayDefault?: boolean;
  autoplayInterval?: number; // ms
  onImageClick?: (index: number) => void;
  variant?: 'modal' | 'card';
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  items,
  projectTitle,
  className = '',
  aspectRatio = 'h-64 sm:h-80 md:h-96',
  showThumbnails = true,
  showCaption = true,
  autoplayDefault = false,
  autoplayInterval = 5000,
  onImageClick,
  variant = 'modal',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplayDefault);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const safeItems: ProjectGalleryItem[] = items && items.length > 0
    ? items
    : [
        {
          url: '/images/hero-construction.svg',
          title: projectTitle,
          caption: 'Project structural concrete overview',
          phaseTag: 'OVERVIEW',
        },
      ];

  const total = safeItems.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay handler
  useEffect(() => {
    if (isPlaying && total > 1 && !isFullscreen) {
      timerRef.current = setInterval(goToNext, autoplayInterval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, total, autoplayInterval, goToNext, isFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, isFullscreen]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      goToNext();
    } else if (diff < -45) {
      goToPrev();
    }
    setTouchStartX(null);
  };

  const currentItem = safeItems[currentIndex] || safeItems[0];

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Main Carousel Display Box */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-bubble-sm border border-[#e2e6eb] bg-slate-950 group select-none ${aspectRatio}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render Active Image with smooth cross-fade */}
        {safeItems.map((item, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={item.url}
              alt={`${projectTitle} — ${item.title}`}
              className="w-full h-full object-cover object-center cursor-pointer"
              onClick={() => {
                if (onImageClick) {
                  onImageClick(idx);
                } else {
                  setIsFullscreen(true);
                }
              }}
            />
          </div>
        ))}

        {/* Top Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          {/* Phase Badge */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-[#006e21] text-white px-3 py-1 rounded-full shadow-bubble-sm flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-white" />
              <span>{currentItem.phaseTag || 'PROJECT STAGE'}</span>
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase bg-[#00356a]/80 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full border border-white/10">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {total > 1 && (
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/15"
                title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/15"
              title="Expand Fullscreen View"
              aria-label="Expand Fullscreen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Left / Right Tactile Navigation Arrows (visible on hover / active) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#00356a] shadow-bubble flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer border border-[#e2e6eb]"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#00356a] shadow-bubble flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer border border-[#e2e6eb]"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Bottom Caption & Pagination Bar Overlay */}
        {showCaption && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#001830] via-[#001830]/80 to-transparent p-4 sm:p-5 pt-8 flex flex-col justify-end text-white">
            <div className="flex items-end justify-between gap-3">
              <div className="max-w-xl">
                <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {currentItem.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-200/90 font-medium mt-1 line-clamp-2 leading-relaxed">
                  {currentItem.caption}
                </p>
              </div>

              {/* Slide Counter on Mobile */}
              <div className="shrink-0 text-right">
                <span className="sm:hidden text-[10px] font-bold tracking-wider uppercase bg-[#00356a]/90 text-white px-2 py-0.5 rounded-full">
                  {currentIndex + 1} / {total}
                </span>
              </div>
            </div>

            {/* Micro Dot Indicators inside carousel */}
            {total > 1 && (
              <div className="flex items-center gap-1.5 mt-3 self-center">
                {safeItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-[#00e676]'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Strip (if enabled and multiple items) */}
      {showThumbnails && total > 1 && (
        <div className="mt-3 w-full">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {safeItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToIndex(idx)}
                className={`shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                  idx === currentIndex
                    ? 'border-[#006e21] ring-2 ring-[#006e21]/30 shadow-bubble scale-102'
                    : 'border-transparent opacity-65 hover:opacity-100 hover:border-slate-300'
                }`}
                aria-label={`Select photo ${idx + 1}: ${item.title}`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {idx === currentIndex && (
                  <div className="absolute inset-0 bg-[#006e21]/15 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Top Bar */}
          <div
            className="w-full flex items-center justify-between text-white pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00e676] bg-[#006e21]/40 px-2.5 py-0.5 rounded-full">
                {currentItem.phaseTag || 'STAGE'}
              </span>
              <h3 className="text-sm sm:text-base font-bold mt-1">
                {projectTitle} — {currentItem.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-white/70">
                {currentIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image with Arrows */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {total > 1 && (
              <button
                type="button"
                onClick={goToPrev}
                className="absolute left-2 sm:left-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer shadow-lg transition-transform hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={currentItem.url}
              alt={currentItem.title}
              className="max-h-[78vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
            />

            {total > 1 && (
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-2 sm:right-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer shadow-lg transition-transform hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption & Thumbnail Selector in Lightbox */}
          <div
            className="w-full text-center text-white/90 pt-3 border-t border-white/10 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs sm:text-sm max-w-2xl text-slate-300">
              {currentItem.caption}
            </p>

            {total > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto">
                {safeItems.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => goToIndex(i)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      i === currentIndex ? 'border-[#00e676] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
