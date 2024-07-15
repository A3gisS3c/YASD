## Important Note
This project is inactively maintained. This means that I merge pull request for bug fixes and issues that can be easily integrated but I don't have the time to add new features or extend existing ones.

![Logo](/logo.png)
# YASD - Yet Another Security Dashboard
YASD serves as a user-friendly frontend for the EDR/SIEM Wazuh, specifically designed for lazy SOC analysts (^^). The goal is to provide a simplified and efficient interface that makes security operations more accessible and manageable.
This project is not meant to replace Kibana or Grafana (obviously), but is a way to show what a SIEM dashboard should look like from my perspective. 
Additionally, this dashboard adopts a group-based approach utilizing Wazuh groups to organize and manage data more effectively.

## Installation
To install this project on your local machine, follow these steps:

1. **Clone the repository**: 
2. **Navigate to the project directory**: cd YASD/
3. **Run the installation script**: chmod +x install.sh && ./install.sh

# Screenshots
Alerts >= 12 for all groups

![Screen](/screenshots/YASD1.png)

Alerts >= 6 for a specific group

![Screen](/screenshots/YASD2.png)

Connections made by user for a specific group. Only SSH/RDP connections are tracked.

![Screen](/screenshots/YASD3.png)

General view for servers in a specific group.

![Screen](/screenshots/YASD4.png)

Unlike Wazuh-dashboard, vulnerability are grouped by their package name.

![Screen](/screenshots/YASD5.png)

SCA view

![Screen](/screenshots/YASD6.png)

FIM view

![Screen](/screenshots/YASD7.png)

Active Directory Audit

![Screen](/screenshots/YASD8.png)

# License
YASD - Yet Another Sécurity Dashboard
Copyright (c) 2024 Bruno Bettuzzi

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see [http://www.gnu.org/licenses/](http://www.gnu.org/licenses/)




