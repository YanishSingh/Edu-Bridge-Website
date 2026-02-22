import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { adminApi, setAdminToken } from '../utils/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sanitizeInput = (value, maxLength = 1000) => {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminApi.login({
        email: sanitizeInput(email, 255).toLowerCase(),
        password: sanitizeInput(password, 200),
      });
      setAdminToken(data.token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FaShieldAlt className="text-secondary text-xl sm:text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Portal</h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base px-2">Edu-Bridge administration panel</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-100/50 p-5 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-5 md:space-y-6"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm flex items-start gap-2 sm:gap-3"
            >
              <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
              <span className="break-words">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-xs sm:text-sm" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/[<>]/g, '').slice(0, 255).toLowerCase();
                    setEmail(sanitized);
                  }}
                  placeholder="admin@edubridge.com"
                  maxLength={255}
                  required
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-xs sm:text-sm" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const sanitized = e.target.value.slice(0, 200);
                    setPassword(sanitized);
                  }}
                  placeholder="Enter your password"
                  maxLength={200}
                  required
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-secondary to-secondary-dark text-white text-sm sm:text-base font-semibold shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Log in</span>
                <FaArrowRight className="text-xs sm:text-sm" />
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
