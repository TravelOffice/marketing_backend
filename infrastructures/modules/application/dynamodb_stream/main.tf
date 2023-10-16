variable "ENV" {}
variable "FEATURE_NAME" {}
variable "TAGS" {}
variable "TRAVEL_DDB_STREAM_ARN" {}
variable "TRAVEL_DDB_STREAM_BATCH_SIZE" {}
variable "TRAVEL_LAMBDA_STREAM_HANDLER_ARN" {}
variable "TRAVEL_DDB_STREAM_BATCHING_WINDOW" {}
variable "MARKETPLACE_DDB_STREAM_ARN" {}
variable "MARKETPLACE_DDB_STREAM_BATCH_SIZE" {}
variable "MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN" {}
variable "MARKETPLACE_DDB_STREAM_BATCHING_WINDOW" {}
variable "NOTIFICATION_DDB_STREAM_BATCH_SIZE" {}
variable "HANDLE_NOTIFICATIONLAMBDA_HANDLER_ARN" {}
variable "CHAT_DDB_STREAM_ARN" {}
variable "CHAT_DDB_STREAM_BATCH_SIZE" {}
variable "CHAT_LAMBDA_STREAM_HANDLER_ARN" {}
variable "CHAT_DDB_STREAM_BATCHING_WINDOW" {}

module "marketplace_ddb_stream_trigger" {
  source                                 = "./marketplace_stream/trigger"
  ENV                                    = var.ENV
  FEATURE_NAME                           = var.FEATURE_NAME
  TAGS                                   = var.TAGS
  MARKETPLACE_DDB_STREAM_ARN             = var.MARKETPLACE_DDB_STREAM_ARN
  MARKETPLACE_DDB_STREAM_BATCH_SIZE      = var.MARKETPLACE_DDB_STREAM_BATCH_SIZE
  MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN  = var.MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN
  MARKETPLACE_DDB_STREAM_BATCHING_WINDOW = var.MARKETPLACE_DDB_STREAM_BATCHING_WINDOW
}

module "marketplace_notitication_ddb_stream_trigger" {
  source                                 = "./marketplace_stream/trigger"
  ENV                                    = var.ENV
  FEATURE_NAME                           = var.FEATURE_NAME
  TAGS                                   = var.TAGS
  MARKETPLACE_DDB_STREAM_ARN             = var.MARKETPLACE_DDB_STREAM_ARN
  MARKETPLACE_DDB_STREAM_BATCH_SIZE      = var.NOTIFICATION_DDB_STREAM_BATCH_SIZE
  MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN  = var.HANDLE_NOTIFICATIONLAMBDA_HANDLER_ARN
  MARKETPLACE_DDB_STREAM_BATCHING_WINDOW = var.MARKETPLACE_DDB_STREAM_BATCHING_WINDOW
}

module "travel_ddb_stream_trigger" {
  source                            = "./travel_stream/trigger"
  ENV                               = var.ENV
  FEATURE_NAME                      = var.FEATURE_NAME
  TAGS                              = var.TAGS
  TRAVEL_DDB_STREAM_ARN             = var.TRAVEL_DDB_STREAM_ARN
  TRAVEL_DDB_STREAM_BATCH_SIZE      = var.TRAVEL_DDB_STREAM_BATCH_SIZE
  TRAVEL_LAMBDA_STREAM_HANDLER_ARN  = var.TRAVEL_LAMBDA_STREAM_HANDLER_ARN
  TRAVEL_DDB_STREAM_BATCHING_WINDOW = var.TRAVEL_DDB_STREAM_BATCHING_WINDOW
}

module "chat_ddb_stream_trigger" {
  source                          = "./chat_stream/trigger"
  ENV                             = var.ENV
  FEATURE_NAME                    = var.FEATURE_NAME
  TAGS                            = var.TAGS
  CHAT_DDB_STREAM_ARN             = var.CHAT_DDB_STREAM_ARN
  CHAT_DDB_STREAM_BATCH_SIZE      = var.CHAT_DDB_STREAM_BATCH_SIZE
  CHAT_LAMBDA_STREAM_HANDLER_ARN  = var.CHAT_LAMBDA_STREAM_HANDLER_ARN
  CHAT_DDB_STREAM_BATCHING_WINDOW = var.CHAT_DDB_STREAM_BATCHING_WINDOW
}
