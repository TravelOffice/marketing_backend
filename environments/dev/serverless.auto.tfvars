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
    layers = ["common", "common_test"]
  },
  "lambda_hello2" = {
    path = "src/modules/hello-world"
    layers = ["common", "common_test"]
  }
}

API_ENDPOINTS = {
  "/hello1" = {
    method ="GET"
    lambda_name = "lambda_hello"
  },
  "/hello2" = {
    method ="GET"
    lambda_name = "lambda_hello2"
  }
}