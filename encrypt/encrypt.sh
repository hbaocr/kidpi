#!/bin/bash

echo "Encrypting contents of text.txt"
echo "You'll need the secret file to decrypt."

openssl rsautl -pubin -inkey secret.pem -encrypt -pkcs -in text.txt -out encrypted.txt

echo "Send encrypted.txt to your friend. They should have the file secret."
