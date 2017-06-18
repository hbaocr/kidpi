#!/bin/bash
echo "This generates the secret.key and the secret.pem."
echo "Send the secret.key file to your friend."
echo -e 'y\n'| ssh-keygen -N "" -f secret.key
ssh-keygen -f secret.key.pub -e -m PKCS8 > secret.pem
rm secret.key.pub
