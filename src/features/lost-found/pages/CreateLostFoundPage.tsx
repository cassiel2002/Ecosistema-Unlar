import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { useCreateListing } from '@/shared/hooks/useCreateListing';
import type { LostFoundItem } from '@/shared/types';
import { useState } from 'react';

const lostFoundSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),
  item_type: z.enum(['lost', 'found'], {
    required_error: 'Seleccioná si es perdido o encontrado',
  }),
  category: z.enum(['electronics', 'documents', 'clothing', 'keys', 'other'], {
    required_error: 'Seleccioná una categoría',
  }),
  location_found: z
    .string()
    .min(3, 'Ingresá la ubicación')
    .max(200, 'La ubicación es demasiado larga'),
  date_found: z.string().min(1, 'Ingresá la fecha'),
  image_urls: z
    .array(z.string().url())
    .max(6, 'Máximo 6 imágenes')
    .default([]),
});

type LostFoundFormData = z.infer<typeof lostFoundSchema>;

export function CreateLostFoundPage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { create, isCreating, uploadImages } = useCreateListing<LostFoundItem>({
    table: 'lost_found_items',
    onSuccess: (id) => {
      toast.success('Reporte creado exitosamente');
      navigate(`/lost-found/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LostFoundFormData>({
    resolver: zodResolver(lostFoundSchema),
    defaultValues: {
      item_type: 'found',
      category: 'other',
      date_found: new Date().toISOString().split('T')[0],
      image_urls: [],
    },
  });

  const onSubmit = async (data: LostFoundFormData) => {
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      await create({
        ...data,
        image_urls: imageUrls,
        is_resolved: false,
        status: 'active',
        is_pinned: false,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear reporte');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/lost-found')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a perdidos y encontrados
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Reportar objeto
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Reportá un objeto perdido o encontrado en la universidad
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (validationErrors) => {
        const firstError = Object.values(validationErrors)[0];
        toast.error(firstError?.message?.toString() || 'Revisá los campos del formulario');
      })} className="space-y-6">
        {/* Images */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Fotos (opcional, máximo 6)
          </label>
          <ImageUploader
            maxImages={6}
            images={imageFiles}
            onChange={setImageFiles}
            maxSizeMB={5}
          />
        </div>

        {/* Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            ¿Perdido o encontrado?
          </label>
          <select
            className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('item_type')}
          >
            <option value="lost">Perdí algo</option>
            <option value="found">Encontré algo</option>
          </select>
          {errors.item_type && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.item_type.message}</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Título"
          placeholder="Ej: Llaves con llavero azul"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <textarea
            placeholder="Describí el objeto con el mayor detalle posible..."
            rows={4}
            className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Categoría
          </label>
          <select
            className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('category')}
          >
            <option value="electronics">Electrónica</option>
            <option value="documents">Documentos</option>
            <option value="clothing">Ropa</option>
            <option value="keys">Llaves</option>
            <option value="other">Otros</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.category.message}</p>
          )}
        </div>

        {/* Location and Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Ubicación"
            placeholder="Ej: Biblioteca central, 2do piso"
            error={errors.location_found?.message}
            {...register('location_found')}
          />
          <Input
            label="Fecha"
            type="date"
            error={errors.date_found?.message}
            {...register('date_found')}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/lost-found')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Crear reporte
          </Button>
        </div>
      </form>
    </div>
  );
}
