# Games Vault - Frontend SPA (Vanilla JS + Vite)

Aplicación cliente **Single Page Application (SPA)** construida con **HTML5**, **CSS3** y **JavaScript Vanilla (ES Modules)**, con arquitectura **MVVM (Model - View - ViewModel)** y propulsada por **Vite**.

Sin frameworks (ni React, ni Vue, ni Angular, ni jQuery), solo Vanilla JS puro con las ventajas de Vite para el desarrollo local y la gestión nativa de variables de entorno.

---

## ⚙️ Configuración de Variables de Entorno (`.env`)

Vite carga automáticamente los archivos `.env`. Las variables accesibles desde el código cliente deben llevar el prefijo **`VITE_`**:

En `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

El código en [`src/config/config.js`](./src/config/config.js) la consume de forma nativa y estándar:
```javascript
const envUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const config = Object.freeze({
    apiBaseUrl: envUrl.replace(/\/+$/, "")
});
```

---

## 🚀 Cómo Levantar el Frontend

1. **Instalar dependencias** (si no están instaladas):
   ```bash
   cd clean-architecture-games/frontend
   npm install
   ```

2. **Iniciar servidor de desarrollo con Vite:**
   ```bash
   npm run dev
   ```

Vite levantará el servidor en:
👉 [http://localhost:8080](http://localhost:8080)

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `http://localhost:8080` con Hot Module Replacement (HMR).
- `npm run build`: Genera el bundle optimizado para producción en `dist/`.
- `npm run preview`: Previsualiza la versión de producción generada en `dist/`.

---

## 🏛️ Estructura del Frontend

```text
frontend/
├── index.html                     # HTML único de la SPA
├── package.json                   # Scripts de Vite (dev, build, preview)
├── vite.config.js                 # Configuración de Vite (puerto 8080)
├── .env                           # Configuración activa (VITE_API_BASE_URL)
├── .env.example                   # Plantilla de variables
├── .gitignore
├── README.md
└── src/
    ├── components/
    │   ├── GameCard.js            # Tarjeta de juego con enlaces SPA
    │   ├── Modal.js               # Diálogo modal reutilizable
    │   ├── Navbar.js              # Header con rutas activas y badge
    │   └── Toast.js               # Notificaciones flotantes
    ├── config/
    │   └── config.js              # import.meta.env.VITE_API_BASE_URL
    ├── models/
    │   └── Game.js                # Modelo de datos y validaciones
    ├── pages/
    │   ├── CatalogPage.js         # Vista catálogo (#/ o #/games)
    │   ├── GameDetailPage.js      # Detalle de juego (#/games/:id)
    │   └── GameFormPage.js        # Creación y edición (#/games/new, #/games/:id/edit)
    ├── router/
    │   └── Router.js              # Router SPA en Hash
    ├── services/
    │   └── GameApiService.js      # Cliente HTTP fetch desacoplado
    ├── styles/
    │   ├── base.css
    │   ├── components.css
    │   ├── layout.css
    │   └── pages.css
    ├── viewmodels/
    │   ├── GameDetailsViewModel.js
    │   ├── GameFormViewModel.js
    │   └── GameListViewModel.js
    └── main.js                    # Bootstrapper y montaje de páginas
```
