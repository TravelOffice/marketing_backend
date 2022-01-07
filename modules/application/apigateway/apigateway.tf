variable ENV {}
variable lambda_arns {}
variable API_ENDPOINTS {}

module "API_GATEWAY" {
  source = "terraform-aws-modules/apigateway-v2/aws"
  version = "~> 1.5.1"

  name          = "${var.ENV}-http"
  description   = "My awesome REST API Gateway"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["*"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  # Custom domain
  create_api_domain_name        = false  # to control creation of API Gateway Domain Name
  # domain_name                 = "terraform-aws-modules.modules.tf"
  # domain_name_certificate_arn = "arn:aws:acm:eu-west-1:052235179155:certificate/2b3a7ed9-05e1-4f9e-952b-27744ba06da6"

  # Access logs
  # default_stage_access_log_destination_arn = "arn:aws:logs:eu-west-1:835367859851:log-group:debug-apigateway"
  # default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  # Routes and integrations
  integrations = {
    for key, value in var.API_ENDPOINTS : "${value.method} ${value.path}" => {
        lambda_arn             = var.lambda_arns[value.lambda_name]
        payload_format_version = "2.0"
        timeout_milliseconds   = 12000
      }
  }
  # # Routes and integrations
  # integrations = {
  #   "POST /" = {
  #     lambda_arn             = "arn:aws:lambda:eu-west-1:052235179155:function:my-function"
  #     payload_format_version = "2.0"
  #     timeout_milliseconds   = 12000
  #   }

  #   "$default" = {
  #     lambda_arn = "arn:aws:lambda:eu-west-1:052235179155:function:my-default-function"
  #   }
  # }

  tags = {
    Name = "http-apigateway"
  }
}