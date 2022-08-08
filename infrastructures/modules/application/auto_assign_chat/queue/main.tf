variable "NEW_CONVERSATION_LAMBDA_ARN" {}
variable "NEW_CONVERSATION_QUEUE_ARN" {}

resource "aws_lambda_event_source_mapping" "new_conversation_queue_trigger" {
  batch_size       = 1
  event_source_arn = var.NEW_CONVERSATION_QUEUE_ARN
  enabled          = true
  function_name    = var.NEW_CONVERSATION_LAMBDA_ARN
}
