variable "ENV" {}
variable "FEATURE_NAME" {}
variable "MARKETPLACE_DDB_STREAM_ARN" {}
variable "MARKETPLACE_DDB_STREAM_BATCH_SIZE" {}
variable "MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN" {}
variable "MARKETPLACE_DDB_STREAM_BATCHING_WINDOW" {}
variable "TAGS" {}

resource "aws_lambda_event_source_mapping" "lambda_dynamodb" {
  event_source_arn                   = var.MARKETPLACE_DDB_STREAM_ARN
  function_name                      = var.MARKETPLACE_LAMBDA_STREAM_HANDLER_ARN
  batch_size                         = var.MARKETPLACE_DDB_STREAM_BATCH_SIZE
  starting_position                  = "LATEST"
  maximum_batching_window_in_seconds = var.MARKETPLACE_DDB_STREAM_BATCHING_WINDOW
}
