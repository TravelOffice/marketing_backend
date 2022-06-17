variable "AWS_REGION" {
  default = "ap-southeast-1"
}

variable "ENV" {
  default = "ENV_VALUE"
}

variable "FEATURE_NAME" {
  default = "marketing-backend"
}

variable "TF_BUCKET" {
  default = "TF_BUCKET_VALUE"
}

variable "CORS_CONFIGURATION" {
  description = "Cognito User Pool Arn"
  default = {
    allow_headers = ["Content-Type", "X-Amz-Date,Authorization", "X-Api-Key", "X-Amz-Security-Token"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }
}

variable "NAME_POST_FIX" {
  default = "NAME_POST_FIX_VALUE"
}
