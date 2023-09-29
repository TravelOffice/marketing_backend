variable "LAMBDA_LAYERS" {}
variable "LAMBDA_FUNCTIONS" {}
variable "API_ENDPOINTS" {}
variable "API_GATEWAY_RESPONSES" {}
variable "LAMBDA_TRIGGERS" {}
variable "LAMBDA_AUTHORIZERS" {}
variable "LAMBDA_CRONS" {}
variable "TF_BUCKET" {}
variable "APPSYNC_FUNCTIONS" {}
variable "APPSYNC_RESOLVERS" {}
variable "APPSYNC_LAMBDA_AUTHORIZER" {}
variable "APPSYNC_LAMBDA_RESOLVER" {}

data "aws_caller_identity" "current" {}
data "http" "infra" {
  url = "https://raw.githubusercontent.com/TravelOffice/infrastructure-constant/master/${var.ENV}-infrastructure.json"
}
locals {
  constants           = jsondecode(data.http.infra.response_body)
  remote_feature_name = "base_infrastructure"
  domain_name         = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.domain.name
  tags = {
    Env       = var.ENV
    Terraform = true
    Feature   = var.FEATURE_NAME
  }

  env_vars = {
    standard_vars = {
      REGION            = var.AWS_REGION
      NODE_ENV          = var.ENV
      SECRET_MANAGER_ID = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
    },
    s3_presigned_url_vars = {
      REGION                    = var.AWS_REGION
      NODE_ENV                  = var.ENV
      SECRET_MANAGER_ID         = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      ATTACHMENT_MESSAGE_BUCKET = module.REMOTE_STATE.STATE.MARKETING.frontend.sale_web.attachment_s3_bucket
      PRESIGNED_URL_EXPIRES     = 60
    },
    marketplace_s3_presigned_url_vars = {
      REGION                = var.AWS_REGION
      NODE_ENV              = var.ENV
      SECRET_MANAGER_ID     = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      PRESIGNED_URL_EXPIRES = 60
    },
    link_pages_vars = {
      REGION               = var.AWS_REGION
      NODE_ENV             = var.ENV
      SECRET_MANAGER_ID    = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      ZALO_CALLBACK_URL    = "sso.${local.domain_name}/zalo/callback"
      TELEGRAM_WEBHOOK_URL = "https://${var.ENV}-marketing-backend.${local.domain_name}/chat-telegram-webhook"
    },
    auto_assign_sqs_trigger_lambda_vars = {
      REGION                                             = var.AWS_REGION
      NODE_ENV                                           = var.ENV
      SECRET_MANAGER_ID                                  = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      AUTO_ASSIGN_SFN_ARN                                = "arn:aws:states:${var.AWS_REGION}:${data.aws_caller_identity.current.account_id}:stateMachine:${var.ENV}-auto-assign-chat"
      ASSIGN_CHAT_LAMBDA_FUNCTION_ARN                    = "${var.ENV}-${var.FEATURE_NAME}-auto_assign_chat_service"
      NOTIFY_AUTO_ASSIGN_CHAT_RESULT_LAMBDA_FUNCTION_ARN = "${var.ENV}-${var.FEATURE_NAME}-auto_assign_send_notification"
    },
    appsync_resolver_vars = {
      REGION                = var.AWS_REGION
      NODE_ENV              = var.ENV
      SECRET_MANAGER_ID     = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      TELEGRAM_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-telegram_platform_service"
      FACEBOOK_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-facebook_platform_service"
      ZALO_SERVICE_NAME     = "${var.ENV}-${var.FEATURE_NAME}-zalo_platform_service"
    },
    handler_unassigned_conversations_vars = {
      REGION                                             = var.AWS_REGION
      NODE_ENV                                           = var.ENV
      SECRET_MANAGER_ID                                  = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      TENANT_HANDLE_UNASSIGNED_CONVERSATION_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-handle_tenant_unassigned_conversations"
    },
    auto_assign_chat_lambda_vars = {
      REGION            = var.AWS_REGION
      NODE_ENV          = var.ENV
      SECRET_MANAGER_ID = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
    },
    auto_assign_send_notification_vars = {
      REGION                         = var.AWS_REGION
      NODE_ENV                       = var.ENV
      SECRET_MANAGER_ID              = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      SEND_NOTIFICATION_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-send_notification"
    },
    chat_service_lambda_vars = {
      REGION                         = var.AWS_REGION
      NODE_ENV                       = var.ENV
      SECRET_MANAGER_ID              = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      SEND_NOTIFICATION_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-send_notification"
    },
    booking_service_lambda_vars = {
      REGION                         = var.AWS_REGION
      NODE_ENV                       = var.ENV
      SECRET_MANAGER_ID              = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      SEND_NOTIFICATION_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-send_notification"
      NO_REPLY_DEFAULT_EMAIL         = "no-reply@${local.domain_name}"
      HANDLE_PAYMENT_OVERDUE_LAMBDA  = "arn:aws:lambda:${var.AWS_REGION}:${data.aws_caller_identity.current.account_id}:function:${var.ENV}-${var.FEATURE_NAME}-handle_payment_overdue"
    },
    handle_payment_overdue_lambda_vars = {
      REGION                         = var.AWS_REGION
      NODE_ENV                       = var.ENV
      SECRET_MANAGER_ID              = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      SEND_NOTIFICATION_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-send_notification"
      NO_REPLY_DEFAULT_EMAIL         = "no-reply@${local.domain_name}"
    },
    departure_tour_service_lambda_vars = {
      REGION                         = var.AWS_REGION
      NODE_ENV                       = var.ENV
      SECRET_MANAGER_ID              = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      SEND_NOTIFICATION_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-send_notification",
      NO_REPLY_DEFAULT_EMAIL         = "no-reply@${local.domain_name}",
      DEPARTURE_TOUR_URL             = "${local.domain_name}/apps/tour/departure"
    },
    payment_voucher_service_lambda_vars = {
      REGION            = var.AWS_REGION
      NODE_ENV          = var.ENV
      SECRET_MANAGER_ID = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
      ATTACHMENT_BUCKET = module.REMOTE_STATE.STATE.MARKETING.frontend.sale_web.attachment_s3_bucket
    },
    marketplace_get_available_tours_lambda_vars = {
      REGION                     = var.AWS_REGION
      NODE_ENV                   = var.ENV
      LEAD_SERVICE_NAME          = "${var.ENV}-${var.FEATURE_NAME}-get_leads_from_marketplace_service"
      TOUR_TEMPLATE_SERVICE_NAME = "${var.ENV}-${var.FEATURE_NAME}-get_tour_tpls_from_marketplace_service"
    },
  }
  MEILI_SEARCH_MASTER_KEY = local.constants["MEILI_SEARCH_MASTER_KEY"]
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
  VPC_ID            = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.id
  LAMBDA_SG_ID      = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.security_groups.lambda_sg
  SUBNETS           = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.private_subnets
  ENV               = var.ENV
  FEATURE_NAME      = var.FEATURE_NAME
  ENV_VARS          = local.env_vars
  TAGS              = local.tags
}

module "API_GATEWAY" {
  source                 = "TravelOffice/apigateway/aws"
  LAMBDA_ARNS            = module.LAMBDA_FUNCTION.lambda_arns
  API_ENDPOINTS          = var.API_ENDPOINTS
  LAMBDA_AUTHORIZERS     = var.LAMBDA_AUTHORIZERS
  API_GATEWAY_RESPONSES  = var.API_GATEWAY_RESPONSES
  AWS_REGION             = var.AWS_REGION
  FEATURE_NAME           = var.FEATURE_NAME
  DOMAIN_NAME            = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.domain.name
  HOSTED_ZONE_ID         = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.id
  DOMAIN_CERTIFICATE_ARN = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.domain.certificate.api_gateway
  COGNITO_USER_POOL_ARN  = module.REMOTE_STATE.STATE.COMMON_CONFIG.cognito.user_pool.arn
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
  source                    = "../../modules/application/appsync"
  ENV                       = var.ENV
  FEATURE_NAME              = var.FEATURE_NAME
  APPSYNC_API_ID            = module.REMOTE_STATE.STATE.MARKETING.backend.appsync.id
  APPSYNC_API_ARN           = module.REMOTE_STATE.STATE.MARKETING.backend.appsync.arn
  APPSYNC_API_NAME          = module.REMOTE_STATE.STATE.MARKETING.backend.appsync.name
  APPSYNC_FUNCTIONS         = var.APPSYNC_FUNCTIONS
  APPSYNC_RESOLVERS         = var.APPSYNC_RESOLVERS
  APPSYNC_LAMBDA_AUTHORIZER = var.APPSYNC_LAMBDA_AUTHORIZER
  APPSYNC_LAMBDA_RESOLVER   = var.APPSYNC_LAMBDA_RESOLVER
  LAMBDA_ARNS               = module.LAMBDA_FUNCTION.lambda_arns
  DYNAMODB_ARN              = module.REMOTE_STATE.STATE.MARKETING.backend.dynamodb.travel_table.arn
  DYNAMODB_NAME             = module.REMOTE_STATE.STATE.MARKETING.backend.dynamodb.travel_table.name
  TAGS                      = local.tags
}

module "AUTO_ASSIGN_MODULE_CONFIGURATION" {
  source                      = "../../modules/application/auto_assign_chat"
  ENV                         = var.ENV
  FEATURE_NAME                = var.FEATURE_NAME
  NEW_CONVERSATION_LAMBDA_ARN = module.LAMBDA_FUNCTION.lambda_arns["new_conversation_sqs_trigger_service"]
  NEW_CONVERSATION_QUEUE_ARN  = module.REMOTE_STATE.STATE.MARKETING.queue.auto_assign_chat_queue
  TAGS                        = local.tags
}

module "MARKETPLACE_DDB_STREAM_CONFIGURATION" {
  source                                 = "../../modules/application/dynamodb_stream"
  ENV                                    = var.ENV
  FEATURE_NAME                           = var.FEATURE_NAME
  TAGS                                   = local.tags
  MARKETPLACE_DDB_STREAM_ARN             = module.REMOTE_STATE.STATE.MARKETING.backend.dynamodb.marketplace_table.stream_arn
  MARKETPLACE_DDB_STREAM_BATCH_SIZE      = 100
  MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN  = module.LAMBDA_FUNCTION.lambda_arns["marketplace_data_stream_service"]
  MARKETPLACE_DDB_STREAM_BATCHING_WINDOW = 90
}

module "SEARCH_QUEUE" {
  source       = "../../modules/sqs"
  FEATURE_NAME = var.FEATURE_NAME
  ENV          = var.ENV
  TAGS         = local.tags
}

module "SEARCH_LOAD_BALANCER" {
  source             = "../../modules/application/alb"
  VPC_ID             = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.id
  LB_ARN             = module.REMOTE_STATE.STATE.MARKETING.search.lb_arn
  LB_FRONT_END_HTTPS = module.REMOTE_STATE.STATE.MARKETING.search.lb_front_end_https_arn
  LB_FRONT_END_HTTP  = module.REMOTE_STATE.STATE.MARKETING.search.lb_front_end_http_arn
  DOMAIN_ARN         = module.REMOTE_STATE.STATE.COMMON_CONFIG.route53.hosted_zone.domain.certificate.api_gateway
  TAGS               = local.tags
}

module "SEARCH_INSTANCE" {
  source                   = "../../modules/application/search"
  ENV                      = var.ENV
  FEATURE_NAME             = var.FEATURE_NAME
  SERVICE_NAME             = "${var.ENV}-${var.FEATURE_NAME}-service"
  DESIRED_COUNT            = 1
  MIN_CAPACITY             = 1
  MAX_CAPACITY             = 1
  SEARCH_TARGET_GROUP_ARN  = module.SEARCH_LOAD_BALANCER.search_lb_target_group_arn
  SUBNETS                  = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.private_subnets
  VPC_ID                   = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.id
  AWS_REGION               = var.AWS_REGION
  MEILI_SEARCH_MASTER_KEY  = local.MEILI_SEARCH_MASTER_KEY
  SEARCH_MESSAGE_QUEUE_URL = module.SEARCH_QUEUE.search_queue_url
  SEARCH_MESSAGE_QUEUE_ARN = module.SEARCH_QUEUE.search_queue_arn
  SCRIPT_BUCKET            = module.REMOTE_STATE.STATE.MARKETING.s3.script_bucket
  TAGS                     = local.tags
}

module "ECS" {
  source       = "../../modules/ecs"
  FEATURE_NAME = var.FEATURE_NAME
  ENV          = var.ENV
  CUSTOM_POLICIES = [
    "EcsTaskStandardRole",
    "DynamoTableReadWrite",
    "SQSLambdaTriggerRole",
    "SecretManagerRead",
    "SQSSendMessage"
  ]
  AWS_POLICIES = [
    "service-role/AmazonECSTaskExecutionRolePolicy"
  ]
  SUPPLIER_CRAWLER_TASK_ENV = merge(
    local.env_vars.standard_vars,
    {
      "SEARCH_MESSAGE_QUEUE_URL" = module.SEARCH_QUEUE.search_queue_url
      "SEARCH_MESSAGE_QUEUE_ARN" = module.SEARCH_QUEUE.search_queue_arn
    }
  )
  TAGS                = local.tags
  AWS_REGION          = var.AWS_REGION
  PUBLIC_SUBNETS      = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.public_subnets
  PRIVATE_SUBNETS     = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.private_subnets
  VPC_ID              = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.id
  SCHEDULE_EXPRESSION = "cron(0 17 * * ? *)"
}

module "NOTIFICATION_LAMBDA_SQS_MAPPING" {
  source     = "../../modules/application/notification/queue"
  LAMBDA_ARN = module.LAMBDA_FUNCTION.lambda_arns["system_notification_service"]
  SOURCE_ARN = module.REMOTE_STATE.STATE.MARKETING.queue.marketplace_notification_queue
}
