variable "ENV" {}
variable "FEATURE_NAME" {}
variable "REQUIRE_LOWERCASE" {
  default = true
}
variable "REQUIRE_NUMBERS" {
  default = true
}
variable "REQUIRE_SYMBOLS" {
  default = true
}
variable "REQUIRE_UPPERCASE" {
  default = true
}
variable "ALLOW_ADMIN_CREATE_USER_ONLY" {
  default = false
}
variable "UNUSED_ACCOUNT_VALIDITY_DAYS" {
  default = "7"
}
variable "MFA_CONFIGURATION" {
  default = "OFF"
}
variable "SMS_VERIFICATION_SUBJECT" {
  default = "Your verification code is {####}."
}
variable "SMS_MESSAGE" {
  default = "Your username is {username} and temporary password is {####}. If you do not log in within 7 days you'll need a new invite."
}
variable "SMS_AUTHENTICATION_MESSAGE" {
  default = "Your authentication code is {####}."
}
variable "EMAIL_VERIFICATION_SUBJECT" {
  default = "Your verification code"
}
variable "EMAIL_VERIFICATION_MESSAGE" {
  default = "Your verification code is {####}."
}
variable "EMAIL_MESSAGE" {
  default = "Your username is {username} and temporary password is {####}"
}
variable "DEFAULT_EMAIL_OPTION" {
  default = "CONFIRM_WITH_CODE"
}
variable "TAGS" {}
# variable "SCHEMAS" {
#   default = [{
#     name                     = "attribute1"
#     attribute_data_type      = "String"
#     developer_only_attribute = false
#     mutable                  = true  # false for "sub"
#     required                 = false # true for "sub"
#     string_attribute_constraints = { # if it is a string
#       min_length = 0                 # 10 for "birthdate"
#       max_length = 2048              # 10 for "birthdate"
#     }
#   }]
# }
variable "MINIMUM_LENGTH" {
  default = 8
}
variable "LAMBDA_TRIGGERS" {}
variable "LAMBDA_ARNS" {}

module "cognito_user_pool" {
  source                       = "corpit-consulting-public/cognito-user-pool/aws"
  version                      = "v3.0.8"
  name                         = "${var.ENV}-${var.FEATURE_NAME}-CognitoUserPool"
  sms_verification_message     = var.SMS_VERIFICATION_SUBJECT
  email_verification_subject   = var.EMAIL_VERIFICATION_SUBJECT
  email_verification_message   = var.EMAIL_VERIFICATION_MESSAGE
  email_message                = var.EMAIL_MESSAGE
  sms_message                  = var.SMS_MESSAGE
  default_email_option         = var.DEFAULT_EMAIL_OPTION
  mfa_configuration            = var.MFA_CONFIGURATION
  sms_authentication_message   = var.SMS_AUTHENTICATION_MESSAGE
  minimum_length               = var.MINIMUM_LENGTH
  require_lowercase            = var.REQUIRE_LOWERCASE
  require_numbers              = var.REQUIRE_NUMBERS
  require_symbols              = var.REQUIRE_SYMBOLS
  require_uppercase            = var.REQUIRE_UPPERCASE
  allow_admin_create_user_only = var.ALLOW_ADMIN_CREATE_USER_ONLY
  unused_account_validity_days = var.UNUSED_ACCOUNT_VALIDITY_DAYS
  post_authentication          = lookup(var.LAMBDA_ARNS, lookup(var.LAMBDA_TRIGGERS, "post_authentication", ""), "")
  post_confirmation            = lookup(var.LAMBDA_ARNS, lookup(var.LAMBDA_TRIGGERS, "post_confirmation", ""), "")
  pre_authentication           = lookup(var.LAMBDA_ARNS, lookup(var.LAMBDA_TRIGGERS, "pre_authentication", ""), "")
  pre_sign_up                  = lookup(var.LAMBDA_ARNS, lookup(var.LAMBDA_TRIGGERS, "pre_sign_up", ""), "")
  pre_token_generation         = lookup(var.LAMBDA_ARNS, lookup(var.LAMBDA_TRIGGERS, "pre_token_generation", ""), "")
  tags                         = var.TAGS
}

resource "aws_lambda_permission" "cognito_invoke_lambda_permission" {
  for_each      = var.LAMBDA_TRIGGERS
  statement_id  = "${var.ENV}-${var.FEATURE_NAME}-${each.value}-AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = "${var.ENV}-${var.FEATURE_NAME}-${each.value}"
  principal     = "cognito-sync.amazonaws.com"
  source_arn    = module.cognito_user_pool.arn
}
