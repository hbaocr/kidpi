#!/bin/bash

IP=$(curl https://theamackers.com/ip)
echo $IP
/usr/bin/ssh -NT -i ~/.ssh/id_rsa -R 4700:localhost:22 -p 2200 -o ExitOnForwardFailure=yes pi@$IP 
