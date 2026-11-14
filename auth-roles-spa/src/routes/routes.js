import { catalogPage } from '../pages/catalog.js';
import { analyticsPage } from '../pages/analytics.js';
import { sellerPage } from '../pages/seller.js';
import { buyerPage } from '../pages/buyer.js';

export const routes = [
  { path: '/catalogo', label: 'Catálogo', icon: 'grid', render: catalogPage },
  { path: '/analytics', label: 'Analytics', icon: 'chart', roles: ['admin'], render: analyticsPage },
  { path: '/inventario', label: 'Mis productos', icon: 'box', roles: ['seller'], render: sellerPage },
  { path: '/disponibles', label: 'Disponibles', icon: 'bag', roles: ['buyer'], render: buyerPage },
];

export function canVisit(route, profile) {
  return Boolean(profile) && (!route.roles || route.roles.includes(profile.role));
}
