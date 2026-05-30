import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export function ImageGallery({ images, alt = 'Imagen' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, goToNext, goToPrevious]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        <ZoomIn className="h-8 w-8 text-gray-300 dark:text-gray-600" />
      </div>
    );
  }

  return (
    <>
      {/* Main gallery */}
      <div className="space-y-2">
        {/* Main image */}
        <div className="relative overflow-hidden rounded-xl">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="block w-full"
            aria-label="Abrir imagen en pantalla completa"
          >
            <img
              src={images[selectedIndex]}
              alt={`${alt} ${selectedIndex + 1}`}
              className="aspect-[4/3] w-full object-cover transition-transform hover:scale-[1.02]"
            />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all
                  ${
                    index === selectedIndex
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }
                `}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={index === selectedIndex ? 'true' : undefined}
              >
                <img
                  src={img}
                  alt={`${alt} miniatura ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Galería de imágenes"
          >
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10"
              aria-label="Cerrar galería"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[selectedIndex]}
              alt={`${alt} ${selectedIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
