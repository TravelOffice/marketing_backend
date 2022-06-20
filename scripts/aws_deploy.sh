#!/bin/bash
printHelp() {
  echo "Usage:"
  echo 'export CHANGED_SERVICES="xxx yyy"'
  echo 'export ACTOR_NAME='
  echo 'export PR_NUMBER='
  echo 'export TF_BUCKET='
  echo "$0 ENVIRONMENTNAME[ 'dev' | 'prod' ] DEPLOYACTION[ 'deploy' | 'destroy' ]" >&2
}

if [ "$#" -lt 2 ]; then
  printHelp
  exit 1
fi

CUR_DIR=$(pwd)
ENV=${1}
ACTION=${2}

if [ "${ENV}" != "dev" ] && [ "${ENV}" != "prod" ]; then
  printHelp
  exit 1
fi

if [ "${ACTION}" != "deploy" ] && [ "${ACTION}" != "destroy" ]; then
  printHelp
  exit 1
fi

if [ -z ${TF_BUCKET} ]; then
  echo "Missing TF_BUCKET"
  exit 1
fi

if [ -z "${CHANGED_SERVICES}" ]; then
  echo "Missing CHANGED_SERVICES"
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

DEPLOY_DIR=${CUR_DIR}/deploy2aws/environments/${ENV}
mkdir -p ${DEPLOY_DIR}

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

rm -rf  ${DEPLOY_DIR}/*.tf
cp -r ${CUR_DIR}/scripts/aws_deploy/* ${DEPLOY_DIR}/
cp -r ${CUR_DIR}/infrastructures/modules/tf_remote_state ${DEPLOY_DIR}/

cd ${DEPLOY_DIR}

sed -i "s/ENV_VALUE/${ENV}/g" ${DEPLOY_DIR}/state.tf
sed -i "s/TF_BUCKET_VALUE/${TF_BUCKET}/g" ${DEPLOY_DIR}/state.tf
sed -i "s/PR_NUMBER_VALUE/${PR_NUMBER}/g" ${DEPLOY_DIR}/state.tf

sed -i "s/ENV_VALUE/${ENV}/g" ${DEPLOY_DIR}/vars.tf
sed -i "s/TF_BUCKET_VALUE/${TF_BUCKET}/g" ${DEPLOY_DIR}/vars.tf
sed -i "s/NAME_POST_FIX_VALUE/${ACTOR_NAME}-pr${PR_NUMBER}/g" ${DEPLOY_DIR}/vars.tf

SERVERLES_DEF_FILE=${DEPLOY_DIR}/serverless.tf

# Define the layer
cat <<EOF >  ${SERVERLES_DEF_FILE}
variable "LAMBDA_LAYERS" {
  default = {
EOF

for SERVICENAME in ${CHANGED_SERVICES}; do
  echo "    ${SERVICENAME} = {" >> ${SERVERLES_DEF_FILE}
  echo "      path = \"src/layers/${SERVICENAME}\"" >>  ${SERVERLES_DEF_FILE}
  echo "    }," >> ${SERVERLES_DEF_FILE}
done

cat <<EOF >>  ${SERVERLES_DEF_FILE}
  }
}
EOF

# Define the lambda function
cat <<EOF >>  ${SERVERLES_DEF_FILE}
variable "LAMBDA_FUNCTIONS" {
  default = {
EOF

for SERVICENAME in ${CHANGED_SERVICES}; do
cat <<EOF >>  ${SERVERLES_DEF_FILE}
    "${SERVICENAME}" = {
      path     = "src/modules/${SERVICENAME}/dist"
      memory_size = 512
      layers   = ["${SERVICENAME}"]
      env_vars = "${SERVICENAME}"
      permission = {
        custom_policies = [
          "LambdaStandardRole",
          "SecretManagerRead",
          "DynamoTableReadWrite"
        ]
        aws_policies    = []
      },
    },
EOF
done

cat <<EOF >>  ${SERVERLES_DEF_FILE}
  }
}
EOF

# Define the rest api information
cat <<EOF >>  ${SERVERLES_DEF_FILE}
variable "API_ENDPOINTS" {
  default = {
EOF

for SERVICENAME in ${CHANGED_SERVICES}; do
  RAW_APIS=$(grep -rE "^app" ${CUR_DIR}/src/modules/${SERVICENAME}/app.ts | grep -vE "app.use")

  declare -A new_api_map=()
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
    echo "    \"${key}\" = {" >>  ${SERVERLES_DEF_FILE}
    for method in ${new_api_map[$key]}; do
      METHOD=$(echo $method | tr 'a-z' 'A-Z')
      echo "      \"${METHOD}\" = {" >>  ${SERVERLES_DEF_FILE}
      echo "        lambda_name   = \"${SERVICENAME}\"" >>  ${SERVERLES_DEF_FILE}
      echo "        authorization = false" >>  ${SERVERLES_DEF_FILE}
      echo "      }" >>  ${SERVERLES_DEF_FILE}
    done
    echo "    }," >>  ${SERVERLES_DEF_FILE}
  done

done

cat <<EOF >>  ${SERVERLES_DEF_FILE}
  }
}
EOF

# Define the lambda env
cat <<EOF >>  ${SERVERLES_DEF_FILE}
variable "LAMBDA_ENV" {
  default = {
EOF

for SERVICENAME in ${CHANGED_SERVICES}; do
  LAMBDA_ENV=$(grep -vE "NODE_ENV|PORT|AWS_REGION" ${CUR_DIR}/src/modules/${SERVICENAME}/.env.development)
  echo "    ${SERVICENAME} = {" >> ${SERVERLES_DEF_FILE}

  for var in ${LAMBDA_ENV}; do
    arrVAR=(${var//=/ })
    leftVAR=${arrVAR[0]}
    rightVAR=${arrVAR[1]}
    echo "      ${leftVAR} = \"${rightVAR}\"" >> ${SERVERLES_DEF_FILE}
  done

  echo "    }," >> ${SERVERLES_DEF_FILE}

done

cat <<EOF >>  ${SERVERLES_DEF_FILE}
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
