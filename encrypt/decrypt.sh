#!/bin/bash

echo "Make sure you've received encrypted.txt and the secret file."

openssl rsautl -inkey secret -decrypt -in encrypted.txt -out results.txt
