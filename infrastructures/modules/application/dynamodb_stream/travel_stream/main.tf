variable "ENV" {}
variable "FEATURE_NAME" {}
variable "TAGS" {}
variable "TRAVEL_DDB_STREAM_ARN" {}
variable "TRAVEL_DDB_STREAM_BATCH_SIZE" {}
variable "TRAVEL_LAMBDA_STREAM_HANDLER_ARN" {}
variable "TRAVEL_DDB_STREAM_BATCHING_WINDOW" {}

module "sale_ddb_stream_trigger" {
  source                            = "./trigger"
  ENV                               = var.ENV
  FEATURE_NAME                      = var.FEATURE_NAME
  TAGS                              = var.TAGS
  TRAVEL_DDB_STREAM_ARN             = var.TRAVEL_DDB_STREAM_ARN
  TRAVEL_DDB_STREAM_BATCH_SIZE      = var.TRAVEL_DDB_STREAM_BATCH_SIZE
  TRAVEL_LAMBDA_STREAM_HANDLER_ARN  = var.TRAVEL_LAMBDA_STREAM_HANDLER_ARN
  TRAVEL_DDB_STREAM_BATCHING_WINDOW = var.TRAVEL_DDB_STREAM_BATCHING_WINDOW
}
