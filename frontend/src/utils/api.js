const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '') || 'http://localhost:5000';

export const getPartnerToken = () => localStorage.getItem('partnerToken');
export const setPartnerToken = (token) => { if (token) localStorage.setItem('partnerToken', token); else localStorage.removeItem('partnerToken'); };
export const getAdminToken = () => localStorage.getItem('adminToken');
export const setAdminToken = (token) => { if (token) localStorage.setItem('adminToken', token); else localStorage.removeItem('adminToken'); };

async function request(endpoint, options = {}, tokenGetter = null) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = tokenGetter?.();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({ message: 'Request failed' }));
  if (!res.ok) throw { status: res.status, message: data.message || 'Request failed', errors: data.errors };
  return data;
}

export const partnerApi = {
  signup: (body) => request('/partner/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/partner/login', { method: 'POST', body: JSON.stringify(body) }),
  getVaultLinks: () => request('/partner/vault/links', {}, getPartnerToken),
};

export const adminApi = {
  login: (body) => request('/admin/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getPartners: (status) => request(status ? `/admin/partners?status=${status}` : '/admin/partners', {}, getAdminToken),
  acceptPartner: (id) => request(`/admin/partners/${id}/accept`, { method: 'PATCH' }, getAdminToken),
  rejectPartner: (id, rejectionReason) => request(`/admin/partners/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ rejectionReason }) }, getAdminToken),
  getVaultLinks: () => request('/admin/vault/links', {}, getAdminToken),
  addVaultLink: (body) => request('/admin/vault/links', { method: 'POST', body: JSON.stringify(body) }, getAdminToken),
  deleteVaultLink: (id) => request(`/admin/vault/links/${id}`, { method: 'DELETE' }, getAdminToken),
  updateHomeContent: (body) => request('/admin/content/home', { method: 'PUT', body: JSON.stringify(body) }, getAdminToken),
  uploadImage: async (file) => {
    const uploadUrl = `${API_BASE.replace(/\/$/, '')}/admin/upload`;
    const formData = new FormData();
    formData.append('image', file);
    const token = getAdminToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(uploadUrl, { method: 'POST', body: formData, headers });
    const data = await res.json().catch(() => ({ message: 'Upload failed' }));
    if (!res.ok) throw { status: res.status, message: data.message || 'Upload failed' };
    const url = data?.url ?? data?.data?.url;
    if (url == null || typeof url !== 'string') throw { status: res.status, message: 'Upload response missing url' };
    return { url: url.startsWith('/') || url.startsWith('http') ? url : `/${url}` };
  },
};

export const contentApi = {
  getHome: () => request('/content/home', { cache: 'no-store' }),
};
