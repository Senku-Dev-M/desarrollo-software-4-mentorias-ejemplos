import { api } from './api.js';

const sellerPath = '/api/seller/products';

export const products = {
  inventory: (token, signal) => api('/api/catalog', { token, signal }),
  seller: (token, signal) => api(sellerPath, { token, signal }),
  available: (token, signal) => api('/api/buyer/available-products', { token, signal }),
  analytics: (token, signal) => api('/api/admin/analytics', { token, signal }),
  create: (token, body) => api(sellerPath, { token, method: 'POST', body }),
  update: (token, id, body) => api(`${sellerPath}/${encodeURIComponent(id)}`, { token, method: 'PUT', body }),
  remove: (token, id) => api(`${sellerPath}/${encodeURIComponent(id)}`, { token, method: 'DELETE' }),
};
