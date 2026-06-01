#!/usr/bin/env bash
# ═══════════════════════════════════════════════
#  backup-mongo.sh — Backup diario de MongoDB a S3
#  Se conecta a Mongo desde el host usando mongosh
#  dentro del contenedor.
# ═══════════════════════════════════════════════
set -euo pipefail

S3_BUCKET="ecommerce-frontend-jes"
S3_PREFIX="backups/mongo"
DATE=$(date +%Y-%m-%d_%H%M)
BACKUP_FILE="mongo-backup-${DATE}.tar.gz"
MONGO_URI="${MONGO_URI:-mongodb://ecommerce-mongo:27017/ecommerce}"

echo "[$(date)] Starting MongoDB backup..."

docker exec ecommerce-mongo mongodump \
  --uri="$MONGO_URI" \
  --archive \
  --gzip \
  > "/tmp/$BACKUP_FILE"

aws s3 cp "/tmp/$BACKUP_FILE" "s3://$S3_BUCKET/$S3_PREFIX/$BACKUP_FILE"

rm -f "/tmp/$BACKUP_FILE"

echo "[$(date)] Backup uploaded: s3://$S3_BUCKET/$S3_PREFIX/$BACKUP_FILE"

echo "[$(date)] Removing backups older than 7 days..."
aws s3 ls "s3://$S3_BUCKET/$S3_PREFIX/" | while read -r line; do
  key=$(echo "$line" | awk '{print $4}')
  date_str=$(echo "$line" | awk '{print $1" "$2}')
  ts=$(date -d "$date_str" +%s 2>/dev/null || echo 0)
  now=$(date +%s)
  diff=$(( (now - ts) / 86400 ))
  if [ "$diff" -gt 7 ]; then
    aws s3 rm "s3://$S3_BUCKET/$S3_PREFIX/$key"
    echo "  Removed: $key"
  fi
done

echo "[$(date)] MongoDB backup completed."
