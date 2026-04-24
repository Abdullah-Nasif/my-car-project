import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { carAPI, bookingAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatTakaEN, PAYMENT_METHODS, DIVISIONS, CITIES_BY_DIVISION } from '../utils/bangladeshData';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    pickupDate: '',
    returnDate: '',
    pickupDivision: '',
    pickupCity: '',
    withDriver: false,
    paymentMethod: 'bkash',
    specialRequests: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await carAPI.getById(id);
      setCar(res.data.car);
    } catch {
      // Placeholder car
      setCar(PLACEHOLDER_CAR);
    } finally {
      setLoading(false);
    }
  };

  const totalDays = () => {
    if (!booking.pickupDate || !booking.returnDate) return 0;
    const diff = (new Date(booking.returnDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(diff));
  };

  const totalAmount = () => {
    const days = totalDays();
    const carCost = days * (car?.pricePerDay || 0);
    const driverCost = booking.withDriver ? days * 1500 : 0;
    return carCost + driverCost;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a car');
      navigate('/login');
      return;
    }
    if (totalDays() < 1) {
      toast.error('Please select valid pickup and return dates');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingAPI.create({
        carId: car._id,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        pickupLocation: {
          city: booking.pickupCity || car.location?.city,
          division: booking.pickupDivision || car.location?.division,
        },
        withDriver: booking.withDriver,
        paymentMethod: booking.paymentMethod,
        specialRequests: booking.specialRequests,
      });
      toast.success('🎉 Booking confirmed! Check My Bookings for details.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/3"></div>
      </div>
    );
  }

  if (!car) return <div className="text-center py-20 text-gray-500">Car not found</div>;

  const images = car.images?.length > 0 ? car.images : [
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Car details */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="relative rounded-2xl overflow-hidden mb-4 h-80 md:h-[420px] bg-gray-100">
            <img
              src={images[activeImage]}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80'; }}
            />
            {!car.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg">Currently Unavailable</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mb-6">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-80'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Car info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="badge bg-primary-100 text-primary-700 capitalize mb-2">{car.category}</span>
                <h1 className="text-3xl font-bold text-gray-900 font-display">{car.brand} {car.model}</h1>
                <p className="text-gray-500 mt-1">
                  {car.year} • {car.location?.city}, {car.location?.district}, {car.location?.division} Division
                </p>
              </div>
              <div className="text-right">
                {car.rating > 0 && (
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl mb-2">
                    <span className="text-amber-500">★</span>
                    <span className="font-bold text-amber-700">{car.rating?.toFixed(1)}</span>
                    <span className="text-xs text-amber-600">({car.totalRatings} reviews)</span>
                  </div>
                )}
                <div className="text-3xl font-bold text-primary-600">{formatTakaEN(car.pricePerDay)}</div>
                <div className="text-gray-400 text-sm">per day</div>
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100 mb-4">
              {[
                { label: 'Seats', value: `${car.seats} persons`, icon: '👤' },
                { label: 'Transmission', value: car.transmission, icon: '⚙️' },
                { label: 'Fuel', value: car.fuelType, icon: '⛽' },
                { label: 'AC', value: car.ac ? 'Yes' : 'No', icon: '❄️' },
              ].map(spec => (
                <div key={spec.label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-xl mb-1">{spec.icon}</div>
                  <div className="text-xs text-gray-500">{spec.label}</div>
                  <div className="text-sm font-semibold text-gray-700 capitalize">{spec.value}</div>
                </div>
              ))}
            </div>

            {car.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{car.description}</p>
            )}

            {car.features?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Features & Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((f, i) => (
                    <span key={i} className="badge bg-gray-100 text-gray-700">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Owner info */}
          {car.owner && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-3">Car Owner</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{car.owner.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{car.owner.name}</p>
                  <p className="text-sm text-gray-500">{car.owner.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-5 font-display">Book This Car</h2>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pickup Date</label>
                <input
                  type="date"
                  className="input-field text-sm"
                  value={booking.pickupDate}
                  onChange={e => setBooking({ ...booking, pickupDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Return Date</label>
                <input
                  type="date"
                  className="input-field text-sm"
                  value={booking.returnDate}
                  onChange={e => setBooking({ ...booking, returnDate: e.target.value })}
                  min={booking.pickupDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pickup Division</label>
                <select
                  className="input-field text-sm"
                  value={booking.pickupDivision}
                  onChange={e => setBooking({ ...booking, pickupDivision: e.target.value, pickupCity: '' })}
                >
                  <option value="">Same as car location ({car.location?.division})</option>
                  {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {booking.pickupDivision && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Pickup City</label>
                  <select
                    className="input-field text-sm"
                    value={booking.pickupCity}
                    onChange={e => setBooking({ ...booking, pickupCity: e.target.value })}
                  >
                    <option value="">Select city</option>
                    {(CITIES_BY_DIVISION[booking.pickupDivision] || []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Payment method */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(pm => (
                    <button
                      key={pm.value}
                      type="button"
                      onClick={() => setBooking({ ...booking, paymentMethod: pm.value })}
                      className={`text-xs py-2 px-2 rounded-lg border transition-all text-left ${
                        booking.paymentMethod === pm.value
                          ? 'border-primary-400 bg-primary-50 text-primary-700 font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Driver option */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                <div>
                  <p className="text-sm font-semibold text-green-800">Add Driver</p>
                  <p className="text-xs text-green-600">৳1,500/day extra</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={booking.withDriver}
                    onChange={e => setBooking({ ...booking, withDriver: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Special requests */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Special Requests (optional)</label>
                <textarea
                  className="input-field text-sm resize-none"
                  rows={2}
                  placeholder="Any special requirements..."
                  value={booking.specialRequests}
                  onChange={e => setBooking({ ...booking, specialRequests: e.target.value })}
                />
              </div>

              {/* Price breakdown */}
              {totalDays() > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTakaEN(car.pricePerDay)} × {totalDays()} days</span>
                    <span>{formatTakaEN(car.pricePerDay * totalDays())}</span>
                  </div>
                  {booking.withDriver && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Driver (৳1,500 × {totalDays()} days)</span>
                      <span>{formatTakaEN(1500 * totalDays())}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary-600 text-lg">{formatTakaEN(totalAmount())}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading || !car.isAvailable}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Processing...' : car.isAvailable ? '✅ Confirm Booking' : 'Not Available'}
              </button>

              {!user && (
                <p className="text-xs text-gray-500 text-center">
                  <a href="/login" className="text-primary-600 hover:underline">Login</a> to book this car
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const PLACEHOLDER_CAR = {
  _id: 'demo',
  brand: 'Toyota',
  model: 'Allion',
  year: 2020,
  category: 'sedan',
  pricePerDay: 4500,
  transmission: 'automatic',
  fuelType: 'petrol',
  seats: 5,
  ac: true,
  isAvailable: true,
  rating: 4.5,
  totalRatings: 23,
  description: 'A well-maintained Toyota Allion perfect for city and highway travel across Bangladesh. Comfortable, fuel-efficient, and spacious for 5 passengers.',
  features: ['GPS Navigation', 'Bluetooth Audio', 'Backup Camera', 'USB Charging', 'First Aid Kit'],
  location: { city: 'Dhaka', district: 'Dhaka', division: 'Dhaka' },
  owner: { name: 'Mohammed Rahman', phone: '+880 1711-000000' },
  images: [
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
  ],
};

export default CarDetailPage;
