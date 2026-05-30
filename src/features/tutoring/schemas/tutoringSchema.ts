import { z } from 'zod';

export const tutoringSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),
  subject: z
    .string()
    .min(2, 'La materia debe tener al menos 2 caracteres')
    .max(100, 'La materia no puede superar los 100 caracteres'),
  career_id: z
    .string()
    .nullable()
    .default(null),
  modality: z.enum(['in_person', 'virtual', 'both'], {
    required_error: 'Seleccioná una modalidad',
  }),
  price_per_hour: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .nullable()
    .default(null),
  experience: z
    .string()
    .max(500, 'La experiencia no puede superar los 500 caracteres')
    .nullable()
    .default(null),
  schedule_availability: z
    .string()
    .max(200, 'La disponibilidad no puede superar los 200 caracteres')
    .nullable()
    .default(null),
  image_urls: z
    .array(z.string().url())
    .max(6, 'Máximo 6 imágenes')
    .default([]),
});

export type TutoringFormData = z.infer<typeof tutoringSchema>;
