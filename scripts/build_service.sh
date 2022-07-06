#!/bin/bash
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 ENVIRONMENTNAME[ 'dev' | 'prod' ] SERVICENAME" >&2
  exit 1
fi

CUR_DIR=$(pwd)
ENV=${1}

if [ "${ENV}" != "dev" ] && [ "${ENV}" != "prod" ]; then
  echo "Usage: $0 ENVIRONMENTNAME[ 'dev' | 'prod' ] SERVICENAME" >&2
  exit 1
fi

if ! [[ $(which npm) ]] ; then
  echo 'npm is not installed!. Please install Node 14+' >&2
  exit 1
fi

if ! [[ $(which tsc) ]] ; then
  echo 'tsc is not installed!. Please install typescript:' >&2
  echo 'npm install -g typescript' >&2
  exit 1
fi

# Build dependencies
echo "Building dependencies"
cd ${CUR_DIR}
./scripts/build_dependencies.sh

SERVICENAME=$2
SERVICE_DIR=${CUR_DIR}/src/modules/${SERVICENAME}
# Build service
echo "Build service ${SERVICENAME}..."
cd ${SERVICE_DIR}
if [ ! -f "package.json" ]; then
  echo "Missing requirement for ${ENV}!" >&2
  return 1
fi
rm -rf ${SERVICE_DIR}/dist
rm -rf ${SERVICE_DIR}/node_modules
rm -rf ${SERVICE_DIR}/package-lock.json
npm install
echo "Install successfully"
npm run build || exit 0
echo "Build"

retVal=$?
if [ $retVal -ne 0 ]; then
    echo "Service ${SERVICENAME} lint check failed!"
    exit $retVal
fi

rm -rf ${SERVICE_DIR}/node_modules
rm -rf ${SERVICE_DIR}/package-lock.json
echo "Install production dependencies"
npm install --production
echo "Finished installing production"
LAYER_DIR=${CUR_DIR}/src/layers/${SERVICENAME}/nodejs
mkdir -p ${LAYER_DIR}
cd ${LAYER_DIR}
rm -rf *
echo "Prepare link ${LAYER_DIR}"
ln -sf ../../../modules/${SERVICENAME}/node_modules .
echo "Link layer successfully"
cd $CUR_DIR

# Clean aws-sdk
cd ${CUR_DIR}/src/libs/aws-sdk
rm -rf node_modules
npm install --production

echo "Zipping function and layer..."
mkdir -p ${CUR_DIR}/temp
rm -rf ${CUR_DIR}/temp/*
cd ${SERVICE_DIR}/dist
zip -rqX ${CUR_DIR}/temp/function_${SERVICENAME}.zip .
cd ${CUR_DIR}/src/layers/${SERVICENAME}
zip -rqX ${CUR_DIR}/temp/layer_${SERVICENAME}.zip .
echo "Done!"
echo "Output: ${CUR_DIR}/temp"
