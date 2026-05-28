import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useCreateListing } from '@/shared/hooks/useCreateListing';
import { forumPostSchema, type ForumPostFormData } from '../schemas/forumPostSchema';
import type { ForumPost } from '@/shared/types';
import { useState } from 'react';

export function CreateForumPostPage() {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');

  const { create, isCreating } = useCreateListing<ForumPost>({
    table: 'forum_posts',
    onSuccess: (id) => {
      toast.success('Publicación creada exitosamente');
      navigate(`/forum/${id}`);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ForumPostFormData>({
    resolver: zodResolver(forumPostSchema),
    defaultValues: {
      category: 'question',
      tags: [],
      related_career_id: null,
      related_course: null,
      image_urls: [],
    },
  });

  const tags = watch('tags');

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase().replace(/[^a-záéíóúñü0-9-]/g, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setValue('tags', [...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setValue('tags', tags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: ForumPostFormData) => {
    try {
      await create({
        ...data,
        upvotes: 0,
        downvotes: 0,
        comment_count: 0,
        is_answered: false,
        status: 'active',
        is_pinned: false,
        image_urls: [],
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear publicación');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <button
        onClick={() => navigate('/forum')}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al foro
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Nueva publicación
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Compartí tu pregunta, reseña o recomendación
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Categoría
          </label>
          <select
            className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('category')}
          >
            <option value="question">Pregunta</option>
            <option value="review">Reseña</option>
            <option value="recommendation">Recomendación</option>
            <option value="discussion">Discusión</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.category.message}</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Título"
          placeholder="Ej: ¿Alguien cursó Análisis II con García?"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Content */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Contenido
          </label>
          <textarea
            placeholder="Escribí tu publicación..."
            rows={6}
            className="min-h-[150px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.description.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tags (máximo 5)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder="Agregar tag..."
              className="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => addTag(tagInput)}
              disabled={tags.length >= 5}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Agregar
            </Button>
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600" role="alert">{errors.tags.message}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label={`Quitar tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related course */}
        <Input
          label="Materia relacionada (opcional)"
          placeholder="Ej: Análisis Matemático II"
          {...register('related_course')}
        />

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/forum')}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Publicar
          </Button>
        </div>
      </form>
    </div>
  );
}
