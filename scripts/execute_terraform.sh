#!/bin/sh
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 ENVIRONMENTNAME[ 'dev' | 'prod' ] [TERRA_FORM_COMMAND]" >&2
  exit 1
fi

CUR_DIR=$(pwd)
ENV=${1}
shift
TF_COMAND=${@}

if [ "${ENV}" != "dev" ] && [ "${ENV}" != "prod" ]; then
  echo "Usage: $0 ENVIRONMENTNAME[ 'dev' | 'prod' ] [TERRA_FORM_COMMAND]" >&2
  exit 1
fi

if ! command -v terraform &> /dev/null
then
  echo "terraform command could not be found. Please activate it!"
  exit
fi

cd ./environments/${ENV}
ln -sf ../../main.tf .
ln -sf ../../output.tf .
cd ${CUR_DIR}

echo "Running terraform -chdir=./environments/${ENV} ${TF_COMAND}"
terraform -chdir="./environments/${ENV}" ${TF_COMAND}
