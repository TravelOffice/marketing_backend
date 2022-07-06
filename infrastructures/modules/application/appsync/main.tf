variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "LAMBDA_ARN" {}
variable "TAGS" {}
variable "APPSYNC_FUNCTIONS" {}
variable "APPSYNC_RESOLVERS" {}
variable "DYNAMODB_ARN" {}
variable "DYNAMODB_NAME" {}
module "APPSYNC_DATA_SOURCE" {
  source         = "./data_source"
  ENV            = var.ENV
  FEATURE_NAME   = var.FEATURE_NAME
  APPSYNC_API_ID = var.APPSYNC_API_ID
  LAMBDA_ARN     = var.LAMBDA_ARN
  DYNAMODB_ARN   = var.DYNAMODB_ARN
  DYNAMODB_NAME  = var.DYNAMODB_NAME
  TAGS           = var.TAGS
}

module "APPSYNC_FUNCTION" {
  source            = "./function"
  ENV               = var.ENV
  FEATURE_NAME      = var.FEATURE_NAME
  APPSYNC_API_ID    = var.APPSYNC_API_ID
  APPSYNC_FUNCTIONS = var.APPSYNC_FUNCTIONS
  TAGS              = var.TAGS
  depends_on = [
    module.APPSYNC_DATA_SOURCE
  ]
}

module "APPSYNC_RESOLVER" {
  source               = "./resolver"
  ENV                  = var.ENV
  FEATURE_NAME         = var.FEATURE_NAME
  APPSYNC_API_ID       = var.APPSYNC_API_ID
  APPSYNC_FUNCTIONS_ID = module.APPSYNC_FUNCTION.appsync_function_ids
  APPSYNC_RESOLVERS    = var.APPSYNC_RESOLVERS
  depends_on = [
    module.APPSYNC_DATA_SOURCE
  ]
}
