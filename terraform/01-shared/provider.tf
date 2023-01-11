terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  required_version = ">= 0.14.9"
  backend "s3" {
    bucket         = "s3-bucket-tfstate-4029129"
    region         = "eu-west-3"
    key            = "shared.tfstate"
    dynamodb_table = "dynamodb-table-tfstate"
    acl            = "bucket-owner-full-control"
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      environment = "shared"
      project     = "post-generator"
    }
  }
}
