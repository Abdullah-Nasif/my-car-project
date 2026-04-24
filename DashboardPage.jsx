import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminAPI, carAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatTakaEN } from '../utils/bangladeshData';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'admin') {
        const [statsRes, bookingsRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getAllBookings(),
        ]);
        setStats(statsRes.data.stats);
        setBookings(bookingsRes.data.bookings || []);
      } else {
        const [bookingsRes, carsRes] = await Promise.all([
          adminAPI.getOwnerBookings(),
          carAPI.getMyCars(),
        ]);
        setBookings(bookingsRes.data.bookings || []);
        setCars(carsRes.data.cars || []);

        // Compute stats from data
        const totalRevenue = bookingsRes.data.bookings
          ?.filter(b => ['completed', 'active'].includes(b.status))
          .reduce((sum, b) => sum + b.totalAmount, 0) || 0;
        setStats({
          totalCars: carsRes.data.cars?.length || 0,
          totalBookings: bookingsRes.data.bookings?.length || 0,
          totalRevenue,
          activeBookings: bookingsRes.data.bookings?.filter(b => b.status === 'active').length || 0,
        });
      }
    } catch {
      // Placeholder stats
      setStats(PLACEHOLDER_STATS);
      setBookings(PLACEHOLDER_BOOKINGS);
      setCars(PLACEHOLDER_CARS_LIST);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await adminAPI.updateBooking(id, { status });
      toast.success('Booking status updated!');
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteCar = async (id) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await carAPI.delete(id);
      toast.success('Car deleted successfully');
      fetchData();
    } catch {
      toast.error('Failed to delete car');
    }
  };

  const statCards = stats ? [
    user?.role === 'admin'
      ? { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'bg-blue-50 text-blue-700' }
      : { label: 'My Cars', value: stats.totalCars || 0, icon: '🚗', color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Bookings', value: stats.totalBookings || 0, icon: '📋', color: 'bg-orange-50 text-orange-700' },
    { label: 'Active Now', value: stats.activeBookings || 0, icon: '🟢', color: 'bg-green-50 text-green-700' },
    { label: 'Total Revenue', value: formatTakaEN(stats.totalRevenue || 0), icon: '💰', color: 'bg-primary-50 text-primary-700' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Owner Dashboard'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}!</p>
        </div>
        {user?.role === 'owner' && (
          <Link to="/dashboard/add-car" className="btn-primary text-sm py-2 px-4">
            + Add New Car
          </Link>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className={`rounded-2xl p-5 ${card.color}`}>
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="text-2xl font-bold font-display">{card.value}</div>
              <div className="text-sm opacity-80 mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'overview', label: 'Bookings' },
          ...(user?.role === 'owner' ? [{ key: 'cars', label: 'My Cars' }] : []),
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === tab.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">
              {user?.role === 'admin' ? 'All Bookings' : 'Bookings for My Cars'}
            </h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading bookings...</div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Customer</th>
                    <th className="px-5 py-3 text-left">Car</th>
                    <th className="px-5 py-3 text-left">Dates</th>
                    <th className="px-5 py-3 text-left">Amount</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    {user?.role === 'admin' && <th className="px-5 py-3 text-left">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{b.user?.name}</p>
                          <p className="text-xs text-gray-400">{b.user?.phone}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {b.car?.images?.[0] && (
                            <img src={b.car.images[0]} alt="" className="w-10 h-8 rounded-lg object-cover" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-800">{b.car?.brand} {b.car?.model}</p>
                            <p className="text-xs text-gray-400">{b.totalDays} days</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        <div>{new Date(b.pickupDate).toLocaleDateString('en-BD')}</div>
                        <div className="text-gray-400">→ {new Date(b.returnDate).toLocaleDateString('en-BD')}</div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-primary-600">{formatTakaEN(b.totalAmount)}</p>
                        <p className="text-xs text-gray-400 capitalize">{b.paymentMethod}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${STATUS_COLORS[b.status]} capitalize`}>{b.status}</span>
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-5 py-4">
                          <select
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                            value={b.status}
                            onChange={e => updateBookingStatus(b._id, e.target.value)}
                          >
                            {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">📋</div>
              <p>No bookings yet</p>
            </div>
          )}
        </div>
      )}

      {/* Cars Tab */}
      {activeTab === 'cars' && user?.role === 'owner' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">My Listed Cars</h2>
            <Link to="/dashboard/add-car" className="btn-primary text-sm py-1.5 px-4">+ Add Car</Link>
          </div>
          {cars.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {cars.map(car => (
                <div key={car._id} className="flex items-center gap-4 p-5">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={car.images?.[0] || 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=200'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{car.brand} {car.model} ({car.year})</h3>
                    <p className="text-xs text-gray-500">{car.location?.city}, {car.location?.division} • {car.category}</p>
                    <p className="text-sm font-bold text-primary-600 mt-1">{formatTakaEN(car.pricePerDay)}/day</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${car.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <Link to={`/dashboard/edit-car/${car._id}`} className="text-xs text-primary-600 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCar(car._id)}
                      className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">🚗</div>
              <p className="mb-4">No cars listed yet</p>
              <Link to="/dashboard/add-car" className="btn-primary text-sm">Add Your First Car</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PLACEHOLDER_STATS = {
  totalCars: 5, totalBookings: 23, activeBookings: 3, totalRevenue: 245000, totalUsers: 150
};
const PLACEHOLDER_BOOKINGS = [];
const PLACEHOLDER_CARS_LIST = [];

export default DashboardPage;
