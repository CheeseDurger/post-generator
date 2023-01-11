output "certificate_arn" {
    value = aws_acm_certificate.this.arn
}

output "zone_id" {
    value = aws_route53_zone.this.zone_id
}

# ######################
# ###### WARNING #######
# ######################
#
# To complete DNSSEC, you must manualy add the following 3 values in :
# AWS console > Route 53 > Registered domains > *your-domain* > DNSSEC status > Manage keys
output "key_type" {
    value = aws_route53_key_signing_key.this.flag
}
output "algorithm" {
    value = aws_route53_key_signing_key.this.signing_algorithm_mnemonic
}
output "public_key" {
    value = aws_route53_key_signing_key.this.public_key
}
