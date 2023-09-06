variable "AWS_REGION" {}
variable "ENV" {}
variable "TAGS" {}

locals {
  volume_name = "${var.ENV}-marketing-search-ebs"
}

resource "aws_ebs_volume" "volume" {
  availability_zone = "${var.AWS_REGION}a"
  size              = var.ENV == "dev" ? 10 : 40
  final_snapshot    = true
  type              = "gp3"
  encrypted         = true

  tags = merge(
    var.TAGS,
    {
      Name = local.volume_name
    }
  )
}
output "volume_id" {
  value = aws_ebs_volume.volume.id
}
## add backup ebs
resource "aws_backup_vault" "vault" {
  name = "${var.ENV}-marketing-search-vault-ebs"
}
resource "aws_backup_plan" "backup" {
  name = "${var.ENV}-marketing-search-ebs-bk-plan"
  rule {
    rule_name         = "marketing-search-rule-bk-ebs"
    target_vault_name = aws_backup_vault.vault.name
    schedule          = var.schedule_backup_plan
    lifecycle {
      cold_storage_after = 0
      delete_after       = var.ENV == "dev" ? 2 : 10
    }
  }
}

resource "aws_iam_role" "backup-role" {
  name               = "${var.ENV}-marketing-search-ebs-backup-role"
  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["sts:AssumeRole"],
      "Effect": "allow",
      "Principal": {
        "Service": ["backup.amazonaws.com"]
      }
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "backup-role" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
  role       = aws_iam_role.backup-role.name
}

resource "aws_backup_selection" "selection" {
  name    = "marketing-search-selection-ebs"
  plan_id = aws_backup_plan.backup.id
  selection_tag {
    type  = var.backup_selection_resource.type
    key   = var.backup_selection_resource.key
    value = local.volume_name
  }
  iam_role_arn = aws_iam_role.backup-role.arn
}
