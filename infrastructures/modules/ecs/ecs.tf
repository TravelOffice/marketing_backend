variable "ENV" {}
variable "FEATURE_NAME" {}
variable "CUSTOM_POLICIES" {
  default = []
}
variable "AWS_POLICIES" {
  default = []
}
variable "AWS_REGION" {}
variable "TAGS" {}
variable "PUBLIC_SUBNETS" {}
variable "PRIVATE_SUBNETS" {}
variable "SUPPLIER_CRAWLER_TASK_ENV" {}
variable "VPC_ID" {}
variable "SCHEDULE_EXPRESSION" {}

locals {
  cluster_name = "${upper("${var.ENV}-${var.FEATURE_NAME}")}-CLUSTER"
}

module "ECS_CLUSTER" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "4.0.1"

  cluster_name = local.cluster_name

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 100
      }
    }
  }

  tags = var.TAGS
}

resource "aws_ecr_repository" "marketing" {
  name = lower("${var.ENV}-${var.FEATURE_NAME}-supplier-crawler")
}

module "docker-build" {
  source  = "TravelOffice/docker-build/aws"
  version = "0.0.2"

  ecr_repo      = split("/", aws_ecr_repository.marketing.repository_url)[1]
  ecr_repo_tags = var.TAGS
  source_path   = format("%s/%s", "../../..", "src/modules/supplier_crawler_service")

  ecr_repo_lifecycle_policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep only the last 2 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 2
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

module "TASK_ROLE" {
  source             = "../role"
  NAME               = "${lower("${var.ENV}-${var.FEATURE_NAME}")}-TaskRole"
  CUSTOM_POLICIES    = var.CUSTOM_POLICIES
  AWS_POLICIES       = var.AWS_POLICIES
  ASSUME_ROLE_POLICY = data.aws_iam_policy_document.assume_role_policy.json
  TAGS               = var.TAGS
}

module "ECS_SUPPLIER_CRAWLER_TASK_DEFINITION" {
  source                    = "./task_definition/supplier_crawler"
  TASK_NAME                 = lower("${var.ENV}-${var.FEATURE_NAME}_supplier_crawler")
  TASK_ROLE_ARN             = module.TASK_ROLE.arn
  IMAGE_URI                 = module.docker-build.image_uri
  TASK_CPU                  = 256
  TASK_RAM                  = 512
  SUPPLIER_CRAWLER_TASK_ENV = var.SUPPLIER_CRAWLER_TASK_ENV
  AWS_REGION                = var.AWS_REGION
  ENV                       = var.ENV
  TAGS                      = var.TAGS
}

module "ECS_MAIL_API_SERVICE" {
  source = "./service/supplier_crawler"

  name_prefix     = "${var.ENV}-${var.FEATURE_NAME}-supplier_crawler-service"
  event_rule_name = "${var.ENV}-${var.FEATURE_NAME}-supplier_crawler-service-rule"
  // Run task at 17:00 UTC on day-of-month 1 
  event_rule_schedule_expression = var.SCHEDULE_EXPRESSION
  //event_rule_schedule_expression              = "cron(0/1 * * * ? *)"
  ecs_cluster_arn                             = module.ECS_CLUSTER.cluster_arn
  event_target_ecs_target_task_definition_arn = module.ECS_SUPPLIER_CRAWLER_TASK_DEFINITION.task_arn
  event_target_ecs_target_subnets             = var.PRIVATE_SUBNETS
  event_target_ecs_target_task_count          = 1
  ecs_execution_task_role_arn                 = module.TASK_ROLE.arn
}

output "name" {
  value = local.cluster_name
}
