module "REMOTE_STATE" {
  source              = "./tf_remote_state"
  ENV                 = var.ENV
  REMOTE_TF_BUCKET    = var.TF_BUCKET
  REMOTE_FEATURE_NAME = local.remote_feature_name
  REMOTE_AWS_REGION   = var.AWS_REGION
}
locals {
  name_post_fix       = var.NAME_POST_FIX
  remote_feature_name = "base_infrastructure"
  lambda_vars = merge({
    NODE_ENV          = var.ENV
    SECRET_MANAGER_ID = module.REMOTE_STATE.STATE.MARKETING.backend.secret_manager.id
  }, var.LAMBDA_ENV)
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket_prefix = format("%s-%s-%s", var.ENV, replace(var.LAMBDA_FUNCTION_NAME, "_", "-"), local.name_post_fix)
}

resource "aws_s3_object" "lambda_object" {
  bucket = aws_s3_bucket.lambda_bucket.bucket
  key    = format("%s/%s", "lambda", local.name_post_fix)
  source = var.LAMBDA_PATH

  etag = filemd5(var.LAMBDA_PATH)
}

resource "aws_s3_object" "layer_object" {
  bucket = aws_s3_bucket.lambda_bucket.bucket
  key    = format("%s/%s", "layer", local.name_post_fix)
  source = var.LAMBDA_LAYER_PATH

  etag = filemd5(var.LAMBDA_LAYER_PATH)
}
resource "aws_iam_role" "lambda_exec" {
  name_prefix         = lower("${var.ENV}-${var.LAMBDA_FUNCTION_NAME}-${local.name_post_fix}")
  assume_role_policy  = data.aws_iam_policy_document.assume_role_policy.json
  managed_policy_arns = [aws_iam_policy.policy.arn]
}

resource "aws_lambda_layer_version" "lambda_layer" {
  layer_name = lower("${var.ENV}-${var.LAMBDA_FUNCTION_NAME}-${local.name_post_fix}")

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.layer_object.id

  compatible_runtimes      = ["nodejs14.x"]
  compatible_architectures = ["arm64"]
}
resource "aws_lambda_function" "lambda_function" {
  function_name = lower("${var.ENV}-${var.LAMBDA_FUNCTION_NAME}-${local.name_post_fix}")

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_object.key

  runtime = "nodejs14.x"
  handler = "lambda.handler"

  source_code_hash = filebase64sha256(var.LAMBDA_PATH)

  role = aws_iam_role.lambda_exec.arn

  layers = [aws_lambda_layer_version.lambda_layer.arn]

  vpc_config {
    subnet_ids         = module.REMOTE_STATE.STATE.MARKETING.backend.vpc.private_subnets
    security_group_ids = ["sg-0793cbc3b0b4cde48"]
  }

  environment {
    variables = local.lambda_vars
  }

}

resource "aws_api_gateway_rest_api" "rest_api" {
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "${var.ENV}-${var.FEATURE_NAME}"
      version = "1.0"
    }
    paths = {
      for pathKey, pathValue in var.API_ENDPOINTS : pathKey => merge(
        {
          for methodKey, methodValue in pathValue : lower(methodKey) => {
            x-amazon-apigateway-integration = {
              httpMethod           = "POST"
              payloadFormatVersion = "1.0"
              type                 = "AWS_PROXY"
              passthroughBehavior  = "when_no_match"
              uri                  = "arn:aws:apigateway:${var.AWS_REGION}:lambda:path/2015-03-31/functions/${aws_lambda_function.lambda_function.arn}/invocations"
            }
          }
        },
        {
          options = {
            summary     = "CORS support",
            description = "Enable CORS by returning correct headers\n",
            tags = [
              "CORS"
            ],
            responses = {
              200 = {
                description = "Default response for CORS method",
                headers = {
                  Access-Control-Allow-Origin = {
                    schema = {
                      type = "string"
                    }
                  },
                  Access-Control-Allow-Methods = {
                    schema = {
                      type = "string"
                    }
                  },
                  Access-Control-Allow-Headers = {
                    schema = {
                      type = "string"
                    }
                  }
                },
                content = {}
              }
            },
            x-amazon-apigateway-integration = {
              type = "mock",
              requestTemplates = {
                "application/json" = "{\n  \"statusCode\" : 200\n}\n"
              },
              responses = {
                default = {
                  statusCode = "200",
                  responseParameters = {
                    "method.response.header.Access-Control-Allow-Headers" = format("'%s'", join(",", var.CORS_CONFIGURATION.allow_headers)),
                    "method.response.header.Access-Control-Allow-Methods" = format("'%s'", join(",", var.CORS_CONFIGURATION.allow_methods)),
                    "method.response.header.Access-Control-Allow-Origin"  = format("'%s'", join(",", var.CORS_CONFIGURATION.allow_origins)),
                  },
                  responseTemplates = {
                    "application/json" = "{}\n"
                  }
                }
              }
            }
          }
        }
      )
    }
  })

  name = lower("${var.ENV}-${var.LAMBDA_FUNCTION_NAME}-${local.name_post_fix}")

  endpoint_configuration {
    types = ["REGIONAL"]
  }

}

locals {
  mapping_method_lambda_name = flatten([
    for path in keys(var.API_ENDPOINTS) : [
      for key, value in var.API_ENDPOINTS[path] : {
        path           = path
        statement_path = replace(path, "/[^a-zA-Z0-9 -]/", "_")
        method         = key
        lambda_name    = var.LAMBDA_FUNCTION_NAME
      }
    ]
  ])
}

# Get current aws account information
data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "api_gatewway_invoke_lambda_permission" {
  for_each      = { for api in local.mapping_method_lambda_name : lower("${api.path}_${api.method}") => api }
  statement_id  = "${var.ENV}-${var.FEATURE_NAME}-${each.value.statement_path}-${each.value.method}-AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.AWS_REGION}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.rest_api.id}/*/${each.value.method}${each.value.path}"
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

resource "aws_api_gateway_stage" "api_gateway_stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = var.ENV
}


data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "policy" {
  name_prefix = lower("${var.ENV}-${var.LAMBDA_FUNCTION_NAME}-${local.name_post_fix}")

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ec2:DescribeInstances",
        "ec2:CreateNetworkInterface",
        "ec2:AttachNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "autoscaling:CompleteLifecycleAction"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords",
        "xray:GetSamplingRules",
        "xray:GetSamplingTargets",
        "xray:GetSamplingStatisticSummaries"
      ],
      "Effect": "Allow",
      "Resource": [
          "*"
      ]
    },
    {
      "Action": [
        "secretsmanager:GetResourcePolicy",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecretVersionIds"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF

}
