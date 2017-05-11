#! /bin/bash

wget https://nodejs.org/dist/v6.10.1/node-v6.10.1-linux-armv6l.tar.xz
sleep 5s
echo "Done pulling tar."

tar xvf node-v6.10.1-linux-armv6l.tar.xz

sleep 5s
echo "Done untar."

cd node-v6.10.1-linux-armv6l
sudo cp -R bin/* /usr/bin/

sleep 5s
echo "Done copy"
sudo cp -R lib/* /usr/lib/

sudo apt-get update && sudo apt-get upgrade
