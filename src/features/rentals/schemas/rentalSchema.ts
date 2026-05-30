import { z } from 'zod';

export const rentalSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(2000, 'La descripción no puede superar los 2000 caracteres'),
  type: z.enum(['apartment', 'room', 'shared'], {
    required_error: 'Seleccioná el tipo de alquiler',
  }),
  price: z
    .number({ required_error: 'Ingresá el precio' })
    .min(1, 'El precio debe ser mayor a 0'),
  currency: z.enum(['ARS', 'USD'], {
    required_error: 'Seleccioná la moneda',
  }),
  location: z
    .string()
    .min(3, 'Ingresá la dirección')
    .max(200, 'La dirección es demasiado larga'),
  neighborhood: z
    .string()
    .min(2, 'Ingresá el barrio')
    .max(100, 'El barrio es demasiado largo'),
  amenities: z.array(z.string()).default([]),
  available_from: z.string().nullable(),
  allows_pets: z.boolean().default(false),
  gender_preference: z.enum(['any', 'male', 'female']).default('any'),
  image_urls: z
    .array(z.string().url())
    .max(6, 'Máximo 6 imágenes'),
});

export type RentalFormData = z.infer<typeof rentalSchema>;
