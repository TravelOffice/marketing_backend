#!/bin/bash

# ./create_service.sh --project-dir /path/to/dir --service-name serviceA --model User
args=$(getopt -l "project-dir:,service-name:,model:" -o "n" -- "$@")
eval set -- "$args"
while [ $# -ge 1 ]; do
  case "$1" in
    --)
      # No more options left.
      shift
      break
      ;;
    --project-dir)
      PROJECT_DIR="$2"
      shift
      ;;
    --service-name)
      SERVICE_NAME="$2"
      shift
      ;;
    --model)
      MODEL="$2"
      shift
      ;;
    -h)
      echo "create_service.sh --project-dir /path/to/dir --service-name [SERVICENAME] --model [MODEL].\nFor example: create_service.sh --project-dir ./src/modules/ --service-name serviceA --model User"
      exit 0
      ;;
  esac
  shift
done

if [[ -z "${PROJECT_DIR}" ]]; then
  echo "Missing --project-dir option!"
  exit 1;
elif [[ -z "${SERVICE_NAME}" ]]; then
  echo "Missing --service-name option!"
  exit 1;
elif [[ -z "${MODEL}" ]]; then
  echo "Missing --model option!"
  exit 1;
fi

VERSION=1.0.1
ZIP_FILE=${PROJECT_DIR}/${SERVICE_NAME}.zip
wget https://github.com/thaitv21/template-service/archive/refs/tags/${VERSION}.zip -O ${ZIP_FILE}
rm -rf ${PROJECT_DIR}/template-service-${VERSION}/
unzip ${ZIP_FILE} -d ${PROJECT_DIR}
rm ${ZIP_FILE}

# Replace Modelname in files
FILES_NEED_TO_REPLACE=$(grep -r ${PROJECT_DIR}/template-service-${VERSION}/ -e 'ModelName' | cut -d ':' -f1)
for f in ${FILES_NEED_TO_REPLACE}
do
  sed -i "s/ModelName/${MODEL}/g" ${f}
  sed -i "s/modelName/${MODEL,}/g" ${f}
done

# Rename files
FILES_NEED_TO_RENAME=$(find ${PROJECT_DIR}/template-service-${VERSION}/ -name '*ModelName*')
for f in ${FILES_NEED_TO_RENAME}
do
  mv ${f} ${f/ModelName/"${MODEL}"}
done

cd 