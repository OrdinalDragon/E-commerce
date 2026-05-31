#!/usr/bin/env bash
# ═══════════════════════════════════════════════
#  ec2-maintenance.sh — Comandos útiles para el
#  día a día del backend en EC2.
#
#  Este script NO hace nada automático.
#  Son comandos de referencia para copiar/pegar
#  cuando necesites revisar el servidor.
# ═══════════════════════════════════════════════

echo "========================================"
echo "  Comandos de mantenimiento — EC2"
echo "  (Ejecutalos manualmente según necesites)"
echo "========================================"

# ─────────────────────────────────────────────
#  Ver el estado de los contenedores
# ─────────────────────────────────────────────
echo ""
echo "# Listar contenedores activos:"
echo "docker ps"
echo ""
echo "# Listar todos los contenedores (incluye los detenidos):"
echo "docker ps -a"
echo ""
echo "# Ver el uso de recursos de cada contenedor:"
echo "docker stats --no-stream"
echo ""

# ─────────────────────────────────────────────
#  Ver los logs del backend en tiempo real
# ─────────────────────────────────────────────
echo "# Ver logs del backend a medida que llegan:"
echo "docker compose -f docker-compose.prod.yml logs -f app"
echo ""
echo "# Ver solo las últimas 50 líneas y salir:"
echo "docker compose -f docker-compose.prod.yml logs --tail=50 app"
echo ""

# ─────────────────────────────────────────────
#  Ver logs de MongoDB
# ─────────────────────────────────────────────
echo "# Ver logs de la base de datos:"
echo "docker compose -f docker-compose.prod.yml logs -f mongo"
echo ""

# ─────────────────────────────────────────────
#  Reiniciar el backend sin bajar MongoDB
# ─────────────────────────────────────────────
echo "# Reiniciar solo el contenedor de la API:"
echo "docker compose -f docker-compose.prod.yml restart app"
echo ""

# ─────────────────────────────────────────────
#  Apagar todo (API + base de datos)
# ─────────────────────────────────────────────
echo "# Detener todos los servicios:"
echo "docker compose -f docker-compose.prod.yml down"
echo ""

# ─────────────────────────────────────────────
#  Reconstruir la imagen y volver a levantar
#  (útil después de un git pull con cambios)
# ─────────────────────────────────────────────
echo "# Bajar, reconstruir la imagen y levantar de nuevo:"
echo "docker compose -f docker-compose.prod.yml up -d --build"
echo ""

# ─────────────────────────────────────────────
#  Actualizar el código desde GitHub
# ─────────────────────────────────────────────
echo "# Traer los últimos cambios del repositorio:"
echo "git pull origin main"
echo ""

# ─────────────────────────────────────────────
#  Ciclo completo: actualizar + reconstruir
# ─────────────────────────────────────────────
echo "# Actualizar código, reconstruir y reiniciar:"
echo "git pull origin main && docker compose -f docker-compose.prod.yml up -d --build"
echo ""

echo "========================================"
echo "  Tips adicionales"
echo "========================================"
echo ""
echo "# Entrar al contenedor de la API:"
echo "docker exec -it ecommerce-api sh"
echo ""
echo "# Ver variables de entorno dentro del contenedor:"
echo "docker exec ecommerce-api env"
echo ""
echo="# Ver el espacio usado por Docker:"
echo "docker system df"
