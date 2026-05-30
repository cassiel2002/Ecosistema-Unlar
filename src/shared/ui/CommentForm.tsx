import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './Button';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export function CommentForm({
  onSubmit,
  isSubmitting = false,
  placeholder = 'Escribí un comentario...',
  autoFocus = false,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    await onSubmit(trimmed);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
        aria-label="Escribir comentario"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim()}
          isLoading={isSubmitting}
          leftIcon={<Send className="h-3.5 w-3.5" />}
        >
          Enviar
        </Button>
      </div>
    </form>
  );
}
