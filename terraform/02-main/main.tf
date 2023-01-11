data "terraform_remote_state" "this" {
  backend = "s3"
  config = {
    bucket = "s3-bucket-tfstate-1234jduyecjzj"
    key = "shared.tfstate"
    region = "eu-west-3"
  }
}

module "dynamodb" {
  source = "./modules/01-dynamodb-bdd"
  # Input variables used by module
  table_name = var.table_name
}

module "lambda" {
  source = "./modules/02-lambda-back"
  # Input variables used by module
  environment    = var.environment
  subdomain_name = var.subdomain_name
  lambda_name    = var.lambda_name
  dynamodb_arn   = module.dynamodb.dynamodb_arn
}

module "s3" {
  source = "./modules/03-s3-front"
  # Input variables used by module
  environment = var.environment
}

// Cloudfront distributions takes some time to deploy,
// and this module needs the cloudfront distribution
// to be fully deployed to finish successfully
module "cloudfront" {
  source = "./modules/04-cloudfront-cache"
  # Input variables used by module
  environment                 = var.environment
  subdomain_name              = var.subdomain_name
  base64_basic_auth           = var.base64_basic_auth
  certificate_arn             = data.terraform_remote_state.this.outputs.certificate_arn
  bucket_name                 = module.s3.bucket_name
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  lambda_function_url         = module.lambda.lambda_function_url
  lambda_function_url_id      = module.lambda.lambda_function_url_id
}

module "route53" {
  source = "./modules/05-route53-dns"
  # Input variables used by module
  environment                  = var.environment
  domain_name                  = var.domain_name
  subdomain_name               = var.subdomain_name
  zone_id                      = data.terraform_remote_state.this.outputs.zone_id
  cloudfront_domain_name       = module.cloudfront.cloudfront_domain_name
  cloudfront_zone_id           = module.cloudfront.cloudfront_zone_id
}
