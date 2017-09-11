#!/bin/bash

sudo apt-get install -y lirc
sudo echo lirc_dev >> /etc/modules
sudo echo "lirc_rpi gpio_in_pin=23 gpio_out_pin=22" >> /etc/modules

sudo cp h.conf /etc/lirc/hardware.conf

sudo /etc/init.d/lirc stop
sudo /etc/init.d/lirc start

sudo chmod a+w /boot/config.txt
sudo echo "dtoverlay=lirc-rpi,gpio_in_pin=23,gpio_out_pin=22" >> /boot/config.txt
sudo chmod a-w /boot/config.txt

sudo cp lircrc /etc/lirc/lircrc

