#!/bin/bash

echo "Make sure you've received encrypted.txt and the secret.key file."
openssl rsautl -inkey secret.key -decrypt -in encrypted.txt -out results.txt
echo "You now have a file called: results.txt"
echo "That is the secret message."
