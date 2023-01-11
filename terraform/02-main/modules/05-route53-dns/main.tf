// Route53 must be managed in us-east-1
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  required_version = ">= 0.14.9"
}

data "terraform_remote_state" "this" {
  backend = "s3"
  config = {
    bucket = "s3-bucket-tfstate-1234jduyecjzj"
    key = "shared.tfstate"
    region = "eu-west-3"
  }
}

resource "aws_route53_record" "a" {
  zone_id = var.zone_id
  name    = var.subdomain_name
  type    = "A"

  alias {
    name    = var.cloudfront_domain_name
    zone_id = var.cloudfront_zone_id

    # Hardcoded value for CloudFront
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "txt" {
  zone_id = var.zone_id
  name    = var.subdomain_name
  type    = "TXT"
  records = ["google-site-verification=UmyrD3cKT3gcNezLKhPwFJhVBp78C6-HunexCseN0Og"]
  ttl     = 3600
}
