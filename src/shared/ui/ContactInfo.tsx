import { Mail, Phone, Instagram } from 'lucide-react';
import type { ContactInfoProps } from '@/shared/types/ui';

export function ContactInfo({ phone, instagram, email, showEmail = true }: ContactInfoProps) {
  const hasAnyContact = phone || instagram || (showEmail && email);

  if (!hasAnyContact) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Información de contacto
      </h4>
      <div className="space-y-1.5">
        {showEmail && email && (
          <a
            href={`mailto:${email}`}
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Mail className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <span className="truncate">{email}</span>
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Phone className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <span>{phone}</span>
          </a>
        )}
        {instagram && (
          <a
            href={`https://instagram.com/${instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Instagram className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <span>{instagram.startsWith('@') ? instagram : `@${instagram}`}</span>
          </a>
        )}
      </div>
    </div>
  );
}
