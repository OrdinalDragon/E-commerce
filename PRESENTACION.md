<div align="center">

# 🛒 EmotionShop — E-Commerce Platform

### Full-Stack MERN + AWS Cloud-Native E-Commerce Solution

**LEONARDO — JOEL — DIEGO — AYLEN — GASTON — MAYLEN — GERMAN — NICOLAS**

**MERN Stack + AWS Cloud | Turismo Local — Argentina**

</div>

---

## EXPOSITOR 1 — Título + Problema (1:15)

<div align="center">

# EmotionShop

### La plataforma e-commerce que transforma la experiencia de compra online

**MERN Stack + AWS Cloud | Turismo Local — Argentina**

</div>

**¿Cuál es el problema?**

Las PyMEs argentinas carecen de una presencia digital accesible y profesional. Las plataformas existentes son costosas, complejas de configurar y no se adaptan al mercado local.

- 🔴 **Costo elevado** — Shopify y similares cobran suscripciones mensuales que muchas PyMEs no pueden pagar.
- 🔴 **Barrera técnica** — Configurar una tienda online requiere conocimientos que la mayoría de comerciantes no tienen.
- 🔴 **Experiencia genérica** — Las plataformas no están diseñadas para el consumidor argentino ni su forma de comprar.
- 🔴 **Sin soporte local** — No hay integración con métodos de pago y logística del mercado local.

---

## EXPOSITOR 2 — ¿Qué es EmotionShop? (1:15)

EmotionShop es una plataforma e-commerce full-stack que demuestra cómo una tienda online profesional puede construirse desde cero con tecnologías modernas y desplegarse en la nube de forma escalable y económica.

- 🟢 **Panel de administración completo** — Gestión de productos, pedidos, usuarios y analíticas en tiempo real.
- 🟢 **Catálogo dinámico** — Categorías automáticas, búsqueda, filtros y paginación.
- 🟢 **Flujo de compra completo** — Carrito, envío, pago simulado y confirmación.
- 🟢 **Diseño responsive** — Experiencia optimizada para celular, tablet y escritorio.
- 🟢 **Reseñas y calificaciones** — Sistema interactivo de reviews por parte de los clientes.

**Demo en vivo:** emotionshop.jesrepresentaciones.com.ar

---

## EXPOSITOR 3 — Público Objetivo + Propuesta de Valor (1:15)

**¿Para quién es EmotionShop?**

- 👨‍💻 **Emprendedores** — Quieren vender online sin invertir en plataformas costosas.
- 🏪 **Comerciantes PyMEs** — Necesitan una vitrina digital profesional y fácil de gestionar.
- 🎓 **Estudiantes y desarrolladores** — Buscan un proyecto portfolio completo y desplegado en producción.
- 🏢 **Empresas** — Requieren soluciones e-commerce escalables y personalizables.

**Propuesta de valor:**

- ✅ **Accesibilidad** — Construido con tecnologías open-source, sin costos de licencias.
- ✅ **Escalabilidad** — Cloud-native, crece con el negocio.
- ✅ **Rapidez** — Despliegue en menos de 2 minutos con CI/CD automatizado.
- ✅ **Costo cero** — Funciona completamente en free tier de AWS y MongoDB Atlas.

---

## EXPOSITOR 4 — Stack Tecnológico (1:15)

**Frontend:**
React 18 + Vite + Tailwind CSS + Redux Toolkit (RTK Query)

**Backend:**
Node.js + Express.js + MongoDB Atlas (Mongoose ODM)

**Cloud:**
Amazon S3 + CloudFront + EC2 + Certificate Manager

**DevOps:**
Docker (multi-stage builds) + GitHub Actions CI/CD

**Seguridad:**
JWT + RBAC + Rate Limiting + Helmet.js + Zod

**Código fuente:** github.com/OrdinalDragon/E-commerce
**Demo en vivo:** emotionshop.jesrepresentaciones.com.ar

---

## EXPOSITOR 5 — Arquitectura Cloud (1:15)

```
Browser → CloudFront (CDN + SSL) → S3 (Frontend estático)
Browser → CloudFlare → EC2 Docker (API Express) → MongoDB Atlas
GitHub Push → GitHub Actions → Build → S3 sync → CloudFront invalidation
```

**Servicios AWS:**

| Servicio | Propósito |
|----------|-----------|
| **Amazon S3** | Hosting del frontend + imágenes de productos |
| **CloudFront** | CDN global con dominio personalizado y SSL |
| **EC2** | Servidor API containerizado con Docker |
| **MongoDB Atlas** | Base de datos NoSQL gestionada (tier gratuito) |
| **Certificate Manager** | Certificados SSL/TLS automáticos |
| **GitHub Actions** | CI/CD automatizado |

**Seguridad Cloud:** CORS configurado, Rate Limiting, Docker non-root, JWT auth, Validación Zod.

---

## EXPOSITOR 6 — Funcionalidades del Cliente (1:15)

**Experiencia de compra:**

- 🛍️ **Catálogo de productos** — Búsqueda en tiempo real, filtros por categoría y paginación.
- 📂 **Categorías dinámicas** — Se generan automáticamente desde los productos en la base de datos.
- 🖼️ **Detalle de producto** — Galería de imágenes, descripción, precio y stock.
- ⭐ **Reseñas y calificaciones** — Sistema interactivo de estrellas con prevención de duplicados.

**Flujo de checkout:**

1. **Carrito** — Agregar, modificar cantidades, eliminar productos.
2. **Envío** — Dirección de entrega con validación.
3. **Pago** — Sistema simulado con estados de orden.
4. **Confirmación** — Resumen del pedido con tracking.

📱 **100% responsive** — Funciona en celular, tablet y escritorio.

---

## EXPOSITOR 7 — Funcionalidades del Admin + Automatización (1:15)

**Panel de administración:**

- 📊 **Dashboard** — Analíticas de ventas con gráficos interactivos (Recharts).
- 📦 **Gestión de productos** — Crear, editar, eliminar con subida de imágenes a S3.
- 🚚 **Gestión de pedidos** — Ver todos los pedidos, marcar como entregado.
- 👥 **Gestión de usuarios** — Control de roles (Admin / Cliente).

**Automatización DevOps:**

- 🔄 **CI/CD** — Cada push a main despliega el frontend automáticamente a S3 + CloudFront.
- 💾 **Backup automático** — MongoDB se respalda diariamente a S3.
- 🗜️ **Compresión de imágenes** — Se comprimen en el navegador antes de subir a S3.
- ♻️ **Reinicio automático** — Docker restart: always mantiene el backend activo.
- 🧹 **Limpieza semanal** — Docker prune automático para liberar espacio en disco.

---

## EXPOSITOR 8 — Seguridad + Resultados + Cierre (1:15)

**Seguridad:**

- 🔒 **JWT** — Autenticación con expiración de tokens.
- 🔒 **RBAC** — Control de acceso por roles (Admin / Cliente).
- 🔒 **Rate Limiting** — 100 requests por 15 min por IP.
- 🔒 **Zod** — Validación de esquemas en todos los endpoints.
- 🔒 **Helmet.js** — Security headers automáticos.
- 🔒 **Docker non-root** — Usuario sin privilegios en producción.
- 🔒 **bcrypt** — Contraseñas hasheadas, nunca en texto plano.

**Resultados:**

| Métrica | Valor |
|---------|-------|
| Tiempo de carga | < 2 segundos |
| API response | < 200ms promedio |
| Build size | ~380 KB gzip |
| Costo mensual | ~USD $0 (free tier) |
| Despliegue | < 2 min desde push |

---

<div align="center">

## EmotionShop — El futuro del comercio accesible está acá

**Demo:** emotionshop.jesrepresentaciones.com.ar
**Código:** github.com/OrdinalDragon/E-commerce

### ¿Preguntas?

</div>

---

## Resumen de Exposición

| # | Expositor | Tema | Tiempo |
|---|-----------|------|--------|
| 1 | Expositor 1 | Título + Problema | 1:15 |
| 2 | Expositor 2 | ¿Qué es EmotionShop? | 1:15 |
| 3 | Expositor 3 | Público + Propuesta de valor | 1:15 |
| 4 | Expositor 4 | Stack tecnológico | 1:15 |
| 5 | Expositor 5 | Arquitectura cloud | 1:15 |
| 6 | Expositor 6 | Funcionalidades cliente | 1:15 |
| 7 | Expositor 7 | Funcionalidades admin + DevOps | 1:15 |
| 8 | Expositor 8 | Seguridad + Resultados + Cierre | 1:15 |

**Total: 8 × 1:15 = 10:00 min**
