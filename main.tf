resource "aws_s3_bucket" "codepipeline_artifacts" {
  acl           = "private"
  bucket_prefix = "backend-deploy-test"

  versioning {
    enabled = true
  }
}