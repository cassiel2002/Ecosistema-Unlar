import { z } from 'zod';

export const forumPostSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(150, 'El título no puede superar los 150 caracteres'),
  description: z
    .string()
    .min(10, 'El contenido debe tener al menos 10 caracteres')
    .max(5000, 'El contenido no puede superar los 5000 caracteres'),
  category: z.enum(['question', 'review', 'recommendation', 'discussion'], {
    required_error: 'Seleccioná una categoría',
  }),
  tags: z
    .array(z.string().min(1).max(30))
    .min(1, 'Agregá al menos un tag')
    .max(5, 'Máximo 5 tags'),
  related_career_id: z.string().nullable(),
  related_course: z.string().max(100).nullable(),
  image_urls: z
    .array(z.string().url())
    .max(6, 'Máximo 6 imágenes'),
});

export type ForumPostFormData = z.infer<typeof forumPostSchema>;
