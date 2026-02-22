import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import logo from '../assets/images/logo.svg';

const SOCIAL_ICONS = [
  { Icon: FaFacebookF, label: 'Facebook', href: 'https://facebook.com' },
  { Icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: FaTiktok, label: 'TikTok', href: 'https://tiktok.com' },
  { Icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://linkedin.com' },
  { Icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com' },
];

const FOOTER_LINKS = [
  { name: 'Services', path: '/services' },
  { name: 'Study Destinations', path: '/destinations' },
  { name: 'About Us', path: '/about' },
  { name: 'News & Events', path: '/news' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

const FOOTER_LINK_GROUPS = [
  { label: 'Explore', links: FOOTER_LINKS.slice(0, 3) },
  { label: 'Connect', links: FOOTER_LINKS.slice(3, 6) },
];

export default function Footer() {
  return (
    <footer className="w-full text-white" style={{ background: 'linear-gradient(180deg, #D6212A 0%, #920000 100%)' }}>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img src={logo} alt="Edu-Bridge" className="h-9 sm:h-10 w-auto brightness-0 invert opacity-95" />
            </Link>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xs">
              Your bridge to world-class education. We guide you from application to arrival.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {SOCIAL_ICONS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 text-white hover:bg-white hover:text-primary transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {/* Link groups */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 gap-8 lg:gap-10">
            {FOOTER_LINK_GROUPS.map(({ label, links }) => (
              <div key={label}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-4">
                  {label}
                </h4>
                <ul className="space-y-3">
                  {links.map(({ name, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        className="text-white/90 text-sm hover:text-white transition-colors duration-200"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/75 text-sm">
            © {new Date().getFullYear()} Edu-Bridge. All rights reserved.
          </p>
          <p className="text-white/75 text-sm">
            Developed by <span className="text-white font-medium">Yanish Singh</span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
