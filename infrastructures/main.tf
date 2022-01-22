variable "MARKETING_PRIVATE_SUBNETS" {}

variable "MARKETING_VPC_ID" {}
variable "LAMBDA_LAYERS" {}
variable "LAMBDA_FUNCTIONS" {}
variable "API_ENDPOINTS" {}
variable "AWS_REGION" {}
variable "STANDARD_LAMBDA_IAM_ROLE" {}

locals {
  iam_roles = {
    standard_lambda_role = var.STANDARD_LAMBDA_IAM_ROLE
  }
}

module "LAMBDA_LAYER" {
  source        = "../../modules/application/lambda_layer"
  LAMBDA_LAYERS = var.LAMBDA_LAYERS
  ENV           = var.ENV
  FEATURE_NAME  = var.FEATURE_NAME
}

module "LAMBDA_FUNCTION" {
  source                    = "../../modules/application/lambda"
  LAMBDA_FUNCTIONS          = var.LAMBDA_FUNCTIONS
  LAMBDA_LAYER_ARNS         = module.LAMBDA_LAYER.lambda_layer_arns
  MARKETING_VPC_ID          = var.MARKETING_VPC_ID
  MARKETING_PRIVATE_SUBNETS = var.MARKETING_PRIVATE_SUBNETS
  ENV                       = var.ENV
  FEATURE_NAME              = var.FEATURE_NAME
  IAM_ROLES                 = local.iam_roles
}

module "API_GATEWAY" {
  source                 = "../../modules/application/apigateway"
  LAMBDA_ARNS            = module.LAMBDA_FUNCTION.lambda_arns
  API_ENDPOINTS          = var.API_ENDPOINTS
  AWS_REGION             = var.AWS_REGION
  FEATURE_NAME           = var.FEATURE_NAME
  DOMAIN_NAME            = var.DOMAIN_NAME
  HOSTED_ZONE_ID         = var.HOSTED_ZONE_ID
  DOMAIN_CERTIFICATE_ARN = var.DOMAIN_CERTIFICATE_ARN
  ENV                    = var.ENV
}
