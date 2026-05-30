import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Avatar } from '@/shared/ui/Avatar';
import { useState } from 'react';
import { supabase } from '@/core/supabase/client';

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  bio: z
    .string()
    .max(500, 'La bio no puede superar los 500 caracteres')
    .nullish(),
  contact_phone: z
    .string()
    .max(20, 'El teléfono no puede superar los 20 caracteres')
    .nullish(),
  contact_instagram: z
    .string()
    .max(50, 'El Instagram no puede superar los 50 caracteres')
    .nullish(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile, user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? '',
      bio: profile?.bio ?? null,
      contact_phone: profile?.contact_phone ?? null,
      contact_instagram: profile?.contact_instagram ?? null,
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      toast.error('Solo se permiten imágenes JPG, PNG o WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop() ?? 'jpg';
      const filePath = `avatars/${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: urlData.publicUrl });
      toast.success('Avatar actualizado');
    } catch (err) {
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        full_name: data.full_name,
        bio: data.bio || null,
        contact_phone: data.contact_phone || null,
        contact_instagram: data.contact_instagram || null,
      });
      toast.success('Perfil actualizado correctamente');
      navigate(`/perfil/${user?.id}`);
    } catch (err) {
      toast.error('Error al actualizar el perfil');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate(`/perfil/${user?.id}`)}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Editar perfil
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Actualizá tu información personal
        </p>
      </div>

      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <Avatar
          src={profile?.avatar_url ?? null}
          name={profile?.full_name ?? 'Usuario'}
          size="lg"
        />
        <div>
          <label className="cursor-pointer">
            <span className="inline-flex min-h-[44px] items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
              {isUploading ? 'Subiendo...' : 'Cambiar foto'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG o WebP. Máximo 5MB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full name */}
        <Input
          label="Nombre completo"
          placeholder="Tu nombre"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        {/* Bio */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Bio (opcional)
          </label>
          <textarea
            placeholder="Contá algo sobre vos..."
            rows={3}
            className="min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('bio')}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.bio.message}</p>
          )}
        </div>

        {/* Contact phone */}
        <Input
          label="Teléfono (opcional)"
          placeholder="+54 9 11 1234-5678"
          error={errors.contact_phone?.message}
          {...register('contact_phone')}
        />

        {/* Instagram */}
        <Input
          label="Instagram (opcional)"
          placeholder="@tu_usuario"
          error={errors.contact_instagram?.message}
          {...register('contact_instagram')}
        />

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(`/perfil/${user?.id}`)}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting} fullWidth>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
