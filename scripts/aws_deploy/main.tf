locals {
  tags = {
    Env       = var.ENV
    Terraform = true
    Feature   = var.FEATURE_NAME
  }
  name_post_fix       = var.NAME_POST_FIX
  remote_feature_name = "base_infrastructure"
  lambda_sg           = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.security_groups.lambda_sg
  lambda_vars = {
    for key, value in var.LAMBDA_ENV : key => merge({
      NODE_ENV          = var.ENV
      SECRET_MANAGER_ID = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
    }, value)
  }
  feature_name = "${var.NAME_POST_FIX}-testing"
}

module "REMOTE_STATE" {
  source              = "./tf_remote_state"
  ENV                 = var.ENV
  REMOTE_TF_BUCKET    = var.TF_BUCKET
  REMOTE_FEATURE_NAME = local.remote_feature_name
  REMOTE_AWS_REGION   = var.AWS_REGION
}
module "LAMBDA_LAYER" {
  source        = "TravelOffice/lambda-layer/aws"
  LAMBDA_LAYERS = var.LAMBDA_LAYERS
  ENV           = var.ENV
  FEATURE_NAME  = local.feature_name
  TAGS          = local.tags
}

module "LAMBDA_FUNCTION" {
  source            = "TravelOffice/lambda/aws"
  LAMBDA_FUNCTIONS  = var.LAMBDA_FUNCTIONS
  LAMBDA_LAYER_ARNS = module.LAMBDA_LAYER.lambda_layer_arns
  VPC_ID            = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.id
  SUBNETS           = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.private_subnets
  LAMBDA_SG_ID      = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.security_groups.lambda_sg
  ENV               = var.ENV
  FEATURE_NAME      = local.feature_name
  ENV_VARS          = local.lambda_vars
  TAGS              = local.tags
}

module "API_GATEWAY" {
  count                 = length(var.API_ENDPOINTS) == 0 ? 0 : 1
  source                = "TravelOffice/apigateway/aws"
  LAMBDA_ARNS           = module.LAMBDA_FUNCTION.lambda_arns
  API_ENDPOINTS         = var.API_ENDPOINTS
  AWS_REGION            = var.AWS_REGION
  FEATURE_NAME          = local.feature_name
  COGNITO_USER_POOL_ARN = module.REMOTE_STATE.STATE.COMMON_CONFIG.cognito.user_pool.arn
  ENV                   = var.ENV
  TAGS                  = local.tags
}
