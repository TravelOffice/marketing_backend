variable "ENV" {}
variable "AWS_REGION" {}
variable "VPC_CIDR" {}
variable "PREFIX" {}
variable "PRIVATE_SUBNETS_CIDR" {}
variable "PUBLIC_SUBNETS_CIDR" {}
variable "DATABASE_SUBNETS_CIDR" {}

module "VPC" {
  source               = "terraform-aws-modules/vpc/aws"
  version              = "3.11.0"
  name                 = "${var.ENV}-${var.PREFIX}-vpc"
  cidr                 = var.VPC_CIDR
  azs                  = ["${var.AWS_REGION}a", "${var.AWS_REGION}b"]
  private_subnets      = var.PRIVATE_SUBNETS_CIDR
  public_subnets       = var.PUBLIC_SUBNETS_CIDR
  database_subnets     = var.DATABASE_SUBNETS_CIDR
  enable_nat_gateway   = false
  enable_dhcp_options  = true
  enable_dns_hostnames = true

  tags = {
    Terraform = true
    ENV       = var.ENV
  }
}

output "id" {
  description = "The ID of the Root VPC"
  value       = module.VPC.vpc_id
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.VPC.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.VPC.public_subnets
}

output "database_subnets" {
  description = "List of IDs of database subnets"
  value       = module.VPC.database_subnets
}
