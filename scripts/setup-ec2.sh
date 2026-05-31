#!/usr/bin/env bash
# ═══════════════════════════════════════════════
#  setup-ec2.sh — Configuración inicial de
#  una instancia EC2 (Ubuntu) para el backend
#  del E-commerce MERN.
#
#  Modo de uso:
#    1. Conectate por SSH a la instancia
#    2. Pegá y ejecutá este script bloque por
#       bloque, o corré todo el archivo:
#         bash setup-ec2.sh
# ═══════════════════════════════════════════════
set -euo pipefail

echo "========================================"
echo "  Inicio — Configuración de EC2"
echo "========================================"

# ─────────────────────────────────────────────
#  1. Actualizar el sistema e instalar Docker
# ─────────────────────────────────────────────

# Actualizar la lista de paquetes disponibles
sudo apt update

# Instalar Docker Engine desde los repos oficiales
sudo apt install -y docker.io

# Habilitar Docker para que arranque automáticamente
# al reiniciar la instancia
sudo systemctl enable docker

# Iniciar Docker ahora si no estaba corriendo
sudo systemctl start docker

# Agregar el usuario actual al grupo 'docker' para
# poder ejecutar comandos sin sudo
sudo usermod -aG docker "$USER"

# ─────────────────────────────────────────────
#  2. Instalar Docker Compose V2 (plugin)
# ─────────────────────────────────────────────

# Docker Compose V2 viene como plugin de Docker.
# En Ubuntu 22.04+ se instala con apt.
sudo apt install -y docker-compose-plugin

# Verificar que quedó instalado correctamente
docker compose version

# ─────────────────────────────────────────────
#  3. Clonar el repositorio y preparar el entorno
# ─────────────────────────────────────────────

# Clonar el proyecto (reemplazá la URL con la tuya)
git clone https://github.com/tu-usuario/ecommerce-mern.git
cd ecommerce-mern

# Verificar que docker-compose.prod.yml existe
ls -la docker-compose.prod.yml

# ─────────────────────────────────────────────
#  4. Crear el archivo de entorno de producción
# ─────────────────────────────────────────────
#
#  IMPORTANTE: .env.production está en .gitignore
#  y .dockerignore. Hay que crearlo a mano.
#  Copiá el contenido desde tu máquina local o
#  desde la documentación del proyecto.
#
#  Abrí nano y pegar los valores reales:
#    - MONGO_URI      → conexión de MongoDB Atlas
#    - JWT_SECRET     → openssl rand -hex 64
#    - AWS credenciales → IAM con permisos solo a S3
#    - CORS_ORIGIN    → URL de CloudFront
# -------------------------------------------------

# Crear el archivo .env.production vacío
touch .env.production

# Abrir el editor para completar las variables
nano .env.production

# ─────────────────────────────────────────────
#  5. Construir la imagen y levantar el backend
# ─────────────────────────────────────────────

# Construir la imagen Docker usando el Dockerfile
# y levantar los servicios en segundo plano.
# Docker Compose lee .env.production y lo inyecta
# como variables de entorno dentro del contenedor.
docker compose -f docker-compose.prod.yml up -d

# Verificar que el contenedor está corriendo
docker ps

# ─────────────────────────────────────────────
#  6. Probar que el servidor responde
# ─────────────────────────────────────────────

# Hacer una petición HTTP al health check.
# Debería devolver {"status":"ok",...}
curl -s http://localhost:5000/api/v1/health | head -c 200
echo ""

echo "========================================"
echo "  Configuración completada."
echo "  El backend está corriendo en :5000"
echo "========================================"
