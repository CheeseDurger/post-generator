variable "environment" {
  description = "Environment for the ressource"
}

variable "subdomain_name" {
  description = "Subdomain name (eg : staging.example.com)"
}

variable "base64_basic_auth" {
  description = "Header for basic auth, base64 encoded, used in staging"
}

variable "certificate_arn" {
  description = "ACM certificate arn"
}

variable "bucket_name" {
  description = "S3 bucket name"
}

variable "bucket_regional_domain_name" {
  description = "S3 bucket regional domain name"
}

variable "lambda_function_url" {
  description = "Lambda function url"
}

variable "lambda_function_url_id" {
  description = "Lambda function url id"
}