import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold font-display">D</span>
              </div>
              <div>
                <div className="text-white font-bold font-display text-lg">DriveEasy</div>
                <div className="text-xs text-gray-500">Bangladesh</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Bangladesh's trusted car rental platform. Comfortable, affordable, and reliable travel across all 8 divisions.
            </p>
            <div className="flex gap-2 mt-4">
              <div className="w-4 h-6 rounded-sm" style={{ background: '#006a4e' }}></div>
              <div className="w-3 h-6 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full" style={{ background: '#f42a41' }}></div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/cars" className="hover:text-primary-400 transition-colors">Browse Cars</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register as Owner</Link></li>
              <li><Link to="/my-bookings" className="hover:text-primary-400 transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* Available Cities */}
          <div>
            <h4 className="text-white font-semibold mb-4">Available In</h4>
            <ul className="space-y-2 text-sm">
              <li>Dhaka Division</li>
              <li>Chittagong Division</li>
              <li>Sylhet Division</li>
              <li>Rajshahi Division</li>
              <li>Khulna Division</li>
              <li>+ 3 more divisions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>info@driveeasy.com.bd</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-600 mb-2">Payment Methods:</p>
              <div className="flex flex-wrap gap-2">
                {['bKash', 'Nagad', 'Rocket', 'Card'].map(m => (
                  <span key={m} className="text-xs bg-gray-800 px-2 py-1 rounded">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© 2025 DriveEasy Bangladesh. All rights reserved.</p>
          <p>Made with ❤️ for Bangladesh 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
