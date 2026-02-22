import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaBriefcase, FaComments, FaBook, FaUniversity, FaPassport, FaPlane } from 'react-icons/fa';
import { SERVICES_LIST } from '../config/services';

const ICONS = {
  'career-counseling': FaBriefcase,
  'interview-preparation': FaComments,
  'ielts-preparation': FaBook,
  'university-admissions': FaUniversity,
  'visa-facilitation': FaPassport,
  'pre-post-departure': FaPlane,
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <motion.header
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            End-to-end support for your study-abroad journey—from choosing a course to settling in your new country.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_LIST.map((service, i) => {
            const Icon = ICONS[service.slug] || FaArrowRight;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group block h-full bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/800/400?random=${i}`;
                      }}
                    />
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {service.shortDesc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                      Learn more <FaArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
