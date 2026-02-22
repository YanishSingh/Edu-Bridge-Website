import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, getAdminToken, setAdminToken } from '../../utils/api';
import { FaLink, FaPlus, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

export default function AdminVault() {
  const navigate = useNavigate();
  const [vaultLinks, setVaultLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAdminToken()) {
      navigate('/admin/login', { replace: true });
      return;
    }
    load();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const linksRes = await adminApi.getVaultLinks();
      setVaultLinks(linksRes);
    } catch (err) {
      if (err.status === 401) {
        setAdminToken(null);
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(err.message || 'Failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const sanitizeInput = (value, maxLength = 1000) => {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    if (newLink.title.length > 200) {
      setError('Title must be 200 characters or less.');
      return;
    }
    if (newLink.url.length > 2000) {
      setError('URL must be 2000 characters or less.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await adminApi.addVaultLink({
        title: sanitizeInput(newLink.title, 200),
        url: sanitizeInput(newLink.url, 2000),
      });
      setNewLink({ title: '', url: '' });
      await load();
    } catch (err) {
      setError(err.message || 'Failed to add link.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    setSubmitting(true);
    try {
      await adminApi.deleteVaultLink(id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Vault links</h1>
        <p className="text-gray-500 text-sm sm:text-base">Links shared with partners in the vault (e.g. Google Sheets, docs, PDFs).</p>
      </div>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-3">
          <span className="text-red-500 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}
      <div className="admin-card p-5 sm:p-6 mb-6">
        <h3 className="admin-section-title mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-secondary rounded-full" />
          Add new link
        </h3>
        <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row flex-wrap gap-3">
          <input
            type="text"
            placeholder="Title"
            value={newLink.title}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[<>]/g, '').slice(0, 200);
              setNewLink((prev) => ({ ...prev, title: sanitized }));
            }}
            maxLength={200}
            className="admin-input px-4 py-2.5 rounded-xl border border-gray-200 text-sm w-full sm:min-w-[180px] sm:max-w-xs focus:outline-none"
          />
          <input
            type="url"
            placeholder="URL (Google Sheet, Doc, PDF link)"
            value={newLink.url}
            onChange={(e) => {
              const sanitized = e.target.value.trim().slice(0, 2000);
              setNewLink((prev) => ({ ...prev, url: sanitized }));
            }}
            maxLength={2000}
            className="admin-input px-4 py-2.5 rounded-xl border border-gray-200 text-sm flex-1 min-w-0 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !newLink.title.trim() || !newLink.url.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold shadow-md shadow-secondary/20 hover:bg-secondary-dark disabled:opacity-70 transition-all w-full sm:w-auto"
          >
            <FaPlus className="w-4 h-4" />
            Add link
          </button>
        </form>
      </div>
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mb-3" />
            <p className="text-gray-500 text-sm">Loading links...</p>
          </div>
        ) : vaultLinks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FaLink className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm sm:text-base">No vault links yet.</p>
            <p className="text-xs mt-1">Add one using the form above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {vaultLinks.map((link) => (
              <li key={link._id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium text-secondary hover:text-primary break-words flex-1 min-w-0 text-sm sm:text-base group"
                >
                  <FaExternalLinkAlt className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0" />
                  {link.title}
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteLink(link._id)}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-3 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors disabled:opacity-70"
                >
                  <FaTrash className="w-4 h-4" />
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
