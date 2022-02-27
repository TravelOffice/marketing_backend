variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "LAMBDA_ARN" {}
variable "TAGS" {}

resource "aws_appsync_datasource" "lambda_datasource" {
  api_id = var.APPSYNC_API_ID
  name   = "${var.ENV}_appsync_lambda_datasource"
  type   = "AWS_LAMBDA"

  lambda_config {
    function_arn = var.LAMBDA_ARN
  }
}

output "name" {
  value = "${var.ENV}_appsync_lambda_datasource"
}
