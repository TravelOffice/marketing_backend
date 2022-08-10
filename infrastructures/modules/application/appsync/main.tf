variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "LAMBDA_ARNS" {}
variable "TAGS" {}
variable "APPSYNC_FUNCTIONS" {}
variable "APPSYNC_RESOLVERS" {}
variable "DYNAMODB_ARN" {}
variable "DYNAMODB_NAME" {}
variable "APPSYNC_LAMBDA_AUTHORIZER" {}
variable "APPSYNC_API_ARN" {}
variable "APPSYNC_API_NAME" {}
variable "APPSYNC_LAMBDA_RESOLVER" {}
module "APPSYNC_DATA_SOURCE" {
  source                  = "./data_source"
  ENV                     = var.ENV
  FEATURE_NAME            = var.FEATURE_NAME
  APPSYNC_API_ID          = var.APPSYNC_API_ID
  APPSYNC_LAMBDA_RESOLVER = var.APPSYNC_LAMBDA_RESOLVER
  LAMBDA_ARNS             = var.LAMBDA_ARNS
  DYNAMODB_ARN            = var.DYNAMODB_ARN
  DYNAMODB_NAME           = var.DYNAMODB_NAME
  TAGS                    = var.TAGS
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

module "APPSYNC_LAMBDA_AUTHORIZER" {
  source                    = "./authorizer"
  ENV                       = var.ENV
  FEATURE_NAME              = var.FEATURE_NAME
  APPSYNC_API_ID            = var.APPSYNC_API_ID
  APPSYNC_API_ARN           = var.APPSYNC_API_ARN
  APPSYNC_API_NAME          = var.APPSYNC_API_NAME
  LAMBDA_ARNS               = var.LAMBDA_ARNS
  APPSYNC_LAMBDA_AUTHORIZER = var.APPSYNC_LAMBDA_AUTHORIZER
}
