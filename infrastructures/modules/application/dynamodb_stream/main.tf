variable "ENV" {}
variable "FEATURE_NAME" {}
variable "TAGS" {}
variable "MARKETPLACE_DDB_STREAM_ARN" {}
variable "MARKETPLACE_DDB_STREAM_BATCH_SIZE" {}
variable "MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN" {}

module "marketplace_ddb_stream_trigger" {
  source                      = "./trigger"
  ENV                         = var.ENV
  FEATURE_NAME                = var.FEATURE_NAME
  TAGS                        = var.TAGS
  MARKETPLACE_DDB_STREAM_ARN  = var.MARKETPLACE_DDB_STREAM_ARN
  MARKETPLACE_DDB_STREAM_BATCH_SIZE     = var.MARKETPLACE_DDB_STREAM_BATCH_SIZE
  MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN = var.MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN
}
