#!/bin/bash
printHelp() {
  echo "Usage:"
  echo 'export DEPLOYMENT_SERVICES="xxx yyy"'
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

if [ -z "${DEPLOYMENT_SERVICES}" ]; then
  echo "Missing DEPLOYMENT_SERVICES"
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

# Downcase ACTOR_NAME
ACTOR_NAME=${ACTOR_NAME,,}

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

SERVERLESS_DEF_FILE=${DEPLOY_DIR}/serverless.tf

# Define the layer
cat <<EOF >  ${SERVERLESS_DEF_FILE}
variable "LAMBDA_LAYERS" {
  default = {
EOF

for SERVICENAME in ${DEPLOYMENT_SERVICES}; do
  echo "    ${SERVICENAME} = {" >> ${SERVERLESS_DEF_FILE}
  echo "      path = \"src/layers/${SERVICENAME}\"" >>  ${SERVERLESS_DEF_FILE}
  echo "    }," >> ${SERVERLESS_DEF_FILE}
done

cat <<EOF >>  ${SERVERLESS_DEF_FILE}
  }
}
EOF

# Define the lambda function
cat <<EOF >>  ${SERVERLESS_DEF_FILE}
variable "LAMBDA_FUNCTIONS" {
  default = {
EOF

for SERVICENAME in ${DEPLOYMENT_SERVICES}; do
cat <<EOF >>  ${SERVERLESS_DEF_FILE}
    "${SERVICENAME}" = {
      path     = "src/modules/${SERVICENAME}/dist"
      memory_size = 512
      timeout     = 30
      layers   = ["${SERVICENAME}"]
      env_vars = "${SERVICENAME}"
      permission = {
        custom_policies = [
          "LambdaStandardRole",
          "SecretManagerRead",
          "DynamoTableReadWrite"
        ]
        aws_policies    = [
          # TODO: Need to implement permission for each lambda
          "AmazonCognitoPowerUser",
          "service-role/AWSLambdaRole",
          "AmazonS3FullAccess"
        ]
      },
    },
EOF
done

cat <<EOF >>  ${SERVERLESS_DEF_FILE}
  }
}
EOF

# Define the rest api information
cat <<EOF >>  ${SERVERLESS_DEF_FILE}
variable "API_ENDPOINTS" {
  default = {
EOF

for SERVICENAME in ${DEPLOYMENT_SERVICES}; do
  APP_FILE="${CUR_DIR}/src/modules/${SERVICENAME}/app.ts"
  RAW_APIS=$(test -f ${APP_FILE} && grep -rE "^app" ${APP_FILE} | grep -vE "app.use")

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
    echo "    \"${key}\" = {" >>  ${SERVERLESS_DEF_FILE}
    for method in ${new_api_map[$key]}; do
      METHOD=$(echo $method | tr 'a-z' 'A-Z')
      echo "      \"${METHOD}\" = {" >>  ${SERVERLESS_DEF_FILE}
      echo "        lambda_name   = \"${SERVICENAME}\"" >>  ${SERVERLESS_DEF_FILE}
      echo "        authorization = true" >>  ${SERVERLESS_DEF_FILE}
      echo "      }" >>  ${SERVERLESS_DEF_FILE}
    done
    echo "    }," >>  ${SERVERLESS_DEF_FILE}
  done

done

cat <<EOF >>  ${SERVERLESS_DEF_FILE}
  }
}
EOF

# Define the lambda env
cat <<EOF >>  ${SERVERLESS_DEF_FILE}
variable "LAMBDA_ENV" {
  default = {
EOF

for SERVICENAME in ${DEPLOYMENT_SERVICES}; do
  ENV_FILE="${CUR_DIR}/src/modules/${SERVICENAME}/.env.development"
  LAMBDA_ENV=$(test -f ${ENV_FILE} && grep -vE "NODE_ENV|PORT|AWS_REGION" ${ENV_FILE})
  echo "    ${SERVICENAME} = {" >> ${SERVERLESS_DEF_FILE}

  for var in ${LAMBDA_ENV}; do
    arrVAR=(${var//=/ })
    leftVAR=${arrVAR[0]}
    rightVAR=${arrVAR[1]}
    echo "      ${leftVAR} = \"${rightVAR}\"" >> ${SERVERLESS_DEF_FILE}
  done

  echo "    }," >> ${SERVERLESS_DEF_FILE}

done

cat <<EOF >>  ${SERVERLESS_DEF_FILE}
  }
}
EOF

terraform init -reconfigure

if [ "${ACTION}" == "deploy" ]; then
  terraform apply -auto-approve
  retVal=$?
  if [ $retVal -ne 0 ]; then
      echo "Deploy failed!"
      exit $retVal
  fi
fi
if [ "${ACTION}" == "destroy" ]; then
  terraform destroy -auto-approve
  retVal=$?
  if [ $retVal -ne 0 ]; then
      echo "Destroy failed!"
      exit $retVal
  fi
fi
