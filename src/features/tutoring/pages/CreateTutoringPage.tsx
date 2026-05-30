import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { useCreateListing } from '@/shared/hooks/useCreateListing';
import { tutoringSchema, type TutoringFormData } from '../schemas/tutoringSchema';
import type { TutoringListing } from '@/shared/types';
import { useState } from 'react';

export function CreateTutoringPage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { create, isCreating, uploadImages } = useCreateListing<TutoringListing>({
    table: 'tutoring_listings',
    onSuccess: (id) => {
      toast.success('Clase publicada exitosamente');
      navigate(`/tutoring/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TutoringFormData>({
    resolver: zodResolver(tutoringSchema),
    defaultValues: {
      modality: 'both',
      career_id: null,
      price_per_hour: null,
      experience: null,
      schedule_availability: null,
      image_urls: [],
    },
  });

  const onSubmit = async (data: TutoringFormData) => {
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      await create({
        ...data,
        image_urls: imageUrls,
        status: 'active',
        is_pinned: false,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear publicación');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/tutoring')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a clases particulares
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Ofrecer clases particulares
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Publicá tu oferta de clases para ayudar a otros estudiantes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Images */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Fotos (máximo 6)
          </label>
          <ImageUploader
            maxImages={6}
            images={imageFiles}
            onChange={setImageFiles}
            maxSizeMB={5}
          />
        </div>

        {/* Title */}
        <Input
          label="Título"
          placeholder="Ej: Clases de Análisis Matemático I"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Subject */}
        <Input
          label="Materia"
          placeholder="Ej: Análisis Matemático I"
          error={errors.subject?.message}
          {...register('subject')}
        />

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <textarea
            placeholder="Describí tu metodología, temas que cubrís, nivel de dificultad..."
            rows={4}
            className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.description.message}</p>
          )}
        </div>

        {/* Modality */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Modalidad
          </label>
          <select
            className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('modality')}
          >
            <option value="in_person">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="both">Ambas</option>
          </select>
          {errors.modality && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.modality.message}</p>
          )}
        </div>

        {/* Price per hour */}
        <Controller
          name="price_per_hour"
          control={control}
          render={({ field }) => (
            <Input
              label="Precio por hora (opcional, dejar vacío = a convenir)"
              type="number"
              placeholder="3000"
              error={errors.price_per_hour?.message}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
            />
          )}
        />

        {/* Experience */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Experiencia (opcional)
          </label>
          <textarea
            placeholder="Ej: 2 años dando clases, aprobé la materia con 9..."
            rows={3}
            className="min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('experience')}
          />
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.experience.message}</p>
          )}
        </div>

        {/* Schedule */}
        <Input
          label="Disponibilidad horaria (opcional)"
          placeholder="Ej: Lunes y miércoles de 14 a 18hs"
          error={errors.schedule_availability?.message}
          {...register('schedule_availability')}
        />

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/tutoring')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Publicar clase
          </Button>
        </div>
      </form>
    </div>
  );
}
