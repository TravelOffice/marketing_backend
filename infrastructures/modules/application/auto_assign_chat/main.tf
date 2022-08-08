variable "ENV" {}
variable "FEATURE_NAME" {}
variable "NEW_CONVERSATION_LAMBDA_ARN" {}
variable "NEW_CONVERSATION_QUEUE_ARN" {}
variable "TAGS" {}

module "NEW_CONVERSATION_QUEUE_CONFIGURATION" {
  source                      = "./queue"
  NEW_CONVERSATION_LAMBDA_ARN = var.NEW_CONVERSATION_LAMBDA_ARN
  NEW_CONVERSATION_QUEUE_ARN  = var.NEW_CONVERSATION_QUEUE_ARN
}

module "AUTO_ASSIGN_STEP_FUNCTION_CONFIGURATION" {
  source            = "./step_functions"
  ENV               = var.ENV
  FEATURE_NAME      = var.FEATURE_NAME
  NAME              = "${var.ENV}-auto-assign-chat"
  TEMPLATE_FILE     = "auto_assign_step_functions"
  TAGS              = var.TAGS
  CUSTOM_POLICIES = [
    "StandardStepFunction",
    "DynamoTableReadWrite",
    "SESSendMail"
  ]
}
