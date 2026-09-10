/**
 * Client-side high-fidelity image compression and optimization utility.
 * Compresses camera/phone photos (often 3MB - 15MB) into lightweight,
 * crystal-clear web assets (usually 80KB - 250KB).
 * This prevents localStorage QuotaExceeded errors and browser memory thrashing.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  size: string;
  dimensions: string;
  name: string;
}

export async function compressAndOptimizeImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<OptimizedImageResult> {
  const cleanName = file.name.replace(/\.[^/.]+$/, '');
  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

  // If SVG vector, retain original vector code without rasterization
  if (isSvg) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = reader.result as string;
        const sizeInKb = Math.round(file.size / 1024);
        resolve({
          dataUrl: raw,
          size: `${sizeInKb} KB`,
          dimensions: 'Vector Graphic',
          name: cleanName
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // For bitmap images, resize and compress using HTML Canvas
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Downscale if exceeds max dimensions while strictly preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback if canvas 2D context unavailable
            resolve({
              dataUrl: rawDataUrl,
              size: `${Math.round(file.size / 1024)} KB`,
              dimensions: `${img.naturalWidth} x ${img.naturalHeight}`,
              name: cleanName
            });
            return;
          }

          // Quality settings for smooth bicubic scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // If PNG with transparency, use PNG or WebP; otherwise JPEG
          const isTransparent = file.type === 'image/png';
          let outputMime = 'image/jpeg';
          if (isTransparent) {
            outputMime = 'image/png';
          } else if (file.type === 'image/webp') {
            outputMime = 'image/webp';
          }

          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL(outputMime, isTransparent ? undefined : quality);

          // Calculate approximate base64 payload size
          const base64Length = optimizedDataUrl.length - (optimizedDataUrl.indexOf(',') + 1);
          const sizeInBytes = Math.ceil((base64Length * 3) / 4);
          const sizeInKb = Math.round(sizeInBytes / 1024);
          const formattedSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

          resolve({
            dataUrl: optimizedDataUrl,
            size: formattedSize,
            dimensions: `${width} x ${height}`,
            name: cleanName
          });
        } catch (err) {
          console.warn('Canvas optimization error, falling back to raw dataUrl:', err);
          resolve({
            dataUrl: rawDataUrl,
            size: `${Math.round(file.size / 1024)} KB`,
            dimensions: 'User Upload',
            name: cleanName
          });
        }
      };

      img.onerror = (err) => {
        console.warn('Image load error during optimization, falling back:', err);
        resolve({
          dataUrl: rawDataUrl,
          size: `${Math.round(file.size / 1024)} KB`,
          dimensions: 'User Upload',
          name: cleanName
        });
      };

      img.src = rawDataUrl;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
