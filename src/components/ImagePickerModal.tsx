import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Search,
  CloudUpload,
  Sparkles,
  Link as LinkIcon,
  Trash2,
  ExternalLink,
  Loader2,
  Filter,
  CheckCircle2,
  Database
} from 'lucide-react';
import { MediaItem } from '../types';
import { useData } from '../context/DataContext';

export interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, mediaItem?: MediaItem) => void;
  title?: string;
  subtitle?: string;
  defaultCategory?: MediaItem['category'] | 'all';
  currentSelectedUrl?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select or Upload Image',
  subtitle = 'Choose from media library or upload directly to Supabase Storage',
  defaultCategory = 'all',
  currentSelectedUrl = ''
}) => {
  const { mediaItems, uploadImageFile } = useData();

  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(() => {
    if (currentSelectedUrl && mediaItems) {
      return mediaItems.find((m) => m.url === currentSelectedUrl) || null;
    }
    return null;
  });
  const [customUrl, setCustomUrl] = useState(currentSelectedUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter media items
  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchCat =
        selectedCategory === 'all' || !item.category || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [mediaItems, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // Handle files upload (via input or drag-and-drop)
  const handleProcessFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgressMsg(`Uploading ${files.length} file(s) to Supabase Storage 'media' bucket...`);

    try {
      let lastUploaded: MediaItem | null = null;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const category =
          selectedCategory !== 'all' ? (selectedCategory as MediaItem['category']) : 'general';
        setUploadProgressMsg(`Uploading "${file.name}" (${i + 1}/${files.length})...`);
        const result = await uploadImageFile(file, category);
        lastUploaded = result;
      }

      if (lastUploaded) {
        setSelectedItem(lastUploaded);
        setActiveTab('library');
        setUploadProgressMsg('Upload complete! File stored in Supabase.');
        setTimeout(() => setUploadProgressMsg(null), 3000);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadProgressMsg('Error uploading image. Please check Supabase credentials.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleConfirmSelection = () => {
    if (activeTab === 'url') {
      if (customUrl.trim()) {
        onSelectImage(customUrl.trim());
        onClose();
      }
    } else if (selectedItem) {
      onSelectImage(selectedItem.url, selectedItem);
      onClose();
    }
  };

  const categories = [
    { id: 'all', label: 'All Media' },
    { id: 'projects', label: 'Projects' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'general', label: 'General' },
    { id: 'logos', label: 'Logos & Branding' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#00356a]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-[2.5rem] max-w-4xl w-full shadow-bubble-lg border border-[#e2e6eb] max-h-[92vh] flex flex-col overflow-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e2e6eb] bg-linear-to-r from-[#f8fafc] to-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00356a]/5 border border-[#00356a]/15 text-[#00356a] flex items-center justify-center shadow-bubble-sm">
              <ImageIcon className="w-5 h-5 text-[#006e21]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Supabase Storage Bucket: 'media'</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#00356a]">{title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#f4f6f8] text-[#00356a] hover:bg-[#e2e6eb] transition-colors cursor-pointer shadow-bubble-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Upload Quick Trigger */}
        <div className="px-6 py-3 bg-[#f4f6f8]/80 border-b border-[#e2e6eb] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#dce0e6] shadow-bubble-inset">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-[#00356a] text-white shadow-bubble-sm'
                  : 'text-[#00356a]/70 hover:text-[#00356a]'
              }`}
            >
              Media Library ({mediaItems.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-[#006e21] text-white shadow-bubble-sm'
                  : 'text-[#00356a]/70 hover:text-[#006e21]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-[#00356a] text-white shadow-bubble-sm'
                  : 'text-[#00356a]/70 hover:text-[#00356a]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Direct URL</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleProcessFiles(e.target.files)}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-1.5 rounded-full bg-[#006e21] text-white hover:bg-[#005a1b] text-xs font-bold uppercase tracking-wider shadow-bubble-sm flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Drop / Browse Files</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Status Banner */}
        {uploadProgressMsg && (
          <div className="px-6 py-2 bg-[#006e21]/10 border-b border-[#006e21]/20 flex items-center justify-between text-xs font-semibold text-[#006e21]">
            <div className="flex items-center gap-2">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{uploadProgressMsg}</span>
            </div>
            {uploadProgressMsg.includes('complete') && (
              <span className="text-[10px] bg-[#006e21] text-white px-2 py-0.5 rounded-full font-bold">READY</span>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: MEDIA LIBRARY GRID */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Category & Search Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#00356a] text-white shadow-bubble-sm'
                          : 'bg-[#f4f6f8] text-[#00356a]/70 hover:bg-[#e2e6eb]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-[#00356a]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search image name..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs text-[#00356a] bg-[#f4f6f8] border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-1 focus:ring-[#00356a]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#00356a]/50 hover:text-[#00356a]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Drag and Drop notice when hovering */}
              {isDragging && (
                <div className="p-8 rounded-3xl border-2 border-dashed border-[#006e21] bg-[#006e21]/5 text-center flex flex-col items-center justify-center animate-pulse">
                  <CloudUpload className="w-10 h-10 text-[#006e21] mb-2" />
                  <p className="text-sm font-bold text-[#006e21]">Drop image files here to upload to Supabase Storage</p>
                  <p className="text-xs text-[#00356a]/60 mt-1">Bucket: 'media' · Supports PNG, JPG, WEBP, SVG</p>
                </div>
              )}

              {/* Image Grid */}
              {filteredItems.length === 0 ? (
                <div className="text-center py-16 px-4 bg-[#f4f6f8] rounded-3xl border border-dashed border-[#dce0e6]">
                  <ImageIcon className="w-12 h-12 text-[#00356a]/30 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-[#00356a]">No images found</h4>
                  <p className="text-xs text-[#00356a]/60 mt-1 max-w-sm mx-auto">
                    {searchQuery ? `No images match query "${searchQuery}"` : 'Upload your first batch of images to the Supabase media bucket.'}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-5 py-2 rounded-full bg-[#006e21] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#005a1b] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images Now</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id || selectedItem?.url === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col bg-white ${
                          isSelected
                            ? 'border-[#006e21] ring-2 ring-[#006e21] shadow-bubble'
                            : 'border-[#e2e6eb] hover:border-[#00356a]/40 hover:shadow-bubble-sm'
                        }`}
                      >
                        {/* Image Thumbnail */}
                        <div className="aspect-4/3 w-full bg-[#f4f6f8] overflow-hidden relative">
                          <img
                            src={item.url}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Selected Checkmark Badge */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#006e21] text-white flex items-center justify-center shadow-md animate-scaleIn">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Category Tag */}
                          {item.category && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* Metadata Footer */}
                        <div className="p-2.5 bg-white border-t border-[#f0f3f5] flex flex-col justify-between flex-1">
                          <p className="text-[11px] font-bold text-[#00356a] truncate" title={item.name}>
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-[#00356a]/55 mt-1">
                            <span>{item.size || 'Auto'}</span>
                            <span className="truncate max-w-[80px]">{item.uploadedAt || 'Recent'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DRAG & DROP UPLOAD ZONE */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                  isDragging
                    ? 'border-[#006e21] bg-[#006e21]/5 scale-[1.01]'
                    : 'border-[#dce0e6] bg-[#f8fafc] hover:border-[#006e21] hover:bg-white'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#006e21]/10 text-[#006e21] flex items-center justify-center mb-4 shadow-bubble-sm">
                  <CloudUpload className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-[#00356a] mb-1">
                  Drag & Drop Images Here
                </h4>
                <p className="text-xs text-[#00356a]/70 max-w-md mx-auto mb-4">
                  Files are automatically uploaded directly to your Supabase Storage <span className="font-bold text-[#006e21]">'media'</span> bucket.
                </p>

                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002244]">
                    Browse Files
                  </span>
                  <span className="text-[11px] text-[#00356a]/60">Supports PNG, JPG, WEBP, SVG up to 50MB</span>
                </div>
              </div>

              {/* Target Category Selector */}
              <div className="p-4 rounded-2xl bg-[#f4f6f8] border border-[#e2e6eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#00356a]">
                    Upload Destination Category
                  </label>
                  <p className="text-[10px] text-[#00356a]/60">Organizes storage folders and library tagging.</p>
                </div>
                <select
                  value={selectedCategory === 'all' ? 'general' : selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#00356a] bg-white border border-[#dce0e6] shadow-bubble-inset focus:outline-none"
                >
                  <option value="projects">Projects (Case Studies)</option>
                  <option value="knowledge">Knowledge (Monographs)</option>
                  <option value="general">General Media</option>
                  <option value="logos">Logos & Branding</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT CDN / URL INPUT */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-[#f4f6f8] border border-[#e2e6eb]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#00356a] mb-2">
                  Enter Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg or /images/..."
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs text-[#00356a] bg-white border border-[#dce0e6] shadow-bubble-inset focus:outline-none focus:ring-2 focus:ring-[#00356a]"
                  />
                </div>
                <p className="text-[11px] text-[#00356a]/60 mt-2">
                  Paste any public CDN URL, Supabase storage URL, or relative asset path (`/images/...`).
                </p>
              </div>

              {customUrl && (
                <div className="p-4 rounded-2xl bg-white border border-[#e2e6eb] flex items-center gap-4">
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-[#f4f6f8] border border-[#dce0e6] shrink-0">
                    <img
                      src={customUrl}
                      alt="URL Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#006e21] uppercase tracking-wider">Live Preview</span>
                    <p className="text-xs text-[#00356a] font-mono truncate">{customUrl}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#e2e6eb] bg-[#f8fafc] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {activeTab !== 'url' && selectedItem ? (
              <div className="flex items-center gap-2 text-xs text-[#00356a]">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-[#dce0e6] shrink-0">
                  <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 max-w-[240px]">
                  <span className="font-bold block truncate">{selectedItem.name}</span>
                  <span className="text-[10px] text-[#006e21] block truncate">{selectedItem.url}</span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-[#00356a]/60">
                {activeTab === 'url' ? 'Paste direct URL above' : 'Select an image from the grid to insert'}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#00356a] hover:bg-[#e2e6eb] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={activeTab === 'url' ? !customUrl.trim() : !selectedItem}
              className="px-7 py-2.5 rounded-full bg-[#00356a] text-white text-xs font-bold uppercase tracking-wider shadow-bubble-sm hover:bg-[#002244] hover:shadow-bubble flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <Check className="w-4 h-4 text-[#006e21]" />
              <span>Use Selected Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
