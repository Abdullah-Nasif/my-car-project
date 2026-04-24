import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { carAPI } from '../utils/api';
import { DIVISIONS, CATEGORIES, formatTakaEN } from '../utils/bangladeshData';
import CarCard from '../components/CarCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    division: '',
    category: '',
    pickupDate: '',
  });

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const res = await carAPI.getAll({ limit: 6 });
      setFeaturedCars(res.data.cars?.slice(0, 6) || []);
    } catch {
      // Use placeholder data if API not connected
      setFeaturedCars(PLACEHOLDER_CARS);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.division) params.set('division', searchForm.division);
    if (searchForm.category) params.set('category', searchForm.category);
    navigate(`/cars?${params.toString()}`);
  };

  const stats = [
    { label: 'Cars Available', value: '500+', icon: '🚗' },
    { label: 'Cities Covered', value: '64', icon: '📍' },
    { label: 'Happy Renters', value: '10K+', icon: '😊' },
    { label: 'Divisions', value: '8', icon: '🗺️' },
  ];

  const whyUs = [
    { icon: '💳', title: 'Pay via bKash/Nagad', desc: 'Pay easily with all popular mobile banking apps used in Bangladesh.' },
    { icon: '🚘', title: 'Local Fleet', desc: 'Toyota Allion, Pajero, Noah, Probox — cars Bangladeshis love and trust.' },
    { icon: '👨‍✈️', title: 'Optional Driver', desc: 'Hire an experienced local driver for just ৳1,500/day extra.' },
    { icon: '🛡️', title: 'Fully Insured', desc: 'All vehicles are covered with comprehensive insurance for your peace of mind.' },
    { icon: '📞', title: '24/7 Support', desc: 'Bangla & English support available around the clock via call & chat.' },
    { icon: '🏙️', title: 'All 8 Divisions', desc: 'From Dhaka to Cox\'s Bazar, rent anywhere in Bangladesh.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Bangladesh flag stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-700 via-red-500 to-green-700"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary-500 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-green-500 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <span>🇧🇩</span>
                <span>Bangladesh's Trusted Car Rental Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 font-display">
                Rent the Perfect Car <br />
                <span className="text-primary-400">Across Bangladesh</span>
              </h1>
              <p className="text-gray-300 text-xl mb-10 leading-relaxed">
                Choose from Toyota Allion, Pajero, Noah, Probox & more. Pay in <span className="text-white font-semibold">Taka</span> via bKash, Nagad, or cash. Available in all 8 divisions.
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-gray-800 font-bold text-lg mb-4 font-display">Find Your Ride</h2>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Division</label>
                  <select
                    className="input-field text-sm"
                    value={searchForm.division}
                    onChange={e => setSearchForm({ ...searchForm, division: e.target.value })}
                  >
                    <option value="">All Divisions</option>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Car Type</label>
                  <select
                    className="input-field text-sm"
                    value={searchForm.category}
                    onChange={e => setSearchForm({ ...searchForm, category: e.target.value })}
                  >
                    <option value="">All Types</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Pickup Date</label>
                  <input
                    type="date"
                    className="input-field text-sm"
                    value={searchForm.pickupDate}
                    onChange={e => setSearchForm({ ...searchForm, pickupDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="btn-primary w-full text-base">
                    🔍 Search Available Cars
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-bold font-display">{stat.value}</div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-display">Browse by Type</h2>
            <p className="text-gray-500 mt-1">Find the perfect car for your journey</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/cars?category=${cat.value}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-600 group-hover:text-primary-600">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-display">Featured Cars</h2>
            <p className="text-gray-500 mt-1">Handpicked popular cars across Bangladesh</p>
          </div>
          <Link to="/cars" className="btn-secondary text-sm py-2 px-4">
            View All Cars
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">🚗</div>
            <p className="text-lg">No cars listed yet. Be the first to list your car!</p>
            <Link to="/register" className="btn-primary mt-4 inline-block">Register as Owner</Link>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-display">Why DriveEasy Bangladesh?</h2>
            <p className="text-gray-500 mt-2">Built for Bangladesh, by Bangladeshis</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-display">How It Works</h2>
          <p className="text-gray-500 mt-2">Rent a car in 3 easy steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', icon: '🔍', title: 'Search & Choose', desc: 'Browse cars by division, type, price, and dates. Filter by bKash/Nagad payment options.' },
            { step: '02', icon: '📝', title: 'Book & Pay', desc: 'Book instantly and pay via bKash, Nagad, Rocket, card, or cash. No hidden charges.' },
            { step: '03', icon: '🚗', title: 'Ride & Enjoy', desc: 'Pick up your car or get it delivered. Optional driver available for ৳1,500/day.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <div className="text-xs font-bold text-primary-600 mb-2">STEP {item.step}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-bangladesh-green to-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4 font-display">Own a Car? List It & Earn Taka!</h2>
          <p className="text-green-100 text-lg mb-8">
            Turn your idle car into income. Register as an owner and start earning from ৳3,000/day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-green-700 font-bold py-3 px-8 rounded-xl hover:bg-green-50 transition-colors">
              Register as Car Owner
            </Link>
            <Link to="/cars" className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors">
              Browse Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Placeholder data for when backend is not connected
const PLACEHOLDER_CARS = [
  { _id: '1', brand: 'Toyota', model: 'Allion', year: 2019, category: 'sedan', pricePerDay: 4500, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 4.5, location: { city: 'Dhaka', division: 'Dhaka' }, images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80'] },
  { _id: '2', brand: 'Mitsubishi', model: 'Pajero', year: 2018, category: 'suv', pricePerDay: 10000, transmission: 'automatic', fuelType: 'diesel', seats: 7, ac: true, isAvailable: true, rating: 4.8, location: { city: 'Chittagong', division: 'Chittagong' }, images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80'] },
  { _id: '3', brand: 'Toyota', model: 'Noah', year: 2020, category: 'microbus', pricePerDay: 7000, transmission: 'automatic', fuelType: 'hybrid', seats: 8, ac: true, isAvailable: true, rating: 4.6, location: { city: 'Sylhet', division: 'Sylhet' }, images: ['https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=600&q=80'] },
  { _id: '4', brand: 'Toyota', model: 'Vitz', year: 2021, category: 'hatchback', pricePerDay: 2800, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 4.3, location: { city: 'Rajshahi', division: 'Rajshahi' }, images: ['https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=600&q=80'] },
  { _id: '5', brand: 'Toyota', model: 'Hilux', year: 2022, category: 'pickup', pricePerDay: 6000, transmission: 'manual', fuelType: 'diesel', seats: 5, ac: true, isAvailable: true, rating: 4.4, location: { city: 'Khulna', division: 'Khulna' }, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'] },
  { _id: '6', brand: 'Mercedes-Benz', model: 'E-Class', year: 2021, category: 'luxury', pricePerDay: 20000, transmission: 'automatic', fuelType: 'petrol', seats: 5, ac: true, isAvailable: true, rating: 5.0, location: { city: 'Dhaka', division: 'Dhaka' }, images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80'] },
];

export default HomePage;
