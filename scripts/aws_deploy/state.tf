terraform {
  backend "s3" {
    encrypt = true
    bucket  = "TF_BUCKET_VALUE"
    key     = "marketing/backend/environments/ENV_VALUE/testing/pull-request-PR_NUMBER_VALUE/terraform.tfstate"
    region  = "ap-southeast-1"
  }
}
