variable "LAMBDA_ARN" {}
variable "SOURCE_ARN" {}
variable "BATCH_SIZE" {
  default = 1
}
resource "aws_lambda_event_source_mapping" "source_trigger" {
  batch_size       = var.BATCH_SIZE
  event_source_arn = var.SOURCE_ARN
  enabled          = true
  function_name    = var.LAMBDA_ARN
}
