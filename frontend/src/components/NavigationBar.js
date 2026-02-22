import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import logo from '../assets/images/logo.svg';
import { SERVICES_LIST } from '../config/services';

const NavigationBar = ({ transparent = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const servicesTimeoutRef = useRef(null);

  const otherNavLinks = [
    { name: 'Study Destinations', path: '/destinations' },
    { name: 'About Us', path: '/about' },
    { name: 'News & Events', path: '/news' },
    { name: 'Blogs', path: '/blogs' },
  ];

  const navWrapperClass = transparent
    ? 'bg-transparent rounded-full px-4 py-2 flex items-center justify-between'
    : 'bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between shadow-lg';

  const clearServicesTimeout = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
  };

  const handleServicesMouseEnter = () => {
    clearServicesTimeout();
    setServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setServicesOpen(false), 150);
  };

  useEffect(() => () => clearServicesTimeout(), []);

  return (
    <nav className={transparent ? 'absolute top-3 sm:top-4 md:top-6 left-0 right-0 z-20' : 'fixed top-3 sm:top-4 md:top-6 left-0 right-0 z-50 bg-transparent'}>
      <div className="w-full px-2 sm:px-3 md:px-4">
        <div className={navWrapperClass}>
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Edu-Bridge" className="h-8 sm:h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center bg-primary rounded-full px-3 md:px-4 py-1.5 md:py-2 gap-0.5 md:gap-1 h-8 md:h-9">
            {/* Services dropdown */}
            <div
              className="relative h-8 md:h-9 flex items-center"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((o) => !o)}
                className="text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium hover:opacity-90 h-8 md:h-9 flex items-center gap-1"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services
                <FaChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 min-w-[220px] py-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <Link
                      to="/services"
                      onClick={() => setServicesOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
                    >
                      All Services
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    {SERVICES_LIST.map(({ slug, title }) => (
                      <Link
                        key={slug}
                        to={`/services/${slug}`}
                        onClick={() => setServicesOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {otherNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium hover:opacity-90 h-8 md:h-9 flex items-center"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Buttons: Sign Up, Log In */}
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <Link
              to="/signup"
              className="bg-gray-300/90 text-gray-700 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-gray-400/90 h-8 md:h-9 flex items-center"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-primary text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-primary-dark h-8 md:h-9 flex items-center"
            >
              Log In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-xl sm:text-2xl p-1 hover:opacity-80 transition-opacity"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 sm:mt-3 mx-3 sm:mx-4 md:mx-6 bg-secondary rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1 shadow-lg"
          >
            {/* Services expandable */}
            <div>
              <button
                type="button"
                onClick={() => setMobileServicesExpanded((e) => !e)}
                className="w-full flex items-center justify-between text-white text-sm sm:text-base py-2 px-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                Services
                <FaChevronDown className={`w-3 h-3 transition-transform ${mobileServicesExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {mobileServicesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-3 border-l-2 border-white/20 ml-2"
                  >
                    <Link
                      to="/services"
                      onClick={() => { setIsMobileMenuOpen(false); setMobileServicesExpanded(false); }}
                      className="block text-white/90 text-sm py-2 hover:text-white"
                    >
                      All Services
                    </Link>
                    {SERVICES_LIST.map(({ slug, title }) => (
                      <Link
                        key={slug}
                        to={`/services/${slug}`}
                        onClick={() => { setIsMobileMenuOpen(false); setMobileServicesExpanded(false); }}
                        className="block text-white/90 text-sm py-2 hover:text-white"
                      >
                        {title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {otherNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white text-sm sm:text-base py-2 px-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/20 space-y-2">
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block bg-gray-300/90 text-gray-700 text-sm sm:text-base py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-400/90 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block bg-primary text-white text-sm sm:text-base py-2 px-4 rounded-lg text-center font-medium hover:bg-primary-dark transition-colors"
              >
                Log In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavigationBar;
