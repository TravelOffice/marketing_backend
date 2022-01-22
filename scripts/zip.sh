#!/bin/sh
ZIP_PATH=$1
ZIP_SOURCE=$2
CUR_DIR=$(pwd)
cd ${ZIP_SOURCE}
zip -r -X ${CUR_DIR}/${ZIP_PATH} . %1>/dev/null %2>/dev/null
echo "{ \"hash\": \"$(cat "$ZIP_PATH" | shasum -a 256 | cut -d " " -f 1 | xxd -r -p | base64)\", \"md5\": \"$(cat "$ZIP_PATH" | md5)\" }"