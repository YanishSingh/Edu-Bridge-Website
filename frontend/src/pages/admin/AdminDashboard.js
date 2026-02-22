import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaLink, FaHome, FaArrowRight } from 'react-icons/fa';

const cards = [
  {
    to: '/admin/partners',
    title: 'Partner requests',
    description: 'Review, accept or reject partner signup requests.',
    Icon: FaUsers,
    color: 'secondary',
  },
  {
    to: '/admin/vault',
    title: 'Vault links',
    description: 'Add or remove links shared with partners in the vault.',
    Icon: FaLink,
    color: 'primary',
  },
  {
    to: '/admin/homepage',
    title: 'Homepage content',
    description: 'Edit stats, services, how it works, destinations and university logos.',
    Icon: FaHome,
    color: 'secondary',
  },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm sm:text-base">Choose a section to manage.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map(({ to, title, description, Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="group block bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-lg hover:border-secondary/20 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                color === 'primary'
                  ? 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  : 'bg-secondary/10 text-secondary group-hover:bg-secondary/20'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-gray-900 text-lg mb-2">{title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>
            <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium group-hover:gap-3 transition-all">
              Open <FaArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
