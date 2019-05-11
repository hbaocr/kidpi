#! /bin/bash

wget https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-armv7l.tar.xz
sleep 5s
echo "Done pulling tar."

tar xvf node-v10.15.3-linux-armv7l.tar.xz

sleep 5s
echo "Done untar."

cd node-v10.15.3-linux-armv7l
sudo cp -R bin/* /usr/bin/

sleep 5s
echo "Done copy"
sudo cp -R lib/* /usr/lib/

sudo apt-get update && sudo apt-get upgrade
