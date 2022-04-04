variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "LAMBDA_ARN" {}
variable "TAGS" {}

resource "aws_iam_role" "iam_role" {
  name = "${var.ENV}-${var.FEATURE_NAME}-appsync-data-source"

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
  name = "${var.ENV}-${var.FEATURE_NAME}-appsync-data-source"
  role = aws_iam_role.iam_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Sid" : "1",
        "Effect" : "Allow",
        "Action" : "lambda:InvokeFunction",
        "Resource" : "${var.LAMBDA_ARN}"
      }
    ]
  })
}

resource "aws_appsync_datasource" "lambda_datasource" {
  api_id           = var.APPSYNC_API_ID
  name             = "${var.ENV}_appsync_lambda_datasource"
  type             = "AWS_LAMBDA"
  service_role_arn = aws_iam_role.iam_role.arn

  lambda_config {
    function_arn = var.LAMBDA_ARN
  }
}

output "name" {
  value = "${var.ENV}_appsync_lambda_datasource"
}
