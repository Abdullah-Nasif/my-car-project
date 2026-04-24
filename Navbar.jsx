import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Browse Cars' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold font-display">D</span>
            </div>
            <div>
              <span className="font-display font-bold text-gray-900 text-lg leading-none">DriveEasy</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 rounded-sm" style={{ background: '#006a4e' }}></div>
                <div className="w-2 h-1.5 rounded-full" style={{ background: '#f42a41' }}></div>
                <span className="text-xs text-gray-500 font-medium">Bangladesh</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="badge bg-primary-100 text-primary-700 mt-1">{user.role}</span>
                    </div>
                    <Link to="/my-bookings" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600" onClick={() => setDropdownOpen(false)}>
                      My Bookings
                    </Link>
                    {(user.role === 'owner' || user.role === 'admin') && (
                      <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600" onClick={() => setDropdownOpen(false)}>
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'owner' && (
                      <Link to="/dashboard/add-car" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600" onClick={() => setDropdownOpen(false)}>
                        Add Car
                      </Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="block py-2.5 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/my-bookings" className="block py-2.5 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>My Bookings</Link>
              {(user.role === 'owner' || user.role === 'admin') && (
                <Link to="/dashboard" className="block py-2.5 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left py-2.5 text-sm text-red-600">Logout</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary text-sm py-2 flex-1 text-center" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 flex-1 text-center" onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
