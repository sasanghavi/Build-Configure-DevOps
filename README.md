#DevOps Homework 1 
[Overview of AWS] (#overview-of-amazon-web-service)    |   [Overview of DigitalOcean] (#overview-of-digitalocean)    |   [Homework](#homework)   |  [Requirements](#requirements)   |   [Running the script](#running-the-script)   |  [ScreenCast](#screencast)    

##Overview of Amazon Web Service 

Amazon Web Services is a platform offering cloud services. Amazon Elastic Compute Cloud **(EC2)** is a service by Amazon which lets the customers purchase affordable computing resources without investing the actual cost of the hardware. 

Amazon has provided webconsole, a GUI solution for creating and managing these resources. 

EC2 apis were used for the implementation of this assignment with the help of NodeJS. Here are some helpful links for us devs:

* http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-intro.html
* http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
* http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html
* http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#instanceRunning-waiter
* https://console.aws.amazon.com

##Overview of DigitalOcean

Digital Ocean is a simple and elegant solution which offers cloud services 

Their API documentation and Tutorials and the ease of use of the console is one of their usps 
ere are some helpful links for us devs:
* https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ansible-on-ubuntu-14-04
* https://www.digitalocean.com/community/tutorials/how-to-create-ansible-playbooks-to-automate-system-configuration-on-ubuntu
* https://github.com/CSC-DevOps/Course/blob/master/Workshops/CM.md


##Homework
### Provisioning and Configuring servers

####Requirements 

1. Install Node.JS, npm
2. Install ansible in your host machine.
3. Create a keypair on your host machine and import the public key on DigitalOcean and AWS.
4. For AWS - add tokens to your environment variables and name them as `aws_access_key_id`, `aws_secret_access_key` and `AWSSshKeyPath` where KeyId, Secret Access key can be accessed from (https://console.aws.amazon.com/iam/home?region=<YOUR REGION>#security_credential) and add the path to the private key obtained from (https://<YOUR REGION>console.aws.amazon.com/ec2/v2/home?region=<YOUR REGION>#KeyPairs:sort=keyName)
5. Ensure that the private key you download only has read property : `chmod 400 *.pem`
5. Also, go to your security groups and update the default group's inbound rule to Type - All Traffic and Source - Anywhere
6. Do the same by adding env variables for Digital Ocean -  `DigitalOceanToken` and `SshKeyPath`

#### Running the script
0. Add executable permission to hw1.sh `chmod a+x hw1.sh`
1. Run `./hw1.sh` on your terminal
2. Go to browser consoles for both providers and copy the (public) ipAddress to check if nginx is installed

