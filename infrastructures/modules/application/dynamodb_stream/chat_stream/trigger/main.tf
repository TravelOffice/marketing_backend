variable "ENV" {}
variable "FEATURE_NAME" {}
variable "CHAT_DDB_STREAM_ARN" {}
variable "CHAT_DDB_STREAM_BATCH_SIZE" {}
variable "CHAT_LAMBDA_STREAM_HANDLER_ARN" {}
variable "CHAT_DDB_STREAM_BATCHING_WINDOW" {}
variable "TAGS" {}

resource "aws_lambda_event_source_mapping" "chat_lambda_dynamodb" {
  starting_position                  = "LATEST"
  event_source_arn                   = var.CHAT_DDB_STREAM_ARN
  function_name                      = var.CHAT_LAMBDA_STREAM_HANDLER_ARN
  batch_size                         = var.CHAT_DDB_STREAM_BATCH_SIZE
  maximum_batching_window_in_seconds = var.CHAT_DDB_STREAM_BATCHING_WINDOW
}
