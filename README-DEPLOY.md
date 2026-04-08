# Mahar Shwe Exchange - Deployment Guide

## Files Ready
- `dist/` - Production website files
- `deploy.sh` - Deployment script

## Quick Deploy Steps

### 1. Upload files to VPS
```bash
# From your local machine
scp -r dist/* root@134.209.105.252:/tmp/maharshwe/
scp deploy.sh root@134.209.105.252:/root/
```

### 2. SSH into VPS
```bash
ssh root@134.209.105.252
```

### 3. Run deploy script
```bash
cd /root
chmod +x deploy.sh
./deploy.sh
```

### 4. Upload website files (if not done in step 1)
```bash
# If files are on your local machine
scp -r dist/* root@134.209.105.252:/var/www/maharshwe/
```

### 5. Setup SSL (Optional but recommended)
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d maharshwe.online -d www.maharshwe.online
```

## Manual Setup (if script fails)

### Install Nginx
```bash
apt-get update
apt-get install -y nginx
```

### Create web directory
```bash
mkdir -p /var/www/maharshwe
chown -R www-data:www-data /var/www/maharshwe
chmod -R 755 /var/www/maharshwe
```

### Copy website files
```bash
cp -r /tmp/maharshwe/* /var/www/maharshwe/
```

### Create Nginx config
Create `/etc/nginx/sites-available/maharshwe`:
```nginx
server {
    listen 80;
    server_name maharshwe.online www.maharshwe.online;
    root /var/www/maharshwe;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Enable site
```bash
ln -s /etc/nginx/sites-available/maharshwe /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Post-Deployment

### 1. Change VPS password (CRITICAL)
```bash
passwd
```

### 2. Setup auto-update (bot fetch)
Create a cron job to fetch rates daily:
```bash
# Example: Run at 9 AM daily
echo "0 9 * * * root /path/to/fetch-rates.sh" >> /etc/crontab
```

### 3. Monitor logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Website not loading
1. Check Nginx status: `systemctl status nginx`
2. Check config: `nginx -t`
3. Check files: `ls -la /var/www/maharshwe/`

### Default Nginx page shows
1. Disable default site: `rm /etc/nginx/sites-enabled/default`
2. Restart Nginx: `systemctl restart nginx`

### DNS not pointing
Make sure `maharshwe.online` DNS A record points to `134.209.105.252`

## Security Checklist
- [ ] Change VPS password
- [ ] Setup firewall (ufw)
- [ ] Enable SSL (HTTPS)
- [ ] Regular system updates
- [ ] Bot token changed (if leaked)

## Contact
For issues, contact: Telegram @Mylifemychoice68