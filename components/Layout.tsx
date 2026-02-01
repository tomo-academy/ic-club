
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Menu, X, ShoppingCart, User as UserIcon, LogOut, ChevronDown, Package, Settings, CreditCard, LayoutDashboard } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, cart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthPage = location.pathname === '/' || location.pathname === '/admin-login';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthPage && !user) {
    return <div className="min-h-screen bg-background text-primary">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-primary transition-colors duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(user?.role === UserRole.ADMIN ? '/admin' : '/dashboard')}>
              <img src="/RUIDcee55086d8ef460fb5d9a0ab8b20405b.png" alt="IC Club Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-primary">IC Club</span>
                <span className="text-xs text-secondary font-medium tracking-wider uppercase">by Sona</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {user?.role === UserRole.USER && (
                <>
                  <Link to="/dashboard" className={`font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}>Dashboard</Link>
                  <Link to="/hardware" className={`font-medium transition-colors ${location.pathname === '/hardware' || location.pathname.startsWith('/hardware/') ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}>Hardware</Link>
                  <Link to="/community" className={`font-medium transition-colors ${location.pathname === '/community' ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}>Community</Link>
                  <Link to="/problem-statements" className={`font-medium transition-colors ${location.pathname === '/problem-statements' ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}>Problems</Link>
                </>
              )}
              {user?.role === UserRole.ADMIN && (
                <Link to="/admin" className="text-secondary hover:text-primary font-medium transition-colors">Admin Panel</Link>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {user && user.role === UserRole.USER && (
                <div className="relative group">
                  <Link to="/cart" className="p-2.5 rounded-full hover:bg-gray-100 text-secondary hover:text-primary transition-all relative block">
                    <ShoppingCart size={22} />
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 h-5 w-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface transform -translate-y-1 translate-x-1">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-3 p-1.5 pl-4 pr-2 rounded-full border transition-all shadow-sm ${isProfileOpen ? 'border-primary bg-gray-50' : 'border-gray-200 bg-surface hover:border-gray-300'}`}
                  >
                    <span className="text-sm font-bold text-primary hidden sm:block">{user.name.split(' ')[0]}</span>
                    
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-md" />
                    ) : (
                      <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {user.name.charAt(0)}
                      </div>
                    )}

                    <ChevronDown size={14} className={`text-secondary transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-surface border border-gray-100 rounded-3xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden ring-1 ring-black ring-opacity-5">
                      {/* Dropdown Header */}
                      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-4">
                           {user.avatar ? (
                              <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
                           ) : (
                              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                                {user.name.charAt(0)}
                              </div>
                           )}
                           <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-primary truncate">{user.name}</p>
                              <p className="text-xs text-secondary truncate font-medium">{user.email}</p>
                           </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-1">
                        {user.role === UserRole.USER && (
                          <>
                             <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-secondary rounded-xl hover:text-primary hover:bg-gray-50 transition-colors">
                                <LayoutDashboard size={18} />
                                Dashboard
                             </Link>
                             <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-secondary rounded-xl hover:text-primary hover:bg-gray-50 transition-colors">
                                <UserIcon size={18} />
                                User Information
                             </Link>
                             <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-secondary rounded-xl hover:text-primary hover:bg-gray-50 transition-colors">
                                <Package size={18} />
                                My Orders
                             </Link>
                          </>
                        )}
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex gap-3">
                  <Link to="/" className="text-secondary hover:text-primary text-sm font-medium px-4 py-2">Login</Link>
                  <Link to="/" className="bg-primary hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-lg shadow-gray-200">
                    Join Now
                  </Link>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button className="md:hidden text-secondary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-gray-100 px-4 py-6 space-y-4 shadow-xl absolute w-full z-40">
             {user?.role === UserRole.USER && (
                <div className="flex flex-col gap-2">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl bg-gray-50 text-primary font-bold">Dashboard</Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-secondary font-medium">My Profile</Link>
                  <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-secondary font-medium">My Orders</Link>
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-secondary font-medium">My Cart</Link>
                  <Link to="/hardware" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-secondary font-medium">Hardware Catalog</Link>
                  <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-secondary font-medium">Community Feed</Link>
                  <Link to="/problem-statements" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-secondary font-medium">Problem Statements</Link>
                </div>
              )}
             {!user && (
                <div className="flex flex-col gap-4">
                   <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-primary font-medium">Login</Link>
                </div>
             )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 pt-16 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">IC</div>
                <span className="text-lg font-bold text-primary">IC Club</span>
              </div>
              <p className="text-secondary text-sm max-w-xs leading-relaxed">
                Empowering Young Innovators at Sona College of Technology to build, create, and innovate.
              </p>
            </div>
            <div>
              <h3 className="text-primary font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3 text-sm text-secondary">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-primary font-bold mb-6">Contact</h3>
              <p className="text-secondary text-sm mb-2">Sona College of Technology</p>
              <p className="text-secondary text-sm">Salem, Tamil Nadu</p>
              <p className="text-secondary text-sm mt-3 font-medium text-primary">support@icclub.sona.edu</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary/60 text-xs">© {new Date().getFullYear()} IC Club Sona. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
