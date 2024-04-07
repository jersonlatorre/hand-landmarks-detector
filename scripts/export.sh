#!/bin/bash

# Detener el script si ocurre un error
set -e

# Si hay cambios, proceder con el proceso de compilación, add, commit, y push
echo "Compilando..."
node_modules/.bin/parcel build ./src/hand-tracker.js --dist-dir ./dist

# Envía el archivo compilado a /Users/uno/Desktop/blazepose-html
echo "Enviando archivo compilado a /Users/uno/Desktop/handpose-html..."
cp ./dist/hand-tracker.js /Users/uno/Desktop/handpose-html/hand-tracker.js

echo "Listo!"