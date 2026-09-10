import React, { useState, useRef, useEffect } from 'react';
import { JournalArticle } from '../types';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  Check,
  Save,
  Eye,
  Camera,
  FolderOpen
} from 'lucide-react';

interface QuickArticlePhotoManagerModalProps {
  article: JournalArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedArticle: JournalArticle) => void;
  onOpenLibraryPicker: (target: 'cover' | 'gallery-item' | 'gallery-new', galleryIndex?: number) => void;
  uploadImageFile: (file: File, category?: 'projects' | 'knowledge' | 'general') => Promise<any>;
  showToast: (msg: string) => void;
}

export const QuickArticlePhotoManagerModal: React.FC<QuickArticlePhotoManagerModalProps> = ({
  article,
  isOpen,
  onClose,
  onSave,
  onOpenLibraryPicker,
  uploadImageFile,
  showToast
}) => {
  if (!isOpen || !article) return null;

  const [coverImage, setCoverImage] = useState(article.image || '');
  const [gallery, setGallery] = useState<{ url: string; title?: string; caption?: string }[]>(() =>
    article.gallery && article.gallery.length > 0 ? [...article.gallery] : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);

  // File input refs
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement | null>(null);
  const itemFileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  useEffect(() => {
    if (article) {
      setCoverImage(article.image || '');
      setGallery(article.gallery && article.gallery.length > 0 ? [...article.gallery] : []);
    }
  }, [article]);

  // Handle Cover Photo Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const item = await uploadImageFile(file, 'knowledge');
      setCoverImage(item.url);
      showToast(`Article cover updated with "${item.name}"`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  // Handle Batch Figures Upload
  const handleBatchFiguresUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newItems: { url: string; title?: string; caption?: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await uploadImageFile(files[i], 'knowledge');
        newItems.push({
          url: item.url,
          title: `Figure ${gallery.length + newItems.length + 1}: ${item.name.replace(/[-_]/g, ' ')}`,
          caption: 'Technical schematic, micro-crack analysis, or laboratory load-deflection curve.'
        });
      }
      setGallery((prev) => [...prev, ...newItems]);
      showToast(`${newItems.length} technical figures added to article!`);
    } catch (err) {
      console.error(err);
      showToast('Error uploading figures');
    } finally {
      setIsUploading(false);
      if (batchFileInputRef.current) batchFileInputRef.current.value = '';
    }
  };

  // Handle Single Figure Replacement Upload
  const handleItemUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeItemIndex === null) return;

    setIsUploading(true);
    try {
      const item = await uploadImageFile(file, 'knowledge');
      setGallery((prev) =>
        prev.map((g, idx) => (idx === activeItemIndex ? { ...g, url: item.url } : g))
      );
      showToast(`Figure ${activeItemIndex + 1} updated!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to replace figure photo');
    } finally {
      setIsUploading(false);
      setActiveItemIndex(null);
      if (itemFileInputRef.current) itemFileInputRef.current.value = '';
    }
  };

  const triggerItemUpload = (index: number) => {
    setActiveItemIndex(index);
    itemFileInputRef.current?.click();
  };

  const handleAddEmptyFigure = () => {
    const figNum = gallery.length + 1;
    setGallery((prev) => [
      ...prev,
      {
        url: '/images/applications/app-industrial-flooring.svg',
        title: `Figure ${figNum}: Interfacial Micro-Structure`,
        caption: 'Scanning electron micrograph or load redistribution schematic.'
      }
    ]);
    showToast('New technical figure slot added');
  };

  const handleRemoveFigure = (index: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Figure removed from article');
  };

  const handleMakeCover = (url: string) => {
    setCoverImage(url);
    showToast('Selected figure set as Article Cover!');
  };

  const handleMoveFigure = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[targetIndex];
    newGallery[targetIndex] = temp;
    setGallery(newGallery);
  };

  const handleSaveAll = () => {
    const updated: JournalArticle = {
      ...article,
      image: coverImage,
      gallery: gallery
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#00356a]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-4xl w-full shadow-bubble-lg border border-[#e2e6eb] max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Hidden File Inputs */}
        <input
          ref={coverFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverUpload}
        />
        <input
          ref={batchFileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleBatchFiguresUpload}
        />
        <input
          ref={itemFileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleItemUpload}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e2e6eb] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider bg-[#006e21]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Camera className="w-3 h-3" /> Technical Visuals & Figures
              </span>
              <span className="text-[11px] font-semibold text-[#00356a]/60">
                {article.category}
              </span>
            </div>
            <h3 className="text-xl font-black text-[#00356a] mt-1">
              Manage Visuals: {article.title}
            </h3>
            <p className="text-xs text-[#00356a]/70 mt-0.5">
              Change cover photo, upload technical micrographs, or replace figures shown in the article modal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer shadow-bubble-sm transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-6 pr-2 space-y-8 flex-1">
          {/* SECTION 1: ARTICLE COVER PHOTO */}
          <div className="bg-[#f4f6f8] rounded-3xl p-5 border border-[#e2e6eb] shadow-bubble-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00356a] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00356a]" /> Article Cover Photo
                </span>
                <p className="text-[11px] text-[#00356a]/60 mt-0.5">
                  Displayed on the Knowledge card and at the header of the article modal.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => coverFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-full bg-[#00356a] text-white hover:bg-[#002244] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-bubble-sm transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isUploading ? 'Uploading...' : 'Upload New Cover'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLibraryPicker('cover')}
                  className="px-4 py-2 rounded-full bg-white text-[#00356a] hover:bg-[#e2e6eb] border border-[#dce0e6] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-bubble-sm"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>From Media Library</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 h-44 rounded-2xl overflow-hidden bg-white border border-[#dce0e6] shadow-bubble-inset relative group">
                <img
                  src={coverImage || '/images/applications/app-industrial-flooring.svg'}
                  alt="Article Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewZoomUrl(coverImage)}
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all cursor-pointer"
                  title="Zoom preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="sm:col-span-7 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#00356a] uppercase mb-1">
                    Direct Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://... or /images/..."
                    className="w-full px-4 py-2 rounded-xl text-xs text-[#00356a] bg-white border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                  />
                </div>
                <div className="text-[11px] text-[#00356a]/70 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Automatically optimizes and renders crisp visual graphics on both mobile and desktop.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: TECHNICAL FIGURES & DIAGRAMS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e6eb]">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#006e21]" />
                  <h4 className="text-base font-extrabold text-[#00356a]">
                    Technical Figures & Micrographs ({gallery.length} Figures)
                  </h4>
                </div>
                <p className="text-xs text-[#00356a]/70 mt-0.5">
                  Embed laboratory test graphs, ASTM beam break images, or structural sketches.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => batchFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-full bg-[#006e21] text-white hover:bg-[#005a1b] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-bubble-sm transition-all"
                  title="Select multiple figures from your computer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Batch Upload Figures</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddEmptyFigure}
                  className="px-3.5 py-2 rounded-full bg-white text-[#00356a] hover:bg-[#f4f6f8] border border-[#dce0e6] text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-bubble-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#006e21]" />
                  <span>Add Figure Slot</span>
                </button>
              </div>
            </div>

            {gallery.length === 0 ? (
              <div className="p-8 text-center bg-[#f4f6f8] rounded-3xl border border-dashed border-[#dce0e6]">
                <ImageIcon className="w-10 h-10 text-[#00356a]/30 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#00356a]">No figures in this article yet</p>
                <p className="text-xs text-[#00356a]/60 mt-1 max-w-sm mx-auto">
                  Click "Batch Upload Figures" or "Add Figure Slot" to attach research photos, diagrams, and formulas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gallery.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#f4f6f8] rounded-2xl p-4 border border-[#e2e6eb] shadow-bubble-sm flex flex-col justify-between relative group"
                  >
                    <div>
                      {/* Figure Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#00356a] text-white text-[10px] font-black flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider">
                            Figure #{index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveFigure(index, 'up')}
                            className="p-1 rounded-lg bg-white text-[#00356a] hover:bg-[#e2e6eb] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-[#dce0e6]"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === gallery.length - 1}
                            onClick={() => handleMoveFigure(index, 'down')}
                            className="p-1 rounded-lg bg-white text-[#00356a] hover:bg-[#e2e6eb] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-[#dce0e6]"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFigure(index)}
                            className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer border border-rose-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="h-40 w-full rounded-xl overflow-hidden bg-white border border-[#dce0e6] relative shadow-bubble-inset">
                        <img
                          src={item.url}
                          alt={item.title || `Figure ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          <button
                            type="button"
                            onClick={() => triggerItemUpload(index)}
                            className="px-3 py-1.5 rounded-full bg-[#006e21] text-white text-[11px] font-bold hover:bg-[#005a1b] cursor-pointer shadow-sm flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenLibraryPicker('gallery-item', index)}
                            className="px-3 py-1.5 rounded-full bg-white text-[#00356a] text-[11px] font-bold hover:bg-[#f4f6f8] cursor-pointer shadow-sm flex items-center gap-1"
                          >
                            <FolderOpen className="w-3 h-3" />
                            <span>Pick</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewZoomUrl(item.url)}
                            className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Figure Inputs */}
                      <div className="mt-3 space-y-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#00356a]/80 mb-0.5">
                            Figure Title
                          </label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) =>
                              setGallery((prev) =>
                                prev.map((g, idx) => (idx === index ? { ...g, title: e.target.value } : g))
                              )
                            }
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#00356a]/80 mb-0.5">
                            Scientific / Engineering Caption
                          </label>
                          <textarea
                            rows={2}
                            value={item.caption || ''}
                            onChange={(e) =>
                              setGallery((prev) =>
                                prev.map((g, idx) => (idx === index ? { ...g, caption: e.target.value } : g))
                              )
                            }
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#e2e6eb] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleMakeCover(item.url)}
                        className="text-[11px] font-bold text-[#006e21] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Set as Main Cover</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerItemUpload(index)}
                        className="text-[11px] font-semibold text-[#00356a] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Change Figure</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#e2e6eb] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-[#00356a]/70 hover:text-[#00356a] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-7 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#002244] shadow-bubble-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Save All Article Visuals</span>
          </button>
        </div>
      </div>

      {/* Full Preview Zoom Modal */}
      {previewZoomUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewZoomUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-white rounded-3xl p-3 shadow-bubble-lg" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewZoomUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={previewZoomUrl} alt="Preview" className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};
