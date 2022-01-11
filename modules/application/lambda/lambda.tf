variable "MARKETING_PRIVATE_SUBNETS" {}

variable "MARKETING_VPC_ID" {}
variable "lambda_layer_arns" {}
variable "LAMBDA_FUNCTIONS" {}
variable ENV {}

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
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${var.ENV}-${each.key}"
  description   = "Sample lambda function"
  handler       = "index.handler"
  runtime       = "nodejs14.x"

  source_path = format("%s/../../../%s", path.module, each.value.path)
  hash_extra  = each.key
  ignore_source_code_hash = true

  layers = [
    for layer in each.value.layers: var.lambda_layer_arns[layer]
  ]

  vpc_subnet_ids         = var.MARKETING_PRIVATE_SUBNETS
  vpc_security_group_ids = [aws_security_group.lambda_sg.id]
  attach_network_policy = true
}

output "lambda_arns" {
  value = {for key, value in var.LAMBDA_FUNCTIONS: key => module.lambda_function[key].lambda_function_arn}
}