import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { getServiceBySlug, SERVICES_LIST } from '../config/services';

const SERVICE_CONTENT = {
  'career-counseling': {
    intro: 'We help you align your study choices with your long-term career aspirations and global market trends.',
    points: [
      'Personalised career mapping based on your strengths and goals',
      'Insight into job markets and opportunities in your target country',
      'Course and institution selection that supports your career path',
    ],
  },
  'interview-preparation': {
    intro: 'Tailored coaching to help you excel in university and embassy interviews.',
    points: [
      'Mock interviews with detailed feedback',
      'Common questions and strong answer frameworks',
      'Confidence-building and presentation tips',
    ],
  },
  'ielts-preparation': {
    intro: 'Structured coaching to help you achieve your target IELTS score.',
    points: [
      'Focus on all four modules: Listening, Reading, Writing, Speaking',
      'Practice tests and time-management strategies',
      'Tips and techniques to maximise your score',
    ],
  },
  'university-admissions': {
    intro: 'End-to-end support for shortlisting, applying, and securing admission to the right universities.',
    points: [
      'Profile-based shortlisting and eligibility checks',
      'Application strategy and document preparation',
      'Deadline tracking and follow-up until you receive an offer',
    ],
  },
  'visa-facilitation': {
    intro: 'Expert guidance and documentation support for a smooth visa application process.',
    points: [
      'Visa checklist and document preparation',
      'Application review and submission support',
      'Preparation for visa interviews where required',
    ],
  },
  'pre-post-departure': {
    intro: 'Practical guidance before you leave and continued support after you arrive.',
    points: [
      'Pre-departure briefings: accommodation, travel, insurance, and what to pack',
      'Cultural and academic orientation',
      'Post-arrival check-ins and local resource signposting',
    ],
  },
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/services" replace />;

  const content = SERVICE_CONTENT[service.slug] || {
    intro: 'We provide comprehensive support in this area as part of your study-abroad journey.',
    points: ['Personalised guidance', 'Expert support', 'End-to-end assistance'],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary text-sm font-medium mb-8 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            All services
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {content.intro}
          </p>

          <ul className="space-y-4 mb-10">
            {content.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4">Explore our other services:</p>
            <div className="flex flex-wrap gap-2">
              {SERVICES_LIST.filter((s) => s.slug !== slug).slice(0, 3).map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {s.title}
                </Link>
              ))}
              <Link
                to="/services"
                className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                View all
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
