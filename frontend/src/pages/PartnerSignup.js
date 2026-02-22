import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLock, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { partnerApi } from '../utils/api';

const initialAddress = {
  country: 'Nepal',
  stateProvince: '',
  cityDistrict: '',
  areaLocalLevel: '',
  wardNumber: '',
  street: '',
};

const initialForm = {
  institutionName: '',
  address: { ...initialAddress },
  phoneNumber: '',
  mobileNumber: '',
  email: '',
  password: '',
};

export default function PartnerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sanitizeInput = (value, maxLength = 1000) => {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const maxLengths = {
      institutionName: 200,
      'address.country': 100,
      'address.stateProvince': 100,
      'address.cityDistrict': 100,
      'address.areaLocalLevel': 100,
      'address.wardNumber': 10,
      'address.street': 200,
      phoneNumber: 20,
      mobileNumber: 20,
      email: 255,
      password: 200,
    };
    const maxLen = maxLengths[name] || 1000;
    const sanitizedValue = sanitizeInput(value, maxLen);
    
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: sanitizedValue },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await partnerApi.signup(form);
      setSuccess(true);
    } catch (err) {
      const msg = err.message || 'Signup failed. Please try again.';
      const list = err.errors || [];
      const byField = {};
      list.forEach((e) => {
        const field = Array.isArray(e.path) ? e.path.join('.') : (e.param || e.path || e.field);
        if (field) byField[field] = e.msg || e.message;
      });
      if (Object.keys(byField).length === 0) byField._form = msg;
      setErrors(byField);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-100/50 p-6 sm:p-8 md:p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <FaCheckCircle className="text-green-600 text-2xl sm:text-3xl" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Application Received</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed px-2">
            Your partner signup is pending admin approval. You will receive an email once your application is approved or if it is rejected.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-primary text-white text-sm sm:text-base font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
          >
            Go to Login
            <FaArrowRight className="text-xs sm:text-sm" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Partner Registration</h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base px-2">Register your consultancy. Admin approval required to access the vault.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-100/50 p-4 sm:p-6 md:p-8 lg:p-10"
        >
          {errors._form && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
              <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
              <span className="break-words">{errors._form}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400 text-xs sm:text-sm" />
                  </div>
                  <input
                    type="text"
                    name="institutionName"
                    value={form.institutionName}
                    onChange={handleChange}
                    placeholder="Your institution name"
                    maxLength={200}
                    className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors.institutionName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                  />
                </div>
                {errors.institutionName && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 ml-1 break-words">{errors.institutionName}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <FaMapMarkerAlt className="inline mr-1.5 sm:mr-2 text-gray-500 text-xs sm:text-sm" />
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2">Country</span>
                    <input
                      type="text"
                      name="address.country"
                      value={form.address.country}
                      onChange={handleChange}
                      maxLength={100}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2">State/Province</span>
                    <input
                      type="text"
                      name="address.stateProvince"
                      value={form.address.stateProvince}
                      onChange={handleChange}
                      placeholder="State/Province"
                      maxLength={100}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors['address.stateProvince'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                    />
                    {errors['address.stateProvince'] && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 break-words">{errors['address.stateProvince']}</p>}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2">City/District</span>
                    <input
                      type="text"
                      name="address.cityDistrict"
                      value={form.address.cityDistrict}
                      onChange={handleChange}
                      placeholder="City/District"
                      maxLength={100}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors['address.cityDistrict'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                    />
                    {errors['address.cityDistrict'] && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 break-words">{errors['address.cityDistrict']}</p>}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2">Area/Local Level</span>
                    <input
                      type="text"
                      name="address.areaLocalLevel"
                      value={form.address.areaLocalLevel}
                      onChange={handleChange}
                      placeholder="Area/Local Level"
                      maxLength={100}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors['address.areaLocalLevel'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                    />
                    {errors['address.areaLocalLevel'] && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 break-words">{errors['address.areaLocalLevel']}</p>}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2">Ward Number</span>
                    <input
                      type="text"
                      name="address.wardNumber"
                      value={form.address.wardNumber}
                      onChange={handleChange}
                      placeholder="Ward Number"
                      maxLength={10}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors['address.wardNumber'] ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                    />
                    {errors['address.wardNumber'] && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 break-words">{errors['address.wardNumber']}</p>}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2">Street (optional)</span>
                    <input
                      type="text"
                      name="address.street"
                      value={form.address.street}
                      onChange={handleChange}
                      placeholder="Street"
                      maxLength={200}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    <FaPhone className="inline mr-1.5 sm:mr-2 text-gray-500 text-xs sm:text-sm" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Landline"
                    maxLength={20}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors.phoneNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 ml-1 break-words">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="Mobile"
                    maxLength={20}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors.mobileNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 ml-1 break-words">{errors.mobileNumber}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <FaEnvelope className="inline mr-1.5 sm:mr-2 text-gray-500 text-xs sm:text-sm" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 text-xs sm:text-sm" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@institution.com"
                    maxLength={255}
                    className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 ml-1 break-words">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <FaLock className="inline mr-1.5 sm:mr-2 text-gray-500 text-xs sm:text-sm" />
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-xs sm:text-sm" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    maxLength={200}
                    className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-200'}`}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 sm:mt-1.5 ml-1 break-words">{errors.password}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm">Submit Application</span>
                    <FaArrowRight className="text-xs sm:text-sm" />
                  </>
                )}
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-gray-600 text-xs sm:text-sm mt-4 sm:mt-6 px-2"
              >
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1">
                  Log in
                  <FaArrowRight className="text-xs" />
                </Link>
              </motion.p>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
