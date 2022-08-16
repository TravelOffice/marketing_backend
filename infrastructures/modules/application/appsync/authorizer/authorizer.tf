variable "ENV" {}
variable "FEATURE_NAME" {}
variable "LAMBDA_ARNS" {}
variable "APPSYNC_API_ID" {}
variable "APPSYNC_API_ARN" {}
variable "APPSYNC_API_NAME" {}
variable "APPSYNC_LAMBDA_AUTHORIZER" {}

locals {
  appsync_lambda_authorizer_cache_ttl = try(var.APPSYNC_LAMBDA_AUTHORIZER.caching_config, 0)
}

data "aws_caller_identity" "current" {}

resource "null_resource" "appsync_lambda_authorizer" {
  triggers = {
    always_run = "${timestamp()}"
  }
  provisioner "local-exec" {
    command = "aws appsync update-graphql-api --api-id ${var.APPSYNC_API_ID} --name ${var.APPSYNC_API_NAME} --authentication-type AWS_LAMBDA --lambda-authorizer-config 'authorizerResultTtlInSeconds=${local.appsync_lambda_authorizer_cache_ttl}, authorizerUri=${var.LAMBDA_ARNS[var.APPSYNC_LAMBDA_AUTHORIZER.lambda_name]}' --additional-authentication-providers 'authenticationType=API_KEY'"
  }
}

resource "aws_lambda_permission" "appsync_lambda_authorizer" {
  action        = "lambda:InvokeFunction"
  function_name = var.LAMBDA_ARNS[var.APPSYNC_LAMBDA_AUTHORIZER.lambda_name]
  principal     = "appsync.amazonaws.com"
  source_arn    = var.APPSYNC_API_ARN
}
