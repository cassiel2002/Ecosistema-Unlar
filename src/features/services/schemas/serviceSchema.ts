import { z } from 'zod';

export const serviceSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),
  service_type: z.enum(['design', 'programming', 'photography', 'tutoring', 'writing', 'other'], {
    required_error: 'Seleccioná un tipo de servicio',
  }),
  price_range: z
    .string()
    .max(100, 'El rango de precio no puede superar los 100 caracteres')
    .nullable()
    .default(null),
  availability: z
    .string()
    .max(200, 'La disponibilidad no puede superar los 200 caracteres')
    .nullable()
    .default(null),
  portfolio_urls: z
    .array(z.string().url('URL inválida'))
    .max(10, 'Máximo 10 links de portfolio')
    .default([]),
  image_urls: z
    .array(z.string().url())
    .max(6, 'Máximo 6 imágenes')
    .default([]),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
