variable "LAMBDA_LAYERS" {}
variable "ENV" {}

data "archive_file" "lambda_layer_zip" {
  for_each    = var.LAMBDA_LAYERS
  type        = "zip"
  source_dir  = format("%s/../../../%s", path.module, each.value.path)
  output_path = format("%s/../../../%s", path.module, "deploy/${each.key}_layer.zip")
}

resource "aws_lambda_layer_version" "layer" {
  for_each         = var.LAMBDA_LAYERS
  filename         = format("%s/../../../%s", path.module, "deploy/${each.key}_layer.zip")
  source_code_hash = data.archive_file.lambda_layer_zip[each.key].output_base64sha256
  layer_name       = "${var.ENV}_${each.key}_layer"

  compatible_runtimes      = ["nodejs14.x"]
  compatible_architectures = ["arm64"]
}

output "lambda_layer_arns" {
  value = { for key, value in var.LAMBDA_LAYERS : key => aws_lambda_layer_version.layer[key].arn }
}