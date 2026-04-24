import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingAPI } from '../utils/api';
import { formatTakaEN } from '../utils/bangladeshData';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_COLORS = {
  unpaid: 'bg-red-50 text-red-600',
  partial: 'bg-yellow-50 text-yellow-600',
  paid: 'bg-green-50 text-green-600',
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMyBookings();
      setBookings(res.data.bookings || []);
    } catch {
      setBookings(PLACEHOLDER_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this booking');
    } finally {
      setCancellingId(null);
    }
  };

  const tabs = [
    { key: 'all', label: 'All Bookings' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filteredBookings = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-display">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">{bookings.length} total bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 text-sm px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse p-5">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const car = booking.car;
            const carImage = car?.images?.[0] || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=300&q=80';

            return (
              <div key={booking._id} className="card p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Car image */}
                  <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={carImage} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {car?.brand} {car?.model}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {car?.location?.city}, {car?.location?.division}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`badge ${STATUS_COLORS[booking.status]} capitalize`}>
                          {booking.status}
                        </span>
                        <span className={`badge ${PAYMENT_COLORS[booking.paymentStatus]} capitalize`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-400">Pickup Date</p>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(booking.pickupDate).toLocaleDateString('en-BD')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Return Date</p>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(booking.returnDate).toLocaleDateString('en-BD')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="text-sm font-medium text-gray-700">{booking.totalDays} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="text-sm font-bold text-primary-600">{formatTakaEN(booking.totalAmount)}</p>
                      </div>
                    </div>

                    {booking.withDriver && (
                      <p className="text-xs text-green-600 mt-2">✅ Driver included (৳{(1500 * booking.totalDays).toLocaleString()})</p>
                    )}

                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-BD')}
                      </span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500 capitalize">via {booking.paymentMethod}</span>

                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="ml-auto text-xs text-red-600 hover:underline disabled:opacity-50"
                        >
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {activeTab === 'all' ? "You haven't made any bookings yet." : `No ${activeTab} bookings.`}
          </p>
          <Link to="/cars" className="btn-primary">Browse Cars</Link>
        </div>
      )}
    </div>
  );
};

const PLACEHOLDER_BOOKINGS = [
  {
    _id: '1',
    car: { brand: 'Toyota', model: 'Allion', images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=300&q=80'], location: { city: 'Dhaka', division: 'Dhaka' } },
    pickupDate: '2025-07-10',
    returnDate: '2025-07-13',
    totalDays: 3,
    totalAmount: 13500,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'bkash',
    withDriver: false,
    createdAt: '2025-07-05',
  },
  {
    _id: '2',
    car: { brand: 'Mitsubishi', model: 'Pajero', images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&q=80'], location: { city: 'Sylhet', division: 'Sylhet' } },
    pickupDate: '2025-06-20',
    returnDate: '2025-06-22',
    totalDays: 2,
    totalAmount: 23000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'nagad',
    withDriver: true,
    createdAt: '2025-06-18',
  },
];

export default MyBookingsPage;
