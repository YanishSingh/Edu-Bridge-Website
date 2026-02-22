import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerApi, getPartnerToken, setPartnerToken } from '../utils/api';

export default function Vault() {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getPartnerToken()) {
      navigate('/login', { replace: true });
      return;
    }
    partnerApi
      .getVaultLinks()
      .then(setLinks)
      .catch((err) => {
        setError(err.message || 'Failed to load vault.');
        if (err.status === 401 || err.status === 403) {
          setPartnerToken(null);
          navigate('/login', { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    setPartnerToken(null);
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-text text-sm sm:text-base">Loading vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-primary">Partner Vault</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-text hover:text-primary font-medium text-xs sm:text-sm px-2 sm:px-0"
        >
          Log out
        </button>
      </header>
      <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {error && (
          <div className="p-3 sm:p-4 rounded-lg bg-red-50 text-red-600 text-xs sm:text-sm mb-4 sm:mb-6">{error}</div>
        )}
        <p className="text-text text-xs sm:text-sm mb-4 sm:mb-6">Confidential documents and links shared by Edu-Bridge. Do not share outside your organisation.</p>
        {links.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 text-center text-text text-sm sm:text-base">
            No links in the vault yet. Admin will add documents and links here.
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {links.map((link) => (
              <li key={link._id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-primary hover:shadow-sm transition-colors"
                >
                  <span className="font-medium text-text text-sm sm:text-base break-words flex-1 min-w-0">{link.title}</span>
                  <span className="text-primary text-xs sm:text-sm flex-shrink-0">Open →</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
