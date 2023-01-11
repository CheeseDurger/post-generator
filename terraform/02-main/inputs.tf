variable "environment" {
  description = "Environment for the ressource"
}

variable "domain_name" {
  description = "Domain name (eg : example.com)"
}

variable "subdomain_name" {
  description = "Subdomain name (eg : staging.example.com)"
}

variable "lambda_name" {
  description = "Function name"
}

variable "table_name" {
  description = "Table name"
}

variable "google_search_console_record" {
  description = "TXT record for Google Search Console"
}

variable "base64_basic_auth" {
  description = "Header for basic auth, base64 encoded, used in staging"
}
