variable "MARKETING_PRIVATE_SUBNETS" {}

variable "MARKETING_VPC_ID" {}
variable "LAMBDA_LAYER_ARNS" {}
variable "LAMBDA_FUNCTIONS" {}
variable "ENV" {}
variable "FEATURE_NAME" {}
locals {
  lambda_default_config = {
    handler                           = "index.handler"
    memory_size                       = 128
    runtime                           = "nodejs14.x"
    timeout                           = 3
    architecture                      = "arm64"
    log_retention                     = 7
  }
}
resource "aws_security_group" "lambda_sg" {
  name_prefix = "lambda_sg"
  description = "Allow all outbound traffic"
  vpc_id      = var.MARKETING_VPC_ID

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

module "lambda_function" {
  for_each = var.LAMBDA_FUNCTIONS
  source   = "terraform-aws-modules/lambda/aws"

  function_name = "${var.ENV}-${var.FEATURE_NAME}-${each.key}"

  handler                           = try(each.value.handler, local.lambda_default_config.handler)
  runtime                           = try(each.value.runtime, local.lambda_default_config.runtime)
  architectures                     = [try(each.value.architecture, local.lambda_default_config.architecture)]
  memory_size                       = try(each.value.memory_size, local.lambda_default_config.memory_size)
  timeout                           = try(each.value.timeout, local.lambda_default_config.timeout)
  cloudwatch_logs_retention_in_days = try(each.value.log_retention, local.lambda_default_config.log_retention)

  source_path             = format("%s/../../../%s", path.module, each.value.path)
  hash_extra              = each.key
  ignore_source_code_hash = true

  layers = [
    for layer in each.value.layers : var.LAMBDA_LAYER_ARNS[layer]
  ]

  vpc_subnet_ids         = var.MARKETING_PRIVATE_SUBNETS
  vpc_security_group_ids = [aws_security_group.lambda_sg.id]
  attach_network_policy  = true
}

output "lambda_arns" {
  value = { for key, value in var.LAMBDA_FUNCTIONS : key => module.lambda_function[key].lambda_function_arn }
}
