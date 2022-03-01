variable "LAMBDA_LAYERS" {}
variable "LAMBDA_FUNCTIONS" {}
variable "API_ENDPOINTS" {}
variable "LAMBDA_TRIGGERS" {}
variable "LAMBDA_CRONS" {}
variable "TF_BUCKET" {}
variable "APPSYNC_RESOLVERS" {}
locals {
  remote_feature_name = "base_infrastructure"
  iam_roles = {
    standard_lambda_role                 = module.REMOTE_STATE.STATE.COMMON_CONFIG.iam.roles.standard_lambda_role
    execute_ecs_task_lambda_role         = module.REMOTE_STATE.STATE.COMMON_CONFIG.iam.roles.execute_ecs_task_lambda_role
    provision_tenant_infra_ecs_task_role = module.REMOTE_STATE.STATE.COMMON_CONFIG.iam.roles.provision_tenant_infa_ecs_task_role
    cognito_power_user_lambda_role       = module.REMOTE_STATE.STATE.COMMON_CONFIG.iam.roles.cognito_power_user_lambda_role
    read_write_dynamodb_lambda_role      = module.REMOTE_STATE.STATE.COMMON_CONFIG.iam.roles.read_write_dynamodb_lambda_role
  }

  tags = {
    Env       = var.ENV
    Terraform = true
    Feature   = var.FEATURE_NAME
  }

  env_vars = {
    standard_vars = {
      NODE_ENV          = var.ENV
      SECRET_MANAGER_ID = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
    }
  }
}

module "REMOTE_STATE" {
  source              = "../../modules/tf_remote_state"
  ENV                 = var.ENV
  REMOTE_TF_BUCKET    = var.TF_BUCKET
  REMOTE_FEATURE_NAME = local.remote_feature_name
  REMOTE_AWS_REGION   = var.AWS_REGION
}

module "LAMBDA_LAYER" {
  source        = "TravelOffice/lambda-layer/aws"
  LAMBDA_LAYERS = var.LAMBDA_LAYERS
  ENV           = var.ENV
  FEATURE_NAME  = var.FEATURE_NAME
  TAGS          = local.tags
}

module "LAMBDA_FUNCTION" {
  source            = "TravelOffice/lambda/aws"
  LAMBDA_FUNCTIONS  = var.LAMBDA_FUNCTIONS
  LAMBDA_LAYER_ARNS = module.LAMBDA_LAYER.lambda_layer_arns
  VPC_ID            = module.REMOTE_STATE.STATE.BASE_INFRASTRUCTURE.backend.vpc.id
  SUBNETS           = module.REMOTE_STATE.STATE.BASE_INFRASTRUCTURE.backend.vpc.private_subnets
  ENV               = var.ENV
  FEATURE_NAME      = var.FEATURE_NAME
  IAM_ROLES         = local.iam_roles
  ENV_VARS          = local.env_vars
  TAGS              = local.tags
}

module "API_GATEWAY" {
  source                 = "TravelOffice/apigateway/aws"
  LAMBDA_ARNS            = module.LAMBDA_FUNCTION.lambda_arns
  API_ENDPOINTS          = var.API_ENDPOINTS
  AWS_REGION             = var.AWS_REGION
  FEATURE_NAME           = var.FEATURE_NAME
  DOMAIN_NAME            = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.domain.name
  HOSTED_ZONE_ID         = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.id
  DOMAIN_CERTIFICATE_ARN = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.domain.certificate.arn
  ENV                    = var.ENV
  TAGS                   = local.tags

}

module "LAMBDA_CRON" {
  source       = "../../modules/event/lambda_cron"
  FEATURE_NAME = var.FEATURE_NAME
  LAMBDA_CRONS = var.LAMBDA_CRONS
  LAMBDA_ARNS  = module.LAMBDA_FUNCTION.lambda_arns
  ENV          = var.ENV
  TAGS         = local.tags
}

module "APPSYNC_CONFIGURATION" {
  source            = "../../modules/application/appsync"
  ENV               = var.ENV
  FEATURE_NAME      = var.FEATURE_NAME
  APPSYNC_API_ID    = module.REMOTE_STATE.STATE.MARKETING.backend.appsync.id
  APPSYNC_RESOLVERS = var.APPSYNC_RESOLVERS
  LAMBDA_ARN        = module.LAMBDA_FUNCTION.lambda_arns["chat_appsync_resolver_service"] #TODO: Need update correct lambda resolver name
  TAGS              = local.tags
}
