#!/bin/bash

npm install
cd client
rm -rf package-lock.json
npm install
npm start
