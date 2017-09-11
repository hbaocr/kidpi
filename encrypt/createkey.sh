#!/bin/bash
echo "This generates the secret.key and the secret.pem."
echo "Send the secret.key file to your friend."
echo ""
echo -e 'y\n'| ssh-keygen -N "" -f secret.key 2>&1 > /dev/null
ssh-keygen -f secret.key.pub -e -m PKCS8 > secret.pem
echo ""
echo "Now put the secret in a file named text.txt"


