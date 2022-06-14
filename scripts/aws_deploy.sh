#!/bin/bash
printHelp() {
  echo "Usage: $0 ENVIRONMENTNAME[ 'dev' | 'prod' ] SERVICENAME [ 'deploy' | 'destroy' ]" >&2
}

if [ "$#" -lt 3 ]; then
  printHelp
  exit 1
fi

CUR_DIR=$(pwd)
ENV=${1}
TF_BUCKET=${2}
SERVICENAME=${3}
ACTION=${4}
TMP_DIR=${CUR_DIR}/temp

if [ "${ENV}" != "dev" ] && [ "${ENV}" != "prod" ]; then
  printHelp
  exit 1
fi

if [ "${ACTION}" != "deploy" ] && [ "${ACTION}" != "destroy" ]; then
  printHelp
  exit 1
fi

if [ -z ${ACTOR_NAME} ]; then
  echo "Missing ACTOR_NAME"
  exit 1
fi

if [ -z ${PR_NUMBER} ]; then
  echo "Missing PR_NUMBER"
  exit 1
fi

# Input app.post('/leads', ......
# Output [ path method]
CUR_METHOD=
CUR_PATH=
getRestParams() {
  CUR_METHOD=
  CUR_PATH=
  # Get the method
  raw_api=${1}
  raw_method=$(echo ${raw_api} | grep -ow "^app.*(" | sed -E 's/app.|\(//g')
  if [ ! -z "$raw_method" ]
  then
    CUR_METHOD=${raw_method}
  fi
  raw_api=$(echo ${raw_api} | grep -ow "'/.*'" | sed -E "s/'//g")
  if [ ! -z "$raw_method" ]
  then
    arrPATH=(${raw_api//\// })
    ## get length of $arrPATH array
    len=${#arrPATH[@]}
    CUR_PATH="/${arrPATH[0]}"
    for (( i=1; i<$len; i++ )); do
      path_element="${arrPATH[$i]}";
      if [[ "$path_element" == ":"* ]]; then
        path_element="{$(echo ${path_element} | sed -E "s/://g")}"
      fi
      CUR_PATH="${CUR_PATH}/${path_element}"
    done
  fi
}

LAMBDA_PACKAGE_NAME="function_${SERVICENAME}"
LAMBDA_LAYER_PACKAGE_NAME="layer_${SERVICENAME}"

if [ ! -f "${TMP_DIR}/${LAMBDA_LAYER_PACKAGE_NAME}.zip" ]; then
    echo "${LAMBDA_LAYER_PACKAGE_NAME} not exists."
    exit 1
fi
if [ ! -f "${TMP_DIR}/${LAMBDA_PACKAGE_NAME}.zip" ]; then
    echo "${LAMBDA_PACKAGE_NAME} not exists."
    exit 1
fi

rm -rf  ${TMP_DIR}/*.tf
cp -r ${CUR_DIR}/scripts/aws_deploy/* ${TMP_DIR}/
cp -r ${CUR_DIR}/infrastructures/modules/tf_remote_state ${TMP_DIR}/

cd ${TMP_DIR}

sed -i "s/ENV_VALUE/${ENV}/g" ${TMP_DIR}/state.tf
sed -i "s/TF_BUCKET_VALUE/${TF_BUCKET}/g" ${TMP_DIR}/state.tf
sed -i "s/PR_NUMBER_VALUE/${PR_NUMBER}/g" ${TMP_DIR}/state.tf
sed -i "s/ENV_VALUE/${ENV}/g" ${TMP_DIR}/vars.tf
sed -i "s/LAMBDA_PATH_VALUE/${LAMBDA_PACKAGE_NAME}.zip/g" ${TMP_DIR}/vars.tf
sed -i "s/LAMBDA_FUNCTION_NAME_VALUE/${SERVICENAME}/g" ${TMP_DIR}/vars.tf
sed -i "s/LAMBDA_LAYER_PATH_VALUE/${LAMBDA_LAYER_PACKAGE_NAME}.zip/g" ${TMP_DIR}/vars.tf
sed -i "s/NAME_POST_FIX_VALUE/${ACTOR_NAME}/g" ${TMP_DIR}/vars.tf

# Get the lambda env
LAMBDA_VAR_FILE=${TMP_DIR}/lambda_env.tf
LAMBDA_ENV=$(grep -vE "NODE_ENV|PORT|AWS_REGION" ${CUR_DIR}/src/modules/${SERVICENAME}/.env.development)
cat <<EOF >  ${LAMBDA_VAR_FILE}
variable "LAMBDA_ENV" {
  description = "Addition lambda environments"
  default = {
EOF

for var in ${LAMBDA_ENV}; do
  arrVAR=(${var//=/ })
  leftVAR=${arrVAR[0]}
  rightVAR=${arrVAR[1]}
  echo "    ${leftVAR} = \"${rightVAR}\"" >> ${LAMBDA_VAR_FILE}
done

cat <<EOF >>  ${LAMBDA_VAR_FILE}
  }
}
EOF

# Get the rest api information
REST_API_FILE=${TMP_DIR}/api.tf
RAW_APIS=$(grep -rE "^app" ${CUR_DIR}/src/modules/${SERVICENAME}/app.ts | grep -vE "app.use")

cat <<EOF >  ${REST_API_FILE}
variable "API_ENDPOINTS" {
  default = {
EOF

declare -A new_api_map
for api in ${RAW_APIS}; do
  getRestParams ${api}
  if [ ! -z "${CUR_METHOD}" ]
  then
    if [ ! -z "${new_api_map[${CUR_PATH}]}" ]
    then
      new_api_map[${CUR_PATH}]="${new_api_map[${CUR_PATH}]} ${CUR_METHOD}"
    else
      new_api_map[${CUR_PATH}]=${CUR_METHOD}
    fi
  fi
done;

for key in ${!new_api_map[@]};do
  echo "    \"${key}\" = {" >>  ${REST_API_FILE}
  for method in ${new_api_map[$key]}; do
    METHOD=$(echo $method | tr 'a-z' 'A-Z')
    echo "      \"${METHOD}\" = {}," >>  ${REST_API_FILE}
  done
  echo "    }," >>  ${REST_API_FILE}
done

cat <<EOF >>  ${REST_API_FILE}
  }
}
EOF

terraform init -reconfigure

if [ "${ACTION}" == "deploy" ]; then
  terraform apply -auto-approve
fi
if [ "${ACTION}" == "destroy" ]; then
  terraform destroy -auto-approve
fi
