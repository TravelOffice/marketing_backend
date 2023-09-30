#!/bin/bash
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 SERVICENAME" >&2
  exit 1
fi

CUR_DIR=$(pwd)
SERVICENAME=${1}
SERVICE_DIR=${CUR_DIR}/src/modules/${SERVICENAME}

if ! [[ $(which npm) ]] ; then
  echo 'npm is not installed!. Please install Node 14+' >&2
  exit 1
fi

if ! [[ $(which nodemon) ]] ; then
  echo 'nodemon is not installed!. Please install nodemon: npm install -g nodemon' >&2
  exit 1
fi

echo "Starting service ${SERVICENAME}..."

# Build dependencies
# Set the default value of the flag variable
has_installed_option=false

# Iterate through the command-line arguments
for arg in "$@"; do
    case $arg in
        --installed)
            has_installed_option=true
            ;;
        *)
            echo "$arg"
            ;;
    esac
done
# Check the value of the flag variable
if [ "$has_installed_option" = true ]; then
    echo "The --installed option was passed. Skip install dependencies"
else
    ${CUR_DIR}/scripts/build_dependencies.sh
fi

cd ${SERVICE_DIR}
yarn install --ignore-optional
nodemon app.local.ts
