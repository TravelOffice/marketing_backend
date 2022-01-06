terraform{
    backend "s3" {
        bucket = "root-infrastructure"
        encrypt = true
        key = "environments/prod/terraform.tfstate"
        region = "ap-southeast-1"
    }
}

provider "aws" {
    region = "ap-southeast-1"
}