variable "ENV" {}
variable "FEATURE_NAME" {}
variable "TRAVEL_DDB_STREAM_ARN" {}
variable "TRAVEL_DDB_STREAM_BATCH_SIZE" {}
variable "TRAVEL_LAMBDA_STREAM_HANDLER_ARN" {}
variable "TRAVEL_DDB_STREAM_BATCHING_WINDOW" {}
variable "TAGS" {}

resource "aws_lambda_event_source_mapping" "travel_lambda_dynamodb" {
  starting_position                  = "LATEST"
  event_source_arn                   = var.TRAVEL_DDB_STREAM_ARN
  function_name                      = var.TRAVEL_LAMBDA_STREAM_HANDLER_ARN
  batch_size                         = var.TRAVEL_DDB_STREAM_BATCH_SIZE
  maximum_batching_window_in_seconds = var.TRAVEL_DDB_STREAM_BATCHING_WINDOW
}
