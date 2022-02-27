variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "APPSYNC_RESOLVERS" {}
variable "DATA_SOURCE" {}


# UNIT type resolver (default)
resource "aws_appsync_resolver" "test" {
  for_each    = var.APPSYNC_RESOLVERS
  api_id      = var.APPSYNC_API_ID
  field       = each.value.field
  type        = each.value.type
  data_source = var.DATA_SOURCE
  request_template = each.value.request_template
  response_template = each.value.response_template
}
