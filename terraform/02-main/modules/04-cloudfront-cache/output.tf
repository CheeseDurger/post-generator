output "cloudfront_domain_name" {
    value = aws_cloudfront_distribution.this.domain_name
}

output "cloudfront_zone_id" {
    value = aws_cloudfront_distribution.this.hosted_zone_id
}
