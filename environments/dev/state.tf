terraform {
  backend "s3" {
    encrypt = true
    key     = "environments/dev/terraform.tfstate"
    region  = "ap-southeast-1"
  }
}

provider "aws" {
  region = "ap-southeast-1"
}