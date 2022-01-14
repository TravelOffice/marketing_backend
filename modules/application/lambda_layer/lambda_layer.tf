variable "LAMBDA_LAYERS" {}
variable "ENV" {}
variable "FEATURE_NAME" {}
variable "S3_BUCKET" {
  default = "codepipeline-artifacts20220108172710412300000001"
}

data "external" "worker_zip" {
  for_each = var.LAMBDA_LAYERS
  program  = [format("%s/../../../%s", path.module, "scripts/zip.sh"), format("%s/../../../%s", path.module, "deploy/${each.key}_layer.zip"), format("%s/../../../%s", path.module, each.value.path)]
}

resource "aws_s3_bucket_object" "layer_object" {
  for_each = var.LAMBDA_LAYERS
  bucket   = var.S3_BUCKET
  key      = "execution/${var.ENV}-${var.FEATURE_NAME}-${each.key}-layer"
  source   = format("%s/../../../%s", path.module, "deploy/${each.key}_layer.zip")
  etag     = data.external.worker_zip[each.key].result.md5
}
resource "aws_lambda_layer_version" "layer" {
  for_each          = var.LAMBDA_LAYERS
  layer_name        = "${var.ENV}-${var.FEATURE_NAME}-${each.key}-layer"
  s3_bucket         = var.S3_BUCKET
  s3_key            = aws_s3_bucket_object.layer_object[each.key].id
  s3_object_version = aws_s3_bucket_object.layer_object[each.key].version_id

  compatible_runtimes      = ["nodejs14.x"]
  compatible_architectures = ["arm64"]
}

output "lambda_layer_arns" {
  value = { for key, value in var.LAMBDA_LAYERS : key => aws_lambda_layer_version.layer[key].arn }
}
