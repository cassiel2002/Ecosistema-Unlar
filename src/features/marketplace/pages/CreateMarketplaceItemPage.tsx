import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { useCreateListing } from '@/shared/hooks/useCreateListing';
import { marketplaceSchema, type MarketplaceFormData } from '../schemas/marketplaceSchema';
import type { MarketplaceItem } from '@/shared/types';
import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { supabase } from '@/core/supabase/client';

export function CreateMarketplaceItemPage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { user, profile } = useAuth();

  const { create, isCreating, uploadImages } = useCreateListing<MarketplaceItem>({
    table: 'marketplace_items',
    onSuccess: (id) => {
      toast.success('Artículo publicado exitosamente');
      navigate(`/marketplace/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MarketplaceFormData>({
    resolver: zodResolver(marketplaceSchema),
    defaultValues: {
      category: 'other',
      condition: 'good',
      is_free: false,
      price: null,
      image_urls: [],
      contact_phone: profile?.contact_phone ?? '',
    },
  });

  useEffect(() => {
    if (profile?.contact_phone) {
      setValue('contact_phone', profile.contact_phone);
    }
  }, [profile?.contact_phone, setValue]);

  const isFree = watch('is_free');

  const onSubmit = async (data: MarketplaceFormData) => {
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      if (data.contact_phone !== undefined && user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ contact_phone: data.contact_phone || null })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error al actualizar el teléfono en el perfil:', profileError);
        }
      }

      const { contact_phone, ...listingPayload } = data;

      await create({
        ...listingPayload,
        price: data.is_free ? null : data.price,
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
        onClick={() => navigate('/marketplace')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al marketplace
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Publicar artículo
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Vendé o regalá algo que ya no necesitás
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
          placeholder="Ej: Calculadora científica Casio fx-991"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <textarea
            placeholder="Describí el artículo, su estado y cualquier detalle relevante..."
            rows={4}
            className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.description.message}</p>
          )}
        </div>

        {/* Category and Condition */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Categoría
            </label>
            <select
              className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              {...register('category')}
            >
              <option value="notes">📚 Apuntes, Resúmenes y Copias</option>
              <option value="books">📕 Libros, Manuales y Literatura</option>
              <option value="electronics">💻 Tecnología, Computación y Celulares</option>
              <option value="furniture">🪑 Hogar, Muebles y Decoración</option>
              <option value="bikes">🚲 Deportes, Bicicletas y Fitness</option>
              <option value="other">👕 Ropa, Calzado, Útiles y Otros</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Estado del producto
            </label>
            <select
              className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              {...register('condition')}
            >
              <option value="new">Nuevo</option>
              <option value="like_new">Como nuevo</option>
              <option value="good">Buen estado</option>
              <option value="fair">Usado</option>
            </select>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.condition.message}</p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="space-y-3">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('is_free')}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Es gratis (regalo)
            </span>
          </label>

          {!isFree && (
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  label="Precio"
                  type="number"
                  placeholder="5000"
                  error={errors.price?.message}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                />
              )}
            />
          )}
        </div>

        {/* Contact Phone */}
        <Input
          label="Teléfono de contacto (WhatsApp / Llamadas)"
          placeholder="Ej: +54 9 380 4123456"
          error={errors.contact_phone?.message}
          {...register('contact_phone')}
        />

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/marketplace')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Publicar artículo
          </Button>
        </div>
      </form>
    </div>
  );
}
