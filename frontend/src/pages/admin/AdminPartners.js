import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, getAdminToken, setAdminToken } from '../../utils/api';
import { FaCheck, FaTimes, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function AdminPartners() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAdminToken()) {
      navigate('/admin/login', { replace: true });
      return;
    }
    load();
  }, [navigate, tab]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const partnersRes = await adminApi.getPartners(tab === 'all' ? undefined : tab);
      setPartners(partnersRes);
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

  const handleAccept = async (id) => {
    setSubmitting(true);
    try {
      await adminApi.acceptPartner(id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to accept.');
    } finally {
      setSubmitting(false);
    }
  };

  const sanitizeInput = (value, maxLength = 1000) => {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
  };

  const handleReject = async (id) => {
    const reason = rejectReason[id]?.trim();
    if (!reason) {
      setError('Please enter a rejection reason.');
      return;
    }
    if (reason.length > 500) {
      setError('Rejection reason must be 500 characters or less.');
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.rejectPartner(id, sanitizeInput(reason, 500));
      setRejectReason((prev) => ({ ...prev, [id]: '' }));
      await load();
    } catch (err) {
      setError(err.message || 'Failed to reject.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Partner requests</h1>
        <p className="text-gray-500 text-sm sm:text-base">Review, accept or reject partner signup applications.</p>
      </div>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-3">
          <span className="text-red-500 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === key
                ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mb-3" />
            <p className="text-gray-500 text-sm">Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FaBuilding className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm sm:text-base">No partners in this list.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {partners.map((p) => (
              <li key={p._id} className="p-5 sm:p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="font-semibold text-gray-900 text-base flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-secondary/70 flex-shrink-0" />
                      {p.institutionName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 break-words">
                      <FaEnvelope className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {p.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaPhone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {p.phoneNumber} / {p.mobileNumber}
                    </p>
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <FaMapMarkerAlt className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="break-words">
                        {p.address?.stateProvince}, {p.address?.cityDistrict}, {p.address?.areaLocalLevel}, Ward {p.address?.wardNumber}
                        {p.address?.street && `, ${p.address.street}`}
                      </span>
                    </p>
                    {p.status === 'rejected' && p.rejectionReason && (
                      <p className="text-xs text-red-600 mt-2 break-words bg-red-50/50 px-2 py-1.5 rounded-lg">Rejection: {p.rejectionReason}</p>
                    )}
                  </div>
                  {p.status === 'pending' && (
                    <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[240px]">
                      <textarea
                        placeholder="Rejection reason (required if rejecting)"
                        value={rejectReason[p._id] || ''}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[<>]/g, '').slice(0, 500);
                          setRejectReason((prev) => ({ ...prev, [p._id]: sanitized }));
                        }}
                        maxLength={500}
                        className="admin-input w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccept(p._id)}
                          disabled={submitting}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-70 transition-colors"
                        >
                          <FaCheck className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(p._id)}
                          disabled={submitting || !rejectReason[p._id]?.trim()}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-70 transition-colors"
                        >
                          <FaTimes className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                  {p.status !== 'pending' && (
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        p.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
