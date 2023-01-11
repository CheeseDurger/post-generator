variable "environment" {
  description = "Environment for the ressource"
}

variable "domain_name" {
  description = "Domain name (eg : example.com)"
}

variable "subdomain_name" {
  description = "Subdomain name (eg : staging.example.com)"
}

variable "zone_id" {
  description = "DNS hosted zone id"
}

variable "cloudfront_domain_name" {
  description = "S3 bucket regional domain name"
}

variable "cloudfront_zone_id" {
  description = "CloudFront Route 53 zone ID that is used to route an alias record"
}
