LAMBDA_LAYERS = {
  "common" = {
    path = "src/libs/common"
  },
  "common_test" = {
    path = "src/libs/common"
  }
}

LAMBDA_FUNCTIONS = {
  "lambda_hello" = {
    path = "src/modules/hello-world"
    memory_size = 128
    handler = "index.handler"
    runtime = "nodejs14.x"
    layers = ["common", "common_test"]
  },
  "lambda_hello2" = {
    path = "src/modules/hello-world"
    memory_size = 128
    handler = "index.handler"
    runtime = "nodejs14.x"
    layers = ["common", "common_test"]
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