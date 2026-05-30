import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ImageUploader } from '@/shared/ui/ImageUploader';
import { useCreateListing } from '@/shared/hooks/useCreateListing';
import { serviceSchema, type ServiceFormData } from '../schemas/serviceSchema';
import type { Service } from '@/shared/types';
import { useState } from 'react';

export function CreateServicePage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [portfolioInput, setPortfolioInput] = useState('');

  const { create, isCreating, uploadImages } = useCreateListing<Service>({
    table: 'services',
    onSuccess: (id) => {
      toast.success('Servicio publicado exitosamente');
      navigate(`/services/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      service_type: 'other',
      price_range: null,
      availability: null,
      portfolio_urls: [],
      image_urls: [],
    },
  });

  const portfolioUrls = watch('portfolio_urls');

  const addPortfolioUrl = () => {
    if (!portfolioInput.trim()) return;
    try {
      new URL(portfolioInput);
      setValue('portfolio_urls', [...(portfolioUrls || []), portfolioInput.trim()]);
      setPortfolioInput('');
    } catch {
      toast.error('Ingresá una URL válida');
    }
  };

  const removePortfolioUrl = (index: number) => {
    setValue('portfolio_urls', (portfolioUrls || []).filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      await create({
        ...data,
        image_urls: imageUrls,
        portfolio_urls: data.portfolio_urls || [],
        status: 'active',
        is_pinned: false,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear servicio');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/services')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a servicios
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Ofrecer servicio
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Publicá tu servicio profesional para otros estudiantes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (validationErrors) => {
        const firstError = Object.values(validationErrors)[0];
        toast.error(firstError?.message?.toString() || 'Revisá los campos del formulario');
      })} className="space-y-6">
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
          label="Título del servicio"
          placeholder="Ej: Diseño de logos y branding"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Descripción
          </label>
          <textarea
            placeholder="Describí tu servicio, experiencia y qué incluye..."
            rows={4}
            className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.description.message}</p>
          )}
        </div>

        {/* Service Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tipo de servicio
          </label>
          <select
            className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('service_type')}
          >
            <option value="design">Diseño</option>
            <option value="programming">Programación</option>
            <option value="photography">Fotografía</option>
            <option value="tutoring">Tutoría</option>
            <option value="writing">Redacción</option>
            <option value="other">Otro</option>
          </select>
          {errors.service_type && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.service_type.message}</p>
          )}
        </div>

        {/* Price Range */}
        <Input
          label="Rango de precios (opcional)"
          placeholder="Ej: $5.000 - $15.000"
          error={errors.price_range?.message}
          {...register('price_range')}
        />

        {/* Availability */}
        <Input
          label="Disponibilidad (opcional)"
          placeholder="Ej: Lunes a viernes de 9 a 18hs"
          error={errors.availability?.message}
          {...register('availability')}
        />

        {/* Portfolio URLs */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Links de portfolio (opcional)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="https://mi-portfolio.com"
              value={portfolioInput}
              onChange={(e) => setPortfolioInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addPortfolioUrl();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={addPortfolioUrl}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {portfolioUrls && portfolioUrls.length > 0 && (
            <ul className="mt-2 space-y-1">
              {portfolioUrls.map((url, index) => (
                <li key={index} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800">
                  <span className="flex-1 truncate text-sm text-gray-600 dark:text-gray-300">{url}</span>
                  <button
                    type="button"
                    onClick={() => removePortfolioUrl(index)}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {errors.portfolio_urls && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.portfolio_urls.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/services')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Publicar servicio
          </Button>
        </div>
      </form>
    </div>
  );
}
