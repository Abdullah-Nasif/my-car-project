import { Link } from 'react-router-dom';
import { formatTakaEN } from '../utils/bangladeshData';

const CarCard = ({ car }) => {
  const mainImage = car.images?.[0] || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80';

  return (
    <Link to={`/cars/${car._id}`} className="car-card card block group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={`${car.brand} ${car.model}`}
          className="car-image w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80'; }}
        />
        <div className="absolute top-3 left-3">
          <span className="badge bg-white text-gray-700 shadow-sm capitalize text-xs">
            {car.category}
          </span>
        </div>
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge bg-red-500 text-white text-sm">Not Available</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1 shadow-sm">
          <span className="text-sm font-bold text-primary-600">{formatTakaEN(car.pricePerDay)}</span>
          <span className="text-xs text-gray-500">/day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900 text-base group-hover:text-primary-600 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{car.year} • {car.location?.city}, {car.location?.division}</p>
          </div>
          {car.rating > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <span className="text-amber-500 text-xs">★</span>
              <span className="text-xs font-semibold text-amber-700">{car.rating?.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <span>👤</span> {car.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <span>⚙️</span> {car.transmission}
          </span>
          <span className="flex items-center gap-1">
            <span>⛽</span> {car.fuelType}
          </span>
          {car.ac && (
            <span className="flex items-center gap-1">
              <span>❄️</span> AC
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
