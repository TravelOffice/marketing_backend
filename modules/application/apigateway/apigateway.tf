variable ENV {}
variable lambda_arns {}
variable API_ENDPOINTS {}
variable AWS_REGION {}
variable FEATURE_NAME {}

# Get current aws account information
data "aws_caller_identity" "current" {}

resource "aws_api_gateway_rest_api" "rest_api" {
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "${var.ENV}-${var.FEATURE_NAME}"
      version = "1.0"
    }
    paths = {
      for key, value in var.API_ENDPOINTS : key => {
        lower(value.method) = {
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = "arn:aws:apigateway:${var.AWS_REGION}:lambda:path/2015-03-31/functions/${var.lambda_arns[value.lambda_name]}/invocations"
          }
        }
      }
    }
  })

  name = lower("${var.ENV}-${var.FEATURE_NAME}")

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.rest_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_permission" "api_gatewway_invoke_lambda_permission" {
  for_each = var.API_ENDPOINTS
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${var.ENV}-${each.value.lambda_name}"
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.AWS_REGION}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.rest_api.id}/*/${each.value.method}${each.key}"
}

resource "aws_api_gateway_stage" "api_gateway_stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = var.ENV
}