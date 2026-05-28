import { motion } from 'framer-motion';
import { MapPin, Home, Users, PawPrint } from 'lucide-react';
import type { Rental } from '@/shared/types';

interface RentalPreviewCardProps {
  rental: Partial<Rental>;
}

const typeLabels: Record<string, string> = {
  apartment: 'Departamento',
  room: 'Habitación',
  shared: 'Compartido',
};

export function RentalPreviewCard({ rental }: RentalPreviewCardProps) {
  const formattedPrice = rental.price
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: rental.currency || 'ARS', maximumFractionDigits: 0 }).format(rental.price)
    : 'Consultar';

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-gray-700"
    >
      {/* Image */}
      {rental.image_urls && rental.image_urls[0] && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={rental.image_urls[0]}
            alt={rental.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm text-xs font-medium text-gray-200 rounded-lg">
              {typeLabels[rental.type || 'apartment']}
            </span>
          </div>
          {rental.gender_preference && rental.gender_preference !== 'any' && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 bg-purple-600/80 backdrop-blur-sm text-xs font-medium text-white rounded-lg">
                {rental.gender_preference === 'female' ? 'Solo chicas' : 'Solo chicos'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
            {rental.title}
          </h3>
          <span className="text-primary-400 font-bold text-sm whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-xs truncate">{rental.neighborhood || rental.location}</span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {rental.type && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Home className="h-3 w-3" />
              {typeLabels[rental.type]}
            </span>
          )}
          {rental.type === 'shared' && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              Compartido
            </span>
          )}
          {rental.allows_pets && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <PawPrint className="h-3 w-3" />
              Mascotas OK
            </span>
          )}
        </div>

        {/* Amenities preview */}
        {rental.amenities && rental.amenities.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {rental.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="px-2 py-0.5 bg-gray-800 text-xs text-gray-400 rounded-md">
                {amenity}
              </span>
            ))}
            {rental.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{rental.amenities.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
