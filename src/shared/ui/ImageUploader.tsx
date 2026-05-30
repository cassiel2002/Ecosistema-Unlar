import { useCallback, useRef, useState } from 'react';
import { ImagePlus, X, AlertCircle } from 'lucide-react';

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 6;

export interface ImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

interface ImagePreview {
  file: File;
  url: string;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = MAX_IMAGES,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>(() =>
    (images || []).map((file) => ({ file, url: URL.createObjectURL(file) }))
  );
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxSize = maxSizeMB * 1024 * 1024;

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        return `Formato no válido: ${file.name}. Solo se aceptan JPG, PNG y WebP.`;
      }
      if (file.size > maxSize) {
        return `${file.name} excede el tamaño máximo de ${maxSizeMB}MB.`;
      }
      return null;
    },
    [maxSize, maxSizeMB]
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const remainingSlots = maxImages - previews.length;

      if (remainingSlots <= 0) {
        setError(`Máximo ${maxImages} imágenes permitidas.`);
        return;
      }

      const filesToAdd = fileArray.slice(0, remainingSlots);
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of filesToAdd) {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(validationError);
        } else {
          validFiles.push(file);
        }
      }

      if (fileArray.length > remainingSlots) {
        errors.push(`Solo se pueden agregar ${remainingSlots} imagen(es) más.`);
      }

      if (errors.length > 0) {
        setError(errors[0]);
      } else {
        setError(null);
      }

      if (validFiles.length > 0) {
        const newPreviews = validFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);
        onChange(updatedPreviews.map((p) => p.file));
      }
    },
    [maxImages, previews, validateFile, onChange]
  );

  const removeImage = useCallback(
    (index: number) => {
      const updated = previews.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(previews[index].url);
      setPreviews(updated);
      onChange(updated.map((p) => p.file));
      setError(null);
    },
    [previews, onChange]
  );

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
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
              : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-primary-500 dark:hover:bg-gray-750'
          }
          ${previews.length >= maxImages ? 'pointer-events-none opacity-50' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="Subir imágenes"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <ImagePlus className="mb-2 h-8 w-8 text-gray-400" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Arrastrá imágenes o hacé clic para subir
        </p>
        <p className="mt-1 text-xs text-gray-400">
          JPG, PNG o WebP. Máx {maxSizeMB}MB por imagen. Hasta {maxImages} imágenes.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS.join(',')}
        multiple
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {previews.map((preview, index) => (
            <div key={preview.url} className="group relative aspect-square overflow-hidden rounded-lg">
              <img
                src={preview.url}
                alt={`Imagen ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute right-1 top-1 min-h-[32px] min-w-[32px] inline-flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                aria-label={`Eliminar imagen ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {previews.length} / {maxImages} imágenes
      </p>
    </div>
  );
}
