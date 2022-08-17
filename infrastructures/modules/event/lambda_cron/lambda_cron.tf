variable "LAMBDA_CRONS" {}
variable "LAMBDA_ARNS" {}
variable "FEATURE_NAME" {}
variable "ENV" {}
variable "TAGS" {}

module "eventbridge" {
  source  = "terraform-aws-modules/eventbridge/aws"
  version = "1.14.1"

  for_each   = var.LAMBDA_CRONS
  create_bus = false

  rules = {
    "${var.ENV}-${var.FEATURE_NAME}-${each.key}" = {
      name                = "${var.ENV}-${var.FEATURE_NAME}-${each.key}"
      description         = "Trigger for a Lambda ${each.value.lambda_name}"
      schedule_expression = "${each.value.schedule_expression}"
    }
  }

  targets = {
    "${var.ENV}-${var.FEATURE_NAME}-${each.key}" = [
      {
        name  = "${var.ENV}-${var.FEATURE_NAME}-${each.key}"
        arn   = "${var.LAMBDA_ARNS[each.value.lambda_name]}"
        input = jsonencode({ "job" : "cron-by-rate" })
      }
    ]
  }

  tags = var.TAGS
}

resource "aws_lambda_permission" "eventbridge" {
  for_each      = var.LAMBDA_CRONS
  action        = "lambda:InvokeFunction"
  function_name = var.LAMBDA_ARNS[each.value.lambda_name]
  principal     = "events.amazonaws.com"
  source_arn    = module.eventbridge[each.key].eventbridge_rule_arns["${var.ENV}-${var.FEATURE_NAME}-${each.key}"]
}
