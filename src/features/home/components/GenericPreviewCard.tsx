import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, BookOpen, Briefcase, Camera, Code, PenTool, AlertTriangle, Megaphone } from 'lucide-react';
import type { LostFoundItem, Service, TutoringListing, Announcement } from '@/shared/types';

type GenericItem = Partial<LostFoundItem> | Partial<Service> | Partial<TutoringListing> | Partial<Announcement>;

interface GenericPreviewCardProps {
  item: GenericItem;
  type: 'lost_found' | 'service' | 'tutoring' | 'announcement';
}

const serviceIcons: Record<string, typeof Briefcase> = {
  design: PenTool,
  programming: Code,
  photography: Camera,
  tutoring: BookOpen,
  writing: PenTool,
  other: Briefcase,
};

export function GenericPreviewCard({ item, type }: GenericPreviewCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-gray-700"
    >
      {/* Image (if available) */}
      {'image_urls' in item && item.image_urls && item.image_urls.length > 0 && item.image_urls[0] && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={item.image_urls[0]}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {type === 'lost_found' && 'item_type' in item && (
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg backdrop-blur-sm ${
                item.item_type === 'lost' ? 'bg-red-600/80 text-white' : 'bg-emerald-600/80 text-white'
              }`}>
                {item.item_type === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Type badge for items without image */}
        {type === 'announcement' && 'priority' in item && (
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-amber-400" />
            {item.priority === 'important' && (
              <span className="px-2 py-0.5 bg-amber-600/20 text-amber-400 text-xs font-medium rounded-lg">
                Importante
              </span>
            )}
            {item.priority === 'urgent' && (
              <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs font-medium rounded-lg flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Urgente
              </span>
            )}
          </div>
        )}

        {/* Service type icon */}
        {type === 'service' && 'service_type' in item && item.service_type && (
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = serviceIcons[item.service_type] || Briefcase;
              return <Icon className="h-4 w-4 text-primary-400" />;
            })()}
            <span className="text-xs text-gray-500 capitalize">{item.service_type}</span>
          </div>
        )}

        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
        )}

        {/* Type-specific details */}
        <div className="space-y-1.5">
          {type === 'lost_found' && 'location_found' in item && item.location_found && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{item.location_found}</span>
            </div>
          )}

          {type === 'service' && 'price_range' in item && item.price_range && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{item.price_range}</span>
            </div>
          )}

          {type === 'service' && 'availability' in item && item.availability && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{item.availability}</span>
            </div>
          )}

          {type === 'tutoring' && 'subject' in item && item.subject && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{item.subject}</span>
            </div>
          )}

          {type === 'tutoring' && 'price_per_hour' in item && item.price_per_hour && (
            <div className="flex items-center gap-1.5 text-xs text-primary-400">
              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="font-medium">
                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(item.price_per_hour)}/hora
              </span>
            </div>
          )}

          {type === 'tutoring' && 'modality' in item && item.modality && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="px-2 py-0.5 bg-gray-800 rounded-md">
                {item.modality === 'virtual' ? 'Virtual' : item.modality === 'in_person' ? 'Presencial' : 'Presencial/Virtual'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
