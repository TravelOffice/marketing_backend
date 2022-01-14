LAMBDA_LAYERS = {
  "tour-service" = {
    path = "src/layers/tour-service"
  }
}

/*
  LAMBDA_FUNCTIONS
  Name	        | Type	       |  Default               |Required
  path          | string       |                        |  Yes
  layers        | list(string) |                        |  Yes
  handler       | string       |  index.handler         |  No
  memory_size   | number       |  128                   |  No
  runtime       | string       |  nodejs14.x            |  No
  timeout       | number       |  3                     |  No
  architecture  | string       |  "arm64"               |  No
  log_retention | number       |  7                     |  No
  iam_role      | string       |  standard_lambda_role  |  No
*/
LAMBDA_FUNCTIONS = {
  "lambda_tour_service" = {
    path        = "src/modules/tour-service/dist",
    memory_size = 128
    handler     = "lambda.handler"
    runtime     = "nodejs14.x"
    layers      = ["tour-service"]
    iam_role    = "standard_lambda_role"
  }
}

API_ENDPOINTS = {
  "/tours" = {
    "GET" = {
      lambda_name = "lambda_tour_service"
    }
  }
}
