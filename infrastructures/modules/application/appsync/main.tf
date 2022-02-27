variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "LAMBDA_ARN" {}
variable "TAGS" {}
variable "APPSYNC_RESOLVERS" {}
module "LAMBDA_DATA_SOURCE" {
  source         = "./data_source/lambda"
  ENV            = var.ENV
  FEATURE_NAME   = var.FEATURE_NAME
  APPSYNC_API_ID = var.APPSYNC_API_ID
  LAMBDA_ARN     = var.LAMBDA_ARN
  TAGS           = var.TAGS
}

module "LAMBDA_RESOLVER" {
  source         = "./resolver"
  ENV            = var.ENV
  FEATURE_NAME   = var.FEATURE_NAME
  APPSYNC_API_ID = var.APPSYNC_API_ID
  DATA_SOURCE    = module.LAMBDA_DATA_SOURCE.name
  APPSYNC_RESOLVERS = var.APPSYNC_RESOLVERS
}