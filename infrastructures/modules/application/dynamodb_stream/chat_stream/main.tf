variable "ENV" {}
variable "FEATURE_NAME" {}
variable "TAGS" {}
variable "CHAT_DDB_STREAM_ARN" {}
variable "CHAT_DDB_STREAM_BATCH_SIZE" {}
variable "CHAT_LAMBDA_STREAM_HANDLER_ARN" {}
variable "CHAT_DDB_STREAM_BATCHING_WINDOW" {}

module "chat_ddb_stream_trigger" {
  source                          = "./trigger"
  ENV                             = var.ENV
  FEATURE_NAME                    = var.FEATURE_NAME
  TAGS                            = var.TAGS
  CHAT_DDB_STREAM_ARN             = var.CHAT_DDB_STREAM_ARN
  CHAT_DDB_STREAM_BATCH_SIZE      = var.CHAT_DDB_STREAM_BATCH_SIZE
  CHAT_LAMBDA_STREAM_HANDLER_ARN  = var.CHAT_LAMBDA_STREAM_HANDLER_ARN
  CHAT_DDB_STREAM_BATCHING_WINDOW = var.CHAT_DDB_STREAM_BATCHING_WINDOW
}
