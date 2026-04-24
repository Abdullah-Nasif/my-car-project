import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carAPI } from '../utils/api';
import { DIVISIONS, CATEGORIES } from '../utils/bangladeshData';
import CarCard from '../components/CarCard';

const PLACEHOLDER_CARS = [
  { _id: '1', brand: 'Toyota', model: 'Allion', year: 2019, category: 'sedan', pricePerDay: 4500, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 4.5, location: { city: 'Dhaka', division: 'Dhaka' }, images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80'] },
  { _id: '2', brand: 'Mitsubishi', model: 'Pajero', year: 2018, category: 'suv', pricePerDay: 10000, transmission: 'automatic', fuelType: 'diesel', seats: 7, ac: true, isAvailable: true, rating: 4.8, location: { city: 'Chittagong', division: 'Chittagong' }, images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80'] },
  { _id: '3', brand: 'Toyota', model: 'Noah', year: 2020, category: 'microbus', pricePerDay: 7000, transmission: 'automatic', fuelType: 'hybrid', seats: 8, ac: true, isAvailable: true, rating: 4.6, location: { city: 'Sylhet', division: 'Sylhet' }, images: ['https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=600&q=80'] },
  { _id: '4', brand: 'Toyota', model: 'Vitz', year: 2021, category: 'hatchback', pricePerDay: 2800, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 4.3, location: { city: 'Rajshahi', division: 'Rajshahi' }, images: ['https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=600&q=80'] },
  { _id: '5', brand: 'Toyota', model: 'Hilux', year: 2022, category: 'pickup', pricePerDay: 6000, transmission: 'manual', fuelType: 'diesel', seats: 5, ac: true, isAvailable: true, rating: 4.4, location: { city: 'Khulna', division: 'Khulna' }, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'] },
  { _id: '6', brand: 'Mercedes-Benz', model: 'E-Class', year: 2021, category: 'luxury', pricePerDay: 20000, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 5.0, location: { city: 'Dhaka', division: 'Dhaka' }, images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80'] },
  { _id: '7', brand: 'Toyota', model: 'Premio', year: 2020, category: 'sedan', pricePerDay: 5000, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 4.7, location: { city: 'Dhaka', division: 'Dhaka' }, images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80'] },
  { _id: '8', brand: 'Toyota', model: 'Probox', year: 2018, category: 'sedan', pricePerDay: 3000, transmission: 'manual', fuelType: 'cng', seats: 5, ac: true, isAvailable: true, rating: 4.1, location: { city: 'Mymensingh', division: 'Mymensingh' }, images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80'] },
  { _id: '9', brand: 'Honda', model: 'CR-V', year: 2022, category: 'suv', pricePerDay: 9500, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 4.9, location: { city: 'Dhaka', division: 'Dhaka' }, images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80'] },
];

const CarsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    division: searchParams.get('division') || '',
    category: searchParams.get('category') || '',
    transmission: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await carAPI.getAll(params);
      setCars(res.data.cars || []);
    } catch {
      // Use placeholder if backend not connected
      let filtered = PLACEHOLDER_CARS;
      if (filters.division) filtered = filtered.filter(c => c.location.division === filters.division);
      if (filters.category) filtered = filtered.filter(c => c.category === filters.category);
      if (filters.minPrice) filtered = filtered.filter(c => c.pricePerDay >= parseInt(filters.minPrice));
      if (filters.maxPrice) filtered = filtered.filter(c => c.pricePerDay <= parseInt(filters.maxPrice));
      setCars(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ division: '', category: '', transmission: '', fuelType: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Available Cars</h1>
          <p className="text-gray-500 text-sm mt-1">{cars.length} cars found across Bangladesh</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary text-sm py-2 px-4"
        >
          🔧 Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className={`w-full md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Filters</h2>
              <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Clear all</button>
            </div>

            {/* Division */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Division</label>
              <select
                className="input-field text-sm"
                value={filters.division}
                onChange={e => handleFilterChange('division', e.target.value)}
              >
                <option value="">All Divisions</option>
                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Car Type</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => handleFilterChange('category', filters.category === cat.value ? '' : cat.value)}
                    className={`text-xs py-2 px-2 rounded-lg border transition-all ${
                      filters.category === cat.value
                        ? 'bg-primary-100 border-primary-400 text-primary-700 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Transmission</label>
              <select className="input-field text-sm" value={filters.transmission} onChange={e => handleFilterChange('transmission', e.target.value)}>
                <option value="">Any</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Fuel Type</label>
              <select className="input-field text-sm" value={filters.fuelType} onChange={e => handleFilterChange('fuelType', e.target.value)}>
                <option value="">Any</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Price Range in Taka */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Price per Day (৳ Taka)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ৳"
                  className="input-field text-sm"
                  value={filters.minPrice}
                  onChange={e => handleFilterChange('minPrice', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max ৳"
                  className="input-field text-sm"
                  value={filters.maxPrice}
                  onChange={e => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>৳2,000</span>
                <span>৳25,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Cars Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-52 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {cars.map(car => <CarCard key={car._id} car={car} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No cars found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
