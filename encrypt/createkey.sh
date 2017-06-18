#!/bin/bash

echo -e 'y\n'| ssh-keygen -N "" -f secret
ssh-keygen -f secret.pub -e -m PKCS8 > secret.pem
