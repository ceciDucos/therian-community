# TherianCommunity

Una plataforma web inclusiva y apta para todo público centrada en la comunidad Therian, con un módulo "Therian Digital" para creación de avatares y perfiles.

## 🚀 Stack Tecnológico

- **Frontend**: Angular 21 (standalone components + signals)
- **Styling**: Tailwind CSS + Angular Material
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel (recomendado)

## 📋 Requisitos Previos

- Node.js 22+ (se recomienda usar nvm)
- npm 10+
- Cuenta de Supabase (gratis): https://supabase.com

## 🛠️ Setup del Proyecto

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crear un nuevo proyecto en [https://supabase.com](https://supabase.com)
2. En el dashboard de Supabase, ir a **Settings > API**
3. Copiar:
   - `Project URL` (supabaseUrl)
   - `anon public` key (supabaseKey)

### 3. Configurar Variables de Entorno

Editar `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL_AQUI',
  supabaseKey: 'TU_SUPABASE_ANON_KEY_AQUI'
};
```

### 4. Ejecutar Migraciones de Base de Datos

En Supabase Dashboard:
1. Ir a **SQL Editor**
2. Crear una nueva query
3. Copiar y pegar el contenido de `supabase/migrations/001_initial_schema.sql`
4. Ejecutar

Esto creará:
- 10 tablas (profiles, avatars, posts, comments, likes, reports, blocked_users, moderation_config, embedded_videos, products)
- Políticas RLS (Row Level Security)
- Triggers automáticos
- Índices para performance

### 5. Configurar Storage Buckets (Opcional para MVP)

En Supabase Dashboard > **Storage**:
1. Crear bucket `avatars` (público)
2. Crear bucket `posts` (público)
3. Crear bucket `products` (público)

### 6. Ejecutar el Proyecto

```bash
npm start
```

O con el path correcto de Node:

```bash
PATH="$HOME/.nvm/versions/node/v22.19.0/bin:$PATH" npm start
```

La aplicación estará disponible en: `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/app/
├── core/                  # Servicios singleton, guards
│   ├── services/
│   │   ├── supabase.service.ts
│   │   └── auth.service.ts
│   └── guards/
│       ├── auth.guard.ts
│       └── admin.guard.ts
├── features/             # Componentes por feature
│   ├── auth/
│   ├── avatar-creator/
│   ├── profile/
│   ├── feed/
│   ├── multimedia/
│   ├── store/
│   ├── admin/
│   └── public/
├── shared/               # Componentes reutilizables
├── models/              # Interfaces TypeScript
└── app.routes.ts        # Configuración de rutas
```

## 🎯 Features del MVP

### ✅ Implementadas (Base)
- [x] Arquitectura Angular 21 con standalone components
- [x] Integración con Supabase
- [x] Schema de base de datos completo
- [x] Servicios core (Auth, Supabase)
- [x] Guards de autenticación
- [x] Modelos TypeScript

### 🚧 Por Implementar
- [ ] Creador de Avatar 2D (sistema de capas)
- [ ] Perfil Therian Digital con privacidad
- [ ] Feed de comunidad (posts, comentarios, likes)
- [ ] Sistema de moderación
- [ ] Páginas educativas públicas
- [ ] Multimedia (embeds de videos)
- [ ] Tienda MVP (sin pagos)
- [ ] Panel admin

## 🧪 Testing

```bash
# Unit tests
npm run test

# Build production
npm run build
```

## 🌐 Deployment

### Vercel

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configurar variables de entorno en Vercel dashboard

## 📝 Próximos Pasos

1. ✅ Configurar tu proyecto de Supabase
2. ✅ Ejecutar las migraciones SQL
3. 🔜 Implementar componentes de UI
4. 🔜 Crear assets de avatares
5. 🔜 Desarrollar features principales

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Por ahora es un proyecto personal.

## 📄 Licencia

Pendiente de definir.

## 💡 Notas de Desarrollo

- Usamos **signals** de Angular 21 para reactive state
- Todos los componentes son **standalone** (no NgModules)
- Guards son **funcionales** con `inject()`
- Supabase maneja auth, storage y DB
- RLS policies aseguran acceso correcto a datos

---

**¡Bienvenidx a TherianCommunity!** 🐾
