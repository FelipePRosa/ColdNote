# Create Mac EC2

Create Dedicated Hosts on EC2
Create instance with dedicated host

Open terminal

navigate to key par .pem

ssh -i "ios_admin_user.pem" root@ec2-54-158-216-72.compute-1.amazonaws.com

sudo passwd ec2-user

sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -activate -configure -access -on -clientopts -setvnclegacy -vnclegacy yes -clientopts -setvncpw -vncpw password1 -restart -agent -privs -all

enable Port 5900 on safety group

download RealVNC

id public IPV4: 54.158.216.72

username: ec2-user
password: Innovation@2024