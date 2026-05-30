import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import type { MarketplaceItem } from '@/shared/types';

interface MarketplacePreviewCardProps {
  item: Partial<MarketplaceItem>;
}

const conditionLabels: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como nuevo',
  good: 'Buen estado',
  fair: 'Usado',
};

export function MarketplacePreviewCard({ item }: MarketplacePreviewCardProps) {
  const formattedPrice = item.is_free
    ? 'GRATIS'
    : item.price
      ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(item.price)
      : 'Consultar';

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-gray-700"
    >
      {/* Image */}
      {item.image_urls && item.image_urls[0] && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={item.image_urls[0]}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {item.is_free && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-sm text-xs font-bold text-white rounded-lg">
                GRATIS
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
          {item.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className={`font-bold text-sm ${item.is_free ? 'text-emerald-400' : 'text-primary-400'}`}>
            {formattedPrice}
          </span>
          {item.condition && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Tag className="h-3 w-3" />
              {conditionLabels[item.condition]}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}
