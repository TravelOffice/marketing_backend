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
${CUR_DIR}/scripts/build_dependencies.sh

cd ${SERVICE_DIR}
yarn install
nodemon app.local.ts
