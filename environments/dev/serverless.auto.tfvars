LAMBDA_LAYERS = {
  "common" = {
    path = "src/libs/common"
  },
  "common_test" = {
    path = "src/libs/common"
  }
}

/*
  LAMBDA_FUNCTIONS
  Name	        | Type	       |  Default       |Required
  path          | string       |                |  Yes
  layers        | list(string) |                |  Yes
  handler       | string       |  index.handler |  No
  memory_size   | number       |      128       |  No
  runtime       | string       |   nodejs14.x   |  No
  timeout       | number       |       3        |  No
  architecture  | string       |    "arm64"     |  No
  log_retention | number       |       7        |  No
*/
LAMBDA_FUNCTIONS = {
  "lambda_hello" = {
    path        = "src/modules/hello-world"
    layers      = ["common", "common_test"]
  },
  "lambda_hello2" = {
    path        = "src/modules/hello-world"
    layers      = ["common", "common_test"]
  }
}

API_ENDPOINTS = {
  "/sample-1" = {
    "GET" = {
      lambda_name = "lambda_hello"
    },
    "POST" = {
      lambda_name = "lambda_hello2"
    }
  },
  "/sample-2/tier-2/{id}" = {
    "PUT" = {
      lambda_name = "lambda_hello"
    },
    "DELETE" = {
      lambda_name = "lambda_hello2"
    }
  }
}