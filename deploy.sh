#!/bin/bash
# Mahar Shwe Exchange Website Deploy Script
# Run as root on VPS

set -e

DOMAIN="maharshwe.online"
WEB_ROOT="/var/www/maharshwe"
NGINX_CONF="/etc/nginx/sites-available/maharshwe"
NGINX_ENABLED="/etc/nginx/sites-enabled/maharshwe"

echo "=== Mahar Shwe Exchange Deployment ==="

# 1. Update system
echo "[1] Updating system packages..."
apt-get update
apt-get upgrade -y

# 2. Install Nginx
echo "[2] Installing Nginx..."
apt-get install -y nginx

# 3. Create web directory
echo "[3] Creating web directory..."
mkdir -p $WEB_ROOT
chown -R www-data:www-data $WEB_ROOT
chmod -R 755 $WEB_ROOT

# 4. Copy website files (assumes files are in /tmp/maharshwe)
echo "[4] Copying website files..."
if [ -d "/tmp/maharshwe" ]; then
    cp -r /tmp/maharshwe/* $WEB_ROOT/
else
    echo "Warning: /tmp/maharshwe not found. Please upload files manually."
fi

# 5. Create Nginx configuration
echo "[5] Creating Nginx configuration..."
cat > $NGINX_CONF <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root $WEB_ROOT;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 6. Enable site
echo "[6] Enabling Nginx site..."
ln -sf $NGINX_CONF $NGINX_ENABLED
nginx -t

# 7. Restart Nginx
echo "[7] Restarting Nginx..."
systemctl restart nginx

# 8. Firewall (if ufw is installed)
if command -v ufw &> /dev/null; then
    echo "[8] Configuring firewall..."
    ufw allow 'Nginx Full'
    ufw --force enable
fi

# 9. SSL setup suggestion
echo "[9] SSL Setup (Optional)"
echo "To enable HTTPS, run:"
echo "  apt-get install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "Then set up auto-renew:"
echo "  echo '0 12 * * * root certbot renew --quiet' >> /etc/crontab"

echo ""
echo "=== Deployment Complete ==="
echo "Website should be accessible at: http://$DOMAIN"
echo ""
echo "If you see default Nginx page, check:"
echo "1. DNS points $DOMAIN to $(hostname -I | awk '{print $1}')"
echo "2. Files are in $WEB_ROOT"
echo "3. Nginx config: $NGINX_CONF"
echo ""
echo "To upload files manually:"
echo "  scp -r dist/* root@$(hostname -I | awk '{print $1}'):$WEB_ROOT/"
echo ""
echo "=== IMPORTANT ==="
echo "Change your VPS password immediately:"
echo "  passwd"
echo "====================================="