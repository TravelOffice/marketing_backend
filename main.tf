variable "MARKETING_PRIVATE_SUBNETS" {}

variable "MARKETING_VPC_ID" {}
variable "LAMBDA_LAYERS" {}
variable "LAMBDA_FUNCTIONS" {}
variable "API_ENDPOINTS" {}

module "LAMBDA_LAYER" {
  source        = "../../modules/application/lambda_layer"
  LAMBDA_LAYERS = var.LAMBDA_LAYERS
  ENV           = var.ENV
}

module "LAMBDA_FUNCTION" {
  source                    = "../../modules/application/lambda"
  LAMBDA_FUNCTIONS          = var.LAMBDA_FUNCTIONS
  lambda_layer_arns         = module.LAMBDA_LAYER.lambda_layer_arns
  MARKETING_VPC_ID          = var.MARKETING_VPC_ID
  MARKETING_PRIVATE_SUBNETS = var.MARKETING_PRIVATE_SUBNETS
  ENV                       = var.ENV
}

module "API_GATEWAY" {
  source                 = "../../modules/application/apigateway"
  lambda_arns            = module.LAMBDA_FUNCTION.lambda_arns
  API_ENDPOINTS          = var.API_ENDPOINTS
  ENV                    = var.ENV
  AWS_REGION             = var.AWS_REGION
  FEATURE_NAME           = var.FEATURE_NAME
  DOMAIN_NAME            = var.DOMAIN_NAME
  HOSTED_ZONE_ID         = var.HOSTED_ZONE_ID
  DOMAIN_CERTIFICATE_ARN = var.DOMAIN_CERTIFICATE_ARN
}
