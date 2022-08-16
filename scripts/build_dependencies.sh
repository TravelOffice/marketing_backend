#!/bin/bash

POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    --production)
      PRODUCTION="true"
      shift # past argument
      ;;
    -|--)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1") # save positional arg
      shift # past argument
      ;;
  esac
done

CUR_DIR=$(pwd)
echo "Building dependencies..."
DEPENDENCIES_DIR=${CUR_DIR}/src/libs
cd ${DEPENDENCIES_DIR}
LIBS_DIR=$(ls -d */ | cut -f1 -d'/')
PRE_BUILD_DEPENDENCIES="aws-sdk common-models get-env"

build_lib() {
  dir=${1}
  echo "Building dependency ${dir}..."
  echo ${DEPENDENCIES_DIR}/${dir}
  cd ${DEPENDENCIES_DIR}/${dir}
  rm -rf node_modules
  if [ "${PRODUCTION}" == "true" ]; then
    echo "Build for production ${dir}"
    yarn install --production
  else
    yarn install
    yarn build
  fi
}

for dir in ${PRE_BUILD_DEPENDENCIES}
do
  build_lib ${dir}
done
cd ${CUR_DIR}

for dir in ${LIBS_DIR}
do
  if [[ "${PRE_BUILD_DEPENDENCIES}" != *"${dir}"* ]]; then
    build_lib ${dir}
  fi
done
cd ${CUR_DIR}
