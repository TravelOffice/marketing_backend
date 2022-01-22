#!/bin/sh
ZIP_PATH=$1
ZIP_SOURCE=$2
CUR_DIR=$(pwd)
cd ${ZIP_SOURCE}
rm -rf ${CUR_DIR}/${ZIP_PATH}
zip -r -X ${CUR_DIR}/${ZIP_PATH} . %1>/dev/null %2>/dev/null
echo "{ \"hash\": \"$(cat "${CUR_DIR}/$ZIP_PATH" | shasum -a 256 | cut -d " " -f 1 | xxd -r -p | base64)\", \"md5\": \"$(cat "${CUR_DIR}/$ZIP_PATH" | md5sum)\" }"
