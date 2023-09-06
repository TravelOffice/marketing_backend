variable "ENV" {}
variable "FEATURE_NAME" {}
variable "TAGS" {}

module "SEARCH_QUEUE" {
  source     = "./search"
  QUEUE_NAME = "${var.ENV}-${var.FEATURE_NAME}_search_queue"
  TAGS       = var.TAGS
}

output "search_queue_arn" {
  value = module.SEARCH_QUEUE.search_queue_arn
}

output "search_queue_name" {
  value = module.SEARCH_QUEUE.search_queue_name
}

output "search_queue_url" {
  value = module.SEARCH_QUEUE.search_queue_url
}
