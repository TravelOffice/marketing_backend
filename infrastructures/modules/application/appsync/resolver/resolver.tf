variable "ENV" {}
variable "FEATURE_NAME" {}
variable "APPSYNC_API_ID" {}
variable "APPSYNC_RESOLVERS" {}
variable "APPSYNC_FUNCTIONS_ID" {}

locals {
  appsync_default_config = {
    kind        = null,
    data_source = null
  }
  root_path = format("%s/../../..", path.root)
}

resource "aws_appsync_resolver" "resolver" {
  for_each    = var.APPSYNC_RESOLVERS
  api_id      = var.APPSYNC_API_ID
  field       = each.value.field
  type        = each.value.type
  kind        = try(each.value.kind, local.appsync_default_config.kind)
  data_source = can(each.value.data_source) ? lower("${var.ENV}_${each.value.data_source}") : local.appsync_default_config.data_source
  code        = file(format("%s/%s", local.root_path, each.value.code.path))
  runtime {
    name            = "APPSYNC_JS"
    runtime_version = "1.0.0"
  }
  dynamic "pipeline_config" {
    for_each = can(each.value.pipeline_config) ? [each.value.pipeline_config] : []
    content {
      functions = [
        for function in pipeline_config.value.functions : var.APPSYNC_FUNCTIONS_ID[function]
      ]
    }
  }
  dynamic "caching_config" {
    for_each = can(each.value.caching_config) ? [each.value.caching_config] : []
    content {
      caching_keys = caching_config.value.caching_keys
      ttl          = caching_config.value.ttl
    }
  }
}
