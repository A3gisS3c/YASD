#!/bin/bash

set -e
exec > /dev/null

if [ "$(/usr/bin/id -u)" != "0" ]; then
	/usr/bin/echo "Need sudo permissions - abort installation" 1>&2
	exit 1
fi

if ! (/usr/bin/which node && /usr/bin/which apache2 && /usr/bin/which yarn && dpkg -l | grep libpam0g-dev); then
	/usr/bin/echo "Apache2 or Nodejs or npm or yarn or libpam0g-dev not installed - abort installation" 1>&2
	exit 1
fi


### Apache2
if [ ! -f /etc/apache2/sites-available/yasd.conf ]; then
	/usr/bin/echo "Creating Apache file in sites-available/" 1>&2
	/usr/bin/cp /opt/YASD/config/yasd-apache2.conf /etc/apache2/sites-available/yasd.conf
else
	/usr/bin/echo "Apache file in sites-available/ exists. Skipping" 1>&2
fi

if [ ! -f /etc/apache2/sites-enabled/yasd.conf ]; then
	/usr/bin/echo "Creating symlink in Apache sites-enabled/" 1>&2
	/usr/bin/ln -s /etc/apache2/sites-available/yasd.conf /etc/apache2/sites-enabled/
else
	/usr/bin/echo "Symlink in Apache sites-enabled/ exists. Skipping" 1>&2
fi

/usr/sbin/a2enmod rewrite
/usr/sbin/a2enmod ssl
/usr/sbin/a2enmod proxy
/usr/sbin/a2enmod headers

### YASD backend
if ! id "yasd" &>/dev/null; then
	/usr/bin/echo "Creating yasd user" 1>&2
	/usr/sbin/useradd yasd -s /usr/sbin/nologin
else
	/usr/bin/echo "Yasd user already exists. Skipping" 1>&2
fi
/usr/bin/mkdir -p /etc/yasd
if [ -z "$(ls -A /etc/yasd)" ]; then
	/usr/bin/echo "Copying configuration files in /etc/yasd/" 1>&2
	/usr/bin/cp /opt/YASD/config/yasd.conf /opt/YASD/config/yasdUI.conf /etc/yasd/
	/usr/bin/chmod -R 640 /etc/yasd
	SECRET=$(/usr/bin/openssl rand -hex 64)
	/usr/bin/sed -i "s/JWTSECRET/$SECRET/g" /etc/yasd/yasd.conf
else
	/usr/bin/echo "/etc/yasd/ folder not empty. Skipping copying configuration files" 1>&2
fi

### YASD frontend
/usr/bin/mkdir -p /var/www/yasd/
/usr/bin/echo "Installing dependencies" 1>&2
/usr/local/bin/yarn --cwd /opt/YASD/yasd-back install
/usr/local/bin/yarn --cwd /opt/YASD/yasd-front install
/usr/local/bin/yarn --cwd /opt/YASD/yasd-front build
/usr/bin/echo "Building project" 1>&2
if [ -z "$(ls -A /var/www/yasd/)" ]; then
	/usr/bin/cp -R /opt/YASD/yasd-front/dist /var/www/yasd/
	/usr/bin/chown -R www-data:www-data /var/www/yasd
fi

### Systemd
if [ ! -f /etc/systemd/system/yasd.service ]; then
	/usr/bin/echo "Creating yasd Systemd service" 1>&2
	/usr/bin/cp /opt/YASD/config/yasd.service /etc/systemd/system/yasd.service
	/usr/bin/systemctl daemon-reload
	/usr/bin/systemctl enable yasd.service
else
	/usr/bin/echo "Yasd Systemd service already exists. Skipping" 1>&2
fi

### Final echos
echo "#########################################################################################" 1>&2
echo "Installation finished" 1>&2
echo "Do not forget to edit Apache SSL (cert/key/server_name...) and systemctl reload Apache" 1>&2
echo "Do not forget to edit /etc/yasd/yasd.conf and systemctl start yasd" 1>&2
echo "Do not forget to install wazuh configuration files in wazuh-conf/ folder and to enable logcollector.remote_command inside each servers" 1>&2

