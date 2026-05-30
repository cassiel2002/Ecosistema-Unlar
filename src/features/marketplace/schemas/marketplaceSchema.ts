import { z } from 'zod';

export const marketplaceSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),
  category: z.enum(['notes', 'electronics', 'furniture', 'books', 'bikes', 'other'], {
    required_error: 'Seleccioná una categoría',
  }),
  condition: z.enum(['new', 'like_new', 'good', 'fair'], {
    required_error: 'Seleccioná el estado del producto',
  }),
  is_free: z.boolean().default(false),
  price: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .nullable()
    .default(null),
  image_urls: z
    .array(z.string().url())
    .max(6, 'Máximo 6 imágenes')
    .default([]),
  contact_phone: z.string().optional().nullable(),
}).refine(
  (data) => data.is_free || (data.price !== null && data.price > 0),
  {
    message: 'Ingresá un precio o marcá como gratis',
    path: ['price'],
  }
);

export type MarketplaceFormData = z.infer<typeof marketplaceSchema>;
