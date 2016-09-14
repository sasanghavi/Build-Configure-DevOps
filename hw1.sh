#!/bin/bash
# Bash script for server provisioning and configuration
# The script first installs the required dependencies and then performs necessary tasks for
# spinning up VMs and installing nginx with the help of ansible playbook.
echo "==================================================="
echo "Please view requirements.txt first before we continue"
cat requirements.txt
sleep 4
echo "==================================================="
echo "Installing dependencies from package.json"
npm install
echo "Installed needle, aws-sdk and dateFormat packages"
echo "==================================================="
echo "==================================================="
sleep 1
echo "Creating an instance on AWS and writing to inventory file"
node aws.js
echo "==================================================="
echo "==================================================="
sleep 1
echo "Creating an instance on DigitalOcean and appending to inventory file"
node do.js
echo "==================================================="
echo "==================================================="
sleep 5
echo "Lets run the ping test to make sure we can actually talk to the nodes"
ansible all -m ping -i inventory -vvvv
echo "==================================================="
echo "==================================================="
echo "Playing the ansible playbook."
ansible-playbook -i inventory --sudo ansible-playbook.yml
echo "Playbook executed successfully."
echo "==================================================="
