variable "DOMAIN_ARN" {}
variable "TAGS" {}
variable "LB_ARN" {}
variable "LB_FRONT_END_HTTPS" {}
variable "LB_FRONT_END_HTTP" {}
variable "VPC_ID" {}

variable "target_groups" {
  type = any
  default = [
    {
      name_prefix          = "MkSrch"
      backend_protocol     = "HTTP"
      backend_port         = 80
      target_type          = "instance"
      deregistration_delay = 60
      health_check = {
        healthy_threshold   = 2
        matcher             = "200"
        unhealthy_threshold = 3
        interval            = 60
        path                = "/health"
      }
      stickiness = {
        enabled = false
        type    = "lb_cookie"
      }
    }
  ]
}

variable "https_listener_rules" {
  type = any
  default = [
    {
      https_listener_index = 0
      actions = [
        {
          type               = "forward"
          target_group_index = 0
        }
      ]
      conditions = [
        {
          path_patterns = [
            "/chat/search",
            "/chat/search/*"
          ]
        }
      ]
      # For marketing search priority can comes from 10 to 19
      priority = 10
    },
    {
      https_listener_index = 0
      actions = [
        {
          type               = "forward"
          target_group_index = 0
        }
      ]
      conditions = [
        {
          path_patterns = [
            "/supplier/search",
            "/supplier/search/*"
          ]
        }
      ]
      # For marketing search priority can comes from 10 to 19
      priority = 11
    }
  ]
}

module "SEARCH_LB" {
  source               = "TravelOffice/application-loadbalancer/aws"
  vpc_id               = var.VPC_ID
  https_listener_rules = var.https_listener_rules
  lb_front_end_http    = var.LB_FRONT_END_HTTP
  lb_front_end_https   = var.LB_FRONT_END_HTTPS
  target_groups        = var.target_groups
  tags                 = var.TAGS
}

output "search_lb_target_group_arn" {
  value = module.SEARCH_LB.search_lb_target_group_arn
}

