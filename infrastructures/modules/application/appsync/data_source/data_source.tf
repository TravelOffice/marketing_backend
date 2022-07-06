variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "LAMBDA_ARN" {}
variable "DYNAMODB_ARN" {}
variable "DYNAMODB_NAME" {}
variable "TAGS" {}

resource "aws_iam_role" "iam_role" {
  name_prefix = "${var.ENV}-${var.FEATURE_NAME}-appsync-ds"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Sid" : "1",
        "Effect" : "Allow",
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "appsync.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "role_policy" {
  name_prefix = "${var.ENV}-${var.FEATURE_NAME}-appsync-ds"
  role        = aws_iam_role.iam_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Action" : "lambda:InvokeFunction",
        "Resource" : "${var.LAMBDA_ARN}"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:GetItem",
          "dynamodb:Query"
        ],
        "Resource" : [
          "${var.DYNAMODB_ARN}",
          "${var.DYNAMODB_ARN}/*"
        ]
      }
    ]
  })
}

resource "aws_appsync_datasource" "lambda_datasource" {
  api_id           = var.APPSYNC_API_ID
  name             = "${var.ENV}_lambda_datasource"
  type             = "AWS_LAMBDA"
  service_role_arn = aws_iam_role.iam_role.arn

  lambda_config {
    function_arn = var.LAMBDA_ARN
  }
}

resource "aws_appsync_datasource" "dynamodb_datasource" {
  api_id           = var.APPSYNC_API_ID
  name             = "${var.ENV}_dynamodb_datasource"
  service_role_arn = aws_iam_role.iam_role.arn
  type             = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = var.DYNAMODB_NAME
  }
}

resource "aws_appsync_datasource" "none_datasource" {
  api_id           = var.APPSYNC_API_ID
  name             = "${var.ENV}_none_datasource"
  service_role_arn = aws_iam_role.iam_role.arn
  type             = "NONE"
}
