import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { useCreateListing } from '@/shared/hooks/useCreateListing';
import type { Event } from '@/shared/types';
import { useState } from 'react';

const eventSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(3000, 'La descripción no puede superar los 3000 caracteres'),
  event_type: z.enum(['hackathon', 'talk', 'workshop', 'tournament', 'social', 'academic'], {
    required_error: 'Seleccioná el tipo de evento',
  }),
  start_date: z.string().min(1, 'Ingresá la fecha de inicio'),
  end_date: z.string().nullable().default(null),
  location: z
    .string()
    .min(3, 'Ingresá la ubicación')
    .max(200, 'La ubicación es demasiado larga'),
  is_virtual: z.boolean().default(false),
  virtual_link: z.string().url('Ingresá un link válido').nullable().default(null),
  max_attendees: z.number().min(1).nullable().default(null),
  registration_required: z.boolean().default(true),
  organizer: z
    .string()
    .min(2, 'Ingresá el organizador')
    .max(100, 'El organizador es demasiado largo'),
  image_urls: z
    .array(z.string().url())
    .max(6, 'Máximo 6 imágenes')
    .default([]),
});

type EventFormData = z.infer<typeof eventSchema>;

export function CreateEventPage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { create, isCreating, uploadImages } = useCreateListing<Event>({
    table: 'events',
    onSuccess: (id) => {
      toast.success('Evento creado exitosamente');
      navigate(`/events/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_type: 'talk',
      is_virtual: false,
      virtual_link: null,
      end_date: null,
      max_attendees: null,
      registration_required: true,
      image_urls: [],
    },
  });

  const isVirtual = watch('is_virtual');

  const onSubmit = async (data: EventFormData) => {
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      await create({
        ...data,
        image_urls: imageUrls,
        current_attendees: 0,
        status: 'active',
        is_pinned: false,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear evento');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/events')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Crear evento
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Organizá un evento para la comunidad universitaria
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Images */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Imagen del evento (opcional)
          </label>
          <ImageUploader
            maxFiles={6}
            onFilesChange={setImageFiles}
            acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
            maxSizeMB={5}
          />
        </div>

        {/* Title */}
        <Input
          label="Título del evento"
          placeholder="Ej: Hackathon de Inteligencia Artificial 2024"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <textarea
            placeholder="Describí el evento, qué se va a hacer, requisitos, etc..."
            rows={5}
            className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.description.message}</p>
          )}
        </div>

        {/* Type and Organizer */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tipo de evento
            </label>
            <select
              className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              {...register('event_type')}
            >
              <option value="hackathon">Hackathon</option>
              <option value="talk">Charla</option>
              <option value="workshop">Taller</option>
              <option value="tournament">Torneo</option>
              <option value="social">Social</option>
              <option value="academic">Académico</option>
            </select>
            {errors.event_type && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.event_type.message}</p>
            )}
          </div>

          <Input
            label="Organizador"
            placeholder="Ej: Centro de Estudiantes"
            error={errors.organizer?.message}
            {...register('organizer')}
          />
        </div>

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Fecha y hora de inicio"
            type="datetime-local"
            error={errors.start_date?.message}
            {...register('start_date')}
          />
          <Input
            label="Fecha y hora de fin (opcional)"
            type="datetime-local"
            error={errors.end_date?.message}
            {...register('end_date')}
          />
        </div>

        {/* Location */}
        <Input
          label="Ubicación"
          placeholder="Ej: Aula Magna, Pabellón 1"
          error={errors.location?.message}
          {...register('location')}
        />

        {/* Virtual */}
        <div className="space-y-3">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('is_virtual')}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Es un evento virtual (o híbrido)
            </span>
          </label>

          {isVirtual && (
            <Input
              label="Link del evento virtual"
              placeholder="https://meet.google.com/..."
              error={errors.virtual_link?.message}
              {...register('virtual_link')}
            />
          )}
        </div>

        {/* Max attendees */}
        <Controller
          name="max_attendees"
          control={control}
          render={({ field }) => (
            <Input
              label="Máximo de asistentes (opcional, dejar vacío para ilimitado)"
              type="number"
              placeholder="50"
              error={errors.max_attendees?.message}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
            />
          )}
        />

        {/* Registration required */}
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            {...register('registration_required')}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Requiere registro previo
          </span>
        </label>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/events')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Crear evento
          </Button>
        </div>
      </form>
    </div>
  );
}
