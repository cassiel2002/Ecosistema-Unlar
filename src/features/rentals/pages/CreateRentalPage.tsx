import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { useCreateListing } from '@/shared/hooks/useCreateListing';
import { rentalSchema, type RentalFormData } from '../schemas/rentalSchema';
import type { Rental } from '@/shared/types';
import { useState } from 'react';

const AMENITY_SUGGESTIONS = [
  'WiFi', 'Aire acondicionado', 'Calefacción', 'Lavarropas',
  'Cocina equipada', 'Balcón', 'Estacionamiento', 'Piscina',
  'Gimnasio', 'Seguridad 24hs', 'Ascensor', 'Amoblado',
];

export function CreateRentalPage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [amenityInput, setAmenityInput] = useState('');

  const { create, isCreating, uploadImages } = useCreateListing<Rental>({
    table: 'rentals',
    onSuccess: (id) => {
      toast.success('Alquiler publicado exitosamente');
      navigate(`/rentals/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      type: 'apartment',
      currency: 'ARS',
      amenities: [],
      allows_pets: false,
      gender_preference: 'any',
      available_from: null,
      image_urls: [],
    },
  });

  const amenities = watch('amenities');

  const addAmenity = (amenity: string) => {
    const trimmed = amenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setValue('amenities', [...amenities, trimmed]);
    }
    setAmenityInput('');
  };

  const removeAmenity = (amenity: string) => {
    setValue('amenities', amenities.filter((a) => a !== amenity));
  };

  const onSubmit = async (data: RentalFormData) => {
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
      {/* Back button */}
      <button
        onClick={() => navigate('/rentals')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a alquileres
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Publicar alquiler
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Completá los datos de tu propiedad para publicarla
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Images */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Fotos (máximo 6)
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
          label="Título"
          placeholder="Ej: Departamento 2 ambientes en Nueva Córdoba"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <textarea
            placeholder="Describí la propiedad, sus características y condiciones..."
            rows={5}
            className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Type and Price row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tipo de alquiler
            </label>
            <select
              className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              {...register('type')}
            >
              <option value="apartment">Departamento</option>
              <option value="room">Habitación</option>
              <option value="shared">Compartido</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.type.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Precio mensual"
                    type="number"
                    placeholder="50000"
                    error={errors.price?.message}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                )}
              />
            </div>
            <div className="w-24">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Moneda
              </label>
              <select
                className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                {...register('currency')}
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Dirección"
            placeholder="Av. Colón 1234"
            error={errors.location?.message}
            {...register('location')}
          />
          <Input
            label="Barrio"
            placeholder="Nueva Córdoba"
            error={errors.neighborhood?.message}
            {...register('neighborhood')}
          />
        </div>

        {/* Available from */}
        <Input
          label="Disponible desde"
          type="date"
          error={errors.available_from?.message}
          {...register('available_from')}
        />

        {/* Amenities */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Comodidades
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAmenity(amenityInput);
                }
              }}
              placeholder="Agregar comodidad..."
              className="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => addAmenity(amenityInput)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Agregar
            </Button>
          </div>

          {/* Suggestions */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {AMENITY_SUGGESTIONS.filter((s) => !amenities.includes(s)).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addAmenity(suggestion)}
                className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-600 dark:text-gray-300"
              >
                + {suggestion}
              </button>
            ))}
          </div>

          {/* Selected amenities */}
          {amenities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-200"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800"
                    aria-label={`Quitar ${amenity}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Preferencia de género
            </label>
            <select
              className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              {...register('gender_preference')}
            >
              <option value="any">Sin preferencia</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...register('allows_pets')}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Acepta mascotas
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/rentals')}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Publicar alquiler
          </Button>
        </div>
      </form>
    </div>
  );
}
