variable "environment" {
  description = "Environment for the ressource"
}

variable "subdomain_name" {
  description = "Subdomain name (eg : staging.example.com)"
}

variable "lambda_name" {
  description = "Function name"
}

variable "dynamodb_arn" {
  description = "DynamoDB table arn"
}
