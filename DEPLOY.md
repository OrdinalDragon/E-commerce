# Guía de despliegue — E-commerce MERN

## Índice

1. [Frontend — S3 + CloudFront](#1-frontend--aws-s3--cloudfront)
2. [Backend — Docker en EC2](#2-backend--docker-en-ec2)
3. [CI/CD — GitHub Actions](#3-cicd--github-actions)
4. [Variables de entorno](#4-variables-de-entorno)

---

## 1. Frontend — AWS S3 + CloudFront

### Requisitos previos

- Una cuenta de AWS con permisos para crear buckets S3 y distribuciones CloudFront
- [AWS CLI](https://aws.amazon.com/cli/) instalado y configurado localmente
- Node.js 20+

### Paso a paso

**1. Compilar el frontend**

```bash
cd client
npm ci
npm run build
```

Esto genera la carpeta `client/dist/` con los archivos estáticos optimizados.

**2. Crear bucket S3**

```bash
aws s3 mb s3://emotionshop-frontend --region us-east-1
```

**3. Habilitar sitio estático**

```bash
aws s3 website s3://emotionshop-frontend \
  --index-document index.html \
  --error-document index.html
```

> El error-document apunta a `index.html` para que React Router maneje las rutas incluso si alguien recarga una URL como `/product/abc123`.

**4. Bloquear acceso público y usar CloudFront**

No expongas el bucket directamente. Creá una distribución CloudFront:

```bash
aws cloudfront create-distribution \
  --origin-domain-name emotionshop-frontend.s3.us-east-1.amazonaws.com \
  --default-root-object index.html \
  --custom-error-response '{
    "ErrorCode": 403,
    "ResponsePagePath": "/index.html",
    "ResponseCode": 200
  }' \
  --custom-error-response '{
    "ErrorCode": 404,
    "ResponsePagePath": "/index.html",
    "ResponseCode": 200
  }'
```

Guardá el **Distribution ID** que devuelve este comando — lo vas a necesitar para el CI/CD.

**5. Subir los archivos manualmente (primera vez)**

```bash
aws s3 sync client/dist/ s3://emotionshop-frontend --delete
```

**6. Probar**

Abrí la URL de CloudFront (`https://dxxxxx.cloudfront.net`) en el navegador.

---

## 2. Backend — Docker en EC2

### Requisitos previos

- Una instancia EC2 con Ubuntu 22.04 o Amazon Linux 2023
- Docker y Docker Compose instalados en la instancia
- Un nombre de dominio (opcional, pero recomendado)

### Configurar la instancia EC2

```bash
# Conectarse por SSH
ssh -i tu-clave.pem ubuntu@<ip-publica>

# Instalar Docker
sudo apt update && sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar para aplicar el grupo docker
exit
ssh -i tu-clave.pem ubuntu@<ip-publica>

# Instalar Docker Compose plugin
sudo apt install -y docker-compose-plugin
```

### Clonar y configurar

```bash
git clone https://github.com/tu-usuario/tu-repo.git ecommerce
cd ecommerce

# Crear el archivo de entorno de producción
cp .env.production .env.production
nano .env.production
# Completar: MONGO_URI, JWT_SECRET, AWS_*, CORS_ORIGIN
```

### Usar MongoDB Atlas (recomendado en producción)

En lugar de correr MongoDB en el mismo servidor, usá [MongoDB Atlas](https://www.mongodb.com/atlas) (tiene capa gratuita). En `MONGO_URI` poné la cadena de conexión de Atlas:

```
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

Luego editá `docker-compose.prod.yml` y **eliminá el servicio `mongo`** — solo queda el servicio `app`.

Si preferís correr MongoDB en el mismo servidor, dejá el archivo como está.

### Levantar el backend

```bash
docker compose -f docker-compose.prod.yml up -d
```

Verificar que funciona:

```bash
curl http://localhost:5000/api/v1/products
```

### Configurar Nginx como proxy reverso (opcional pero recomendado)

```bash
sudo apt install -y nginx
```

Crear `/etc/nginx/sites-available/ecommerce`:

```nginx
server {
    listen 80;
    server_name api.emotionshop.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilitar y recargar:

```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Luego configurá un certificado SSL con Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.emotionshop.com
```

### Actualizar CORS

En `.env.production` actualizá `CORS_ORIGIN` con la URL de CloudFront:

```
CORS_ORIGIN=https://dxxxxxxxxxxxx.cloudfront.net
```

Reiniciá el back:

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 3. CI/CD — GitHub Actions

El workflow en `.github/workflows/deploy-frontend.yml` automatiza la subida del frontend a S3 cada vez que hagas push a `main`.

### Configurar variables en GitHub

Andá a **Settings → Secrets and variables → Actions → Variables** y creá:

| Variable | Descripción |
|---|---|
| `AWS_REGION` | Región de AWS, ej. `us-east-1` |
| `S3_BUCKET_NAME` | Nombre del bucket, ej. `emotionshop-frontend` |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de la distribución CloudFront |

### Configurar permisos de AWS (IAM)

**Opción A — Usar un IAM Role (recomendado):**

En la consola de AWS:
1. Creá un **Identity Provider** de GitHub en IAM
2. Creá un **Role** con ese provider y la política que permita `s3:PutObject`, `s3:DeleteObject`, `cloudfront:CreateInvalidation`
3. Agregá el ARN del role como variable `AWS_DEPLOY_ROLE_ARN` en GitHub

**Opción B — Usar Access Keys (más simple):**

En **Settings → Secrets and variables → Actions → Secrets** creá:

| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Clave de acceso IAM |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta IAM |

Luego en el workflow reemplazá el paso `configure-aws-credentials` por:

```yaml
      - name: Configurar credenciales de AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: ${{ vars.AWS_REGION }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Política IAM mínima para el bucket

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::emotionshop-frontend",
        "arn:aws:s3:::emotionshop-frontend/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```

---

## 4. Estrategia de variables de entorno

### 4.1. Filosofía: separación total de entornos

El proyecto usa **tres archivos de entorno distintos**, cada uno con un propósito específico:

| Archivo | Git | ¿Para qué? |
|---|---|---|
| `.env` | Ignorado | Desarrollo local. Lo crea cada desarrollador. |
| `.env.development` | Ignorado | Plantilla de referencia con valores de desarrollo. |
| `.env.production` | Ignorado | Producción en EC2. Se crea manualmente en el servidor. |

Ninguno de estos archivos se sube a GitHub. El repositorio solo contiene `.gitignore` que los excluye explícitamente.

### 4.2. Cómo se cargan según el entorno

En `server.js` la carga es explícita:

```js
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });
```

- **Local (`node server.js` o `docker compose up`):**  
  `NODE_ENV` no está definido o vale `development` → se carga `.env`.

- **Producción (`docker compose -f docker-compose.prod.yml up -d`):**  
  `NODE_ENV=production` está definido en `.env.production` → se carga `.env.production`.  
  Además, Docker Compose ya inyecta esas variables directamente en el contenedor mediante `env_file`, así que la línea de `dotenv` es un respaldo por si se ejecuta fuera de Docker.

### 4.3. Inyección segura en Docker (el mecanismo clave)

El archivo `docker-compose.prod.yml` pasa las variables al contenedor de esta forma:

```yaml
services:
  app:
    env_file:
      - .env.production
```

**¿Qué hace exactamente `env_file`?**

Docker Compose lee el archivo `.env.production` en la máquina host (EC2) y le inyecta **cada línea como una variable de entorno real** dentro del contenedor en tiempo de ejecución. El contenedor las ve como si hubieran sido seteadas con `export`.

**¿Por qué es seguro?**

1. Las variables no quedan grabadas en ninguna capa de la imagen Docker (`.dockerignore` excluye `.env*`)
2. El archivo `.env.production` se crea a mano en el servidor via `scp` o `nano`, nunca pasa por Git
3. Si alguien se descarga la imagen de un registro, las variables no están dentro

**Flujo completo de secrets:**

```
Desarrollador (local)                  EC2 (producción)
─────────────────────                  ────────────────
.gitignore                       
  ├─ .env                          
  ├─ .env.development                  
  └─ .env.production                   .env.production (creado a mano)
                                               │
                                        docker-compose.prod.yml
                                               │
                                        env_file: .env.production
                                               │
                                        Contenedor Docker
                                        (variables en proceso)
```

### 4.4. Configuración de CORS en producción (seguridad crítica)

El backend valida el origen de cada petición. En producción, `CORS_ORIGIN` debe apuntar **exactamente** al dominio del frontend:

```
# ❌ Incorrecto — abre el backend a cualquier sitio
CORS_ORIGIN=*

# ✅ Correcto — solo acepta peticiones desde CloudFront
CORS_ORIGIN=https://dxxxxxxxxxxxx.cloudfront.net

# ✅ También funciona con múltiples orígenes (separados por coma)
CORS_ORIGIN=https://dxxxxxxxxxxxx.cloudfront.net,https://tienda.midominio.com
```

El servidor aplica esta regla en `server.js`:

```js
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
```

Si por algún motivo `CORS_ORIGIN` no está definido, cae a `'*'` (permisivo). Por eso **es obligatorio setearlo en producción**.

### 4.5. Tabla completa de variables

| Variable | Entorno | ¿Quién la necesita? | Secreto | Descripción |
|---|---|---|---|---|
| `NODE_ENV` | Ambos | Backend | No | `development` o `production` |
| `PORT` | Ambos | Backend | No | Puerto del servidor (5000) |
| `MONGO_URI` | Ambos | Backend | Sí | Cadena de conexión a MongoDB |
| `JWT_SECRET` | Ambos | Backend | **Sí** | Clave para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Ambos | Backend | No | Duración del token |
| `AWS_REGION` | Ambos | Backend | No | Región AWS |
| `AWS_ACCESS_KEY_ID` | Ambos | Backend | **Sí** | Access Key de IAM |
| `AWS_SECRET_ACCESS_KEY` | Ambos | Backend | **Sí** | Secret Key de IAM |
| `S3_BUCKET_NAME` | Ambos | Backend | No | Bucket de imágenes |
| `S3_BUCKET_URL` | Ambos | Backend | No | URL pública del bucket |
| `CORS_ORIGIN` | Ambos | Backend | No | Origen permitido (dominio del frontend) |

**En desarrollo**, las variables marcadas como "Sí" pueden tener valores placeholder.  
**En producción**, deben ser valores reales y mantenerse fuera del repositorio.

### 4.6. Cómo empezar desde cero (para un nuevo desarrollador)

```bash
# 1. Clonar el repo
git clone https://github.com/tu-usuario/tu-repo.git
cd ecommerce

# 2. Crear el archivo de entorno de desarrollo
cp .env.development .env

# 3. Editar según sea necesario (MongoDB local, credenciales S3 de prueba)
nano .env

# 4. Levantar con Docker
docker compose up -d
```

### 4.7. Cómo configurar producción en EC2

```bash
# 1. Conectarse a la instancia
ssh -i tu-clave.pem ubuntu@<ip-publica>

# 2. Clonar el repo
git clone https://github.com/tu-usuario/tu-repo.git ecommerce
cd ecommerce

# 3. Crear el archivo de producción con valores reales
#    IMPORTANTE: este paso es MANUAL. No hay comandos automáticos.
nano .env.production
# Pegar el contenido de .env.production del repo y reemplazar:
#   - MONGO_URI → cadena de Atlas
#   - JWT_SECRET → openssl rand -hex 64
#   - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY → credenciales IAM reales
#   - CORS_ORIGIN → URL de CloudFront

# 4. Verificar que el archivo no tenga errores de sintaxis
source .env.production && echo "OK"

# 5. Levantar con docker-compose
docker compose -f docker-compose.prod.yml up -d
```
