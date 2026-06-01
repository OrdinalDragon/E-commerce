<div align="center">

# 🛒 EmotionShop — E-Commerce Platform

### Full-Stack MERN + AWS Cloud-Native E-Commerce Solution

[![Deploy Frontend](https://github.com/OrdinalDragon/E-commerce/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/OrdinalDragon/E-commerce/actions/workflows/deploy-frontend.yml)
![Node](https://img.shields.io/badge/Node.js-20-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900)

**🌐 Live Demo: [emotionshop.jesrepresentaciones.com.ar](https://emotionshop.jesrepresentaciones.com.ar)**

---

<details>
<summary><strong>🇺🇸 English (Default)</strong></summary>

## About This Project

**EmotionShop** is a production-ready, full-stack e-commerce platform built with the **MERN stack** (MongoDB, Express, React, Node.js) and deployed on **AWS Cloud Infrastructure**. This project demonstrates end-to-end development capabilities across backend engineering, frontend design, cloud architecture, and DevOps automation.

> **This project is available for purchase.** If you're interested in acquiring this solution or a customized version for your business, feel free to reach out.

### Key Features

#### 🛍️ Client Experience
- **Product Catalog** with search, category filters, and pagination
- **Dynamic Categories** auto-generated from product data
- **Product Detail Pages** with image gallery, reviews, and ratings
- **Shopping Cart** with persistent state
- **Full Checkout Flow**: Shipping → Payment → Order Confirmation
- **Simulated Payment System** with order status tracking
- **Responsive Design** optimized for mobile, tablet, and desktop

#### 🔧 Admin Panel
- **Dashboard** with sales analytics and order statistics (Recharts)
- **Product Management** (CRUD) with image upload to AWS S3
- **Order Management** with delivery status updates
- **User Management** with role-based access control

#### ⭐ Reviews & Ratings
- Interactive star rating selector
- Duplicate review prevention
- Real-time UI updates with cache invalidation

---

## Architecture & Cloud Infrastructure

### AWS Services

| Service | Purpose |
|---------|---------|
| **Amazon S3** | Frontend static hosting + product image storage |
| **Amazon CloudFront** | Global CDN with custom domain and SSL |
| **Amazon EC2** | Backend API server (Docker containerized) |
| **MongoDB Atlas** | Managed NoSQL database (free tier) |
| **AWS Certificate Manager** | SSL/TLS certificates for custom domains |
| **GitHub Actions** | CI/CD pipeline for automated deployments |

### Infrastructure Diagram

```
                    ┌──────────────────────────────────────────────┐
                    │                  AWS Cloud                    │
                    │                                              │
  Browser ──HTTPS──▶ CloudFront ──OAC──▶ S3 (Frontend)           │
       │             (CDN + SSL)                                   │
       │                                                          │
       │             CloudFlare ──HTTPS──▶ EC2 (Docker)           │
       │             (DNS + Proxy)        ┌─────────────────┐     │
       │                                  │  Express.js API │     │
       │                                  │  Node.js 20     │     │
       │                                  └────────┬────────┘     │
       │                                           │              │
       │                                           ▼              │
       │                                  ┌─────────────────┐     │
       └──────────────API Calls──────────│  MongoDB Atlas   │     │
                                         │  (M10 Cluster)   │     │
                                         └─────────────────┘     │
                                                                  │
  GitHub ──push──▶ GitHub Actions ──build+sync──▶ S3 + CF         │
                    (CI/CD Pipeline)                               │
                    └──────────────────────────────────────────────┘
```

### Security Features
- **JWT Authentication** with token expiration
- **Role-Based Access Control** (Admin / Client)
- **Rate Limiting** (100 req / 15 min per IP)
- **Helmet.js** security headers
- **Zod Schema Validation** on all endpoints
- **CORS** configured for specific origins
- **Image Compression** client-side before upload
- **Non-root Docker user** in production

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Image Upload**: AWS SDK v3 (S3)
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18 (Vite)
- **State Management**: Redux Toolkit (RTK Query)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 (Lazy-loaded)
- **Charts**: Recharts
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker (multi-stage builds)
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (S3, CloudFront, EC2, ACM)

---

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- MongoDB Atlas account
- AWS account with CLI configured

### Local Development

```bash
# Clone the repository
git clone https://github.com/OrdinalDragon/E-commerce.git
cd E-commerce

# Backend setup
cp .env .env.development
# Edit .env.development with your MongoDB URI and JWT secret
npm install
npm run dev

# Frontend setup (separate terminal)
cd client
npm install
npm run dev
```

### Production Deployment

```bash
# Build and run with Docker Compose
docker compose -f docker-compose.prod.yml up -d --build

# Frontend deployment (via GitHub Actions)
# Push to main branch triggers automatic S3 + CloudFront deployment
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | User login |
| GET | `/api/v1/products` | No | List products (paginated) |
| GET | `/api/v1/products/categories` | No | Get all categories |
| GET | `/api/v1/products/:id` | No | Product details |
| POST | `/api/v1/products` | Admin | Create product |
| PUT | `/api/v1/products/:id` | Admin | Update product |
| DELETE | `/api/v1/products/:id` | Admin | Delete product |
| POST | `/api/v1/products/upload` | Admin | Upload product image |
| POST | `/api/v1/products/:id/reviews` | Client | Add product review |
| POST | `/api/v1/orders` | Client | Create order |
| GET | `/api/v1/orders/mine` | Client | User orders |
| GET | `/api/v1/orders/:id` | Client | Order details |
| PUT | `/api/v1/orders/:id/pay` | Client | Simulate payment |
| GET | `/api/v1/admin/orders` | Admin | List all orders |
| PUT | `/api/v1/admin/orders/:id/deliver` | Admin | Mark as delivered |
| GET | `/api/v1/admin/stats` | Admin | Dashboard statistics |

---

## Author

**Nico Schnetzki** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-OrdinalDragon-181717?logo=github)](https://github.com/OrdinalDragon)

---

## License

This project is proprietary software. All rights reserved.

For inquiries about purchasing or customization, please contact through GitHub.

</details>

---

<details>
<summary><strong>🇪🇸 Español (Click para ver)</strong></summary>

## Sobre Este Proyecto

**EmotionShop** es una plataforma de e-commerce lista para producción, construida con el **stack MERN** (MongoDB, Express, React, Node.js) y desplegada en **infraestructura AWS Cloud**. Este proyecto demuestra capacidades de desarrollo integral en ingeniería backend, diseño frontend, arquitectura cloud y automatización DevOps.

> **Este proyecto está en venta.** Si estás interesado en adquirir esta solución o una versión personalizada para tu negocio, no dudes en contactarme.

### Características Principales

#### 🛍️ Experiencia del Cliente
- **Catálogo de productos** con búsqueda, filtros por categoría y paginación
- **Categorías dinámicas** generadas automáticamente desde los datos de productos
- **Páginas de detalle** con galería de imágenes, reseñas y calificaciones
- **Carrito de compras** con estado persistente
- **Flujo de checkout completo**: Envío → Pago → Confirmación del pedido
- **Sistema de pago simulado** con seguimiento de estado
- **Diseño responsive** optimizado para móvil, tablet y escritorio

#### 🔧 Panel de Administración
- **Dashboard** con analíticas de ventas y estadísticas de pedidos (Recharts)
- **Gestión de productos** (CRUD) con carga de imágenes a AWS S3
- **Gestión de pedidos** con actualización de estado de entrega
- **Gestión de usuarios** con control de acceso basado en roles

#### ⭐ Reseñas y Calificaciones
- Selector interactivo de estrellas
- Prevención de reseñas duplicadas
- Actualizaciones en tiempo real con invalidación de caché

---

## Arquitectura e Infraestructura Cloud

### Servicios AWS

| Servicio | Propósito |
|----------|-----------|
| **Amazon S3** | Hosting del frontend + almacenamiento de imágenes |
| **Amazon CloudFront** | CDN global con dominio personalizado y SSL |
| **Amazon EC2** | Servidor API backend (Docker containerizado) |
| **MongoDB Atlas** | Base de datos NoSQL gestionada (tier gratuito) |
| **AWS Certificate Manager** | Certificados SSL/TLS para dominios personalizados |
| **GitHub Actions** | Pipeline CI/CD para despliegues automatizados |

### Funcionalidades de Seguridad
- **Autenticación JWT** con expiración de tokens
- **Control de acceso basado en roles** (Admin / Cliente)
- **Rate Limiting** (100 req / 15 min por IP)
- **Security headers** con Helmet.js
- **Validación de esquemas** con Zod en todos los endpoints
- **CORS** configurado para orígenes específicos
- **Compresión de imágenes** del lado del cliente antes de subir
- **Usuario non-root** en Docker producción

---

## Stack Tecnológico

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Base de datos**: MongoDB (Mongoose ODM)
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: Zod
- **Imágenes**: AWS SDK v3 (S3)
- **Seguridad**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18 (Vite)
- **Estado**: Redux Toolkit (RTK Query)
- **Estilos**: Tailwind CSS
- **Rutas**: React Router v6 (Lazy-loaded)
- **Gráficos**: Recharts
- **Notificaciones**: React Hot Toast

### DevOps
- **Containerización**: Docker (multi-stage builds)
- **Orquestación**: Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (S3, CloudFront, EC2, ACM)

---

## Autor

**Nico Schnetzki** — Desarrollador Full-Stack

[![GitHub](https://img.shields.io/badge/GitHub-OrdinalDragon-181717?logo=github)](https://github.com/OrdinalDragon)

---

## Licencia

Este proyecto es software propietario. Todos los derechos reservados.

Para consultas sobre compra o personalización, contactame a través de GitHub.

</details>
