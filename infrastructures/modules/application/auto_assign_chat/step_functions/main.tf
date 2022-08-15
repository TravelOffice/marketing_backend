variable "ENV" {}
variable "NAME" {}
variable "FEATURE_NAME" {}
variable "TEMPLATE_FILE" {}

variable "TYPE" {
  default = "STANDARD"
}


variable "CUSTOM_POLICIES" {
  default = []
}

variable "AWS_POLICIES" {
  default = []
}

variable "TAGS" {}

data "aws_iam_policy_document" "auto_assign_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["states.amazonaws.com"]
    }
  }
}

module "role" {
  source             = "../../../iam"
  NAME               = "${var.ENV}-auto_assign_sfn_role"
  CUSTOM_POLICIES    = var.CUSTOM_POLICIES
  AWS_POLICIES       = var.AWS_POLICIES
  ASSUME_ROLE_POLICY = data.aws_iam_policy_document.auto_assign_assume_role_policy.json
  TAGS               = var.TAGS
}

resource "aws_sfn_state_machine" "auto_assign_sfn_state_machine" {
  name     = var.NAME
  role_arn = module.role.arn
  type     = var.TYPE

  definition = templatefile(
    format("%s/%s.tftpl", "../../modules/application/auto_assign_chat/step_functions/template", var.TEMPLATE_FILE),
    {}
  )
}

output "auto_assign_sfn_state_machine_arn" {
  value       = aws_sfn_state_machine.auto_assign_sfn_state_machine.arn
  description = "The arn of AWS StepFunctions which will be used by lambda to call startExecution function."
  sensitive   = true
}
