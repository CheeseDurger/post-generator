data "aws_region" "current" {}

locals {
  origin_id_back  = "lambda_back"
  origin_id_front = "s3_front"
}

data "aws_cloudfront_cache_policy" "CachingDisabled" {
  name = "Managed-CachingDisabled"
}

resource "aws_cloudfront_origin_request_policy" "this" {

  name    = "${var.environment}_back_origin_request_policy"
  comment = "Origin request policy for lambda in ${var.environment}"

  cookies_config {
    cookie_behavior = "none"
  }
  headers_config {
    header_behavior = "none"
  }
  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${var.environment}_s3"
  description                       = ""
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {

  comment             = var.environment
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  aliases             = [var.subdomain_name]

  wait_for_deployment = false

  origin {
    origin_id   = local.origin_id_front
    domain_name = var.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  origin {
    origin_id   = local.origin_id_back
    domain_name = "${var.lambda_function_url_id}.lambda-url.${data.aws_region.current.name}.on.aws"
    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = [ "TLSv1.2" ]
    }
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    target_origin_id       = local.origin_id_back
    path_pattern           = "/post"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = [ "GET", "HEAD" ]
    cached_methods         = [ "GET", "HEAD" ]

    cache_policy_id          = data.aws_cloudfront_cache_policy.CachingDisabled.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.this.id

    dynamic "function_association" {
      for_each = toset(aws_cloudfront_function.this)
      content {
        event_type   = "viewer-request"
        function_arn = function_association.value.arn
      }
    }

  }

  default_cache_behavior {
    target_origin_id         = local.origin_id_front
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = [ "GET", "HEAD" ]
    cached_methods           = [ "GET", "HEAD" ]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    dynamic "function_association" {
      for_each = toset(aws_cloudfront_function.this)
      content {
        event_type   = "viewer-request"
        function_arn = function_association.value.arn
      }
    }

  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

}

resource "aws_cloudfront_origin_access_identity" "this" {
  comment = "access-identity-${var.subdomain_name}.s3.amazonaws.com"
}

resource "aws_cloudfront_function" "this" {
  count = var.environment == "staging" ? 1 : 0

  name    = "staging_basic_auth"
  runtime = "cloudfront-js-1.0"
  comment = "Basic auth for staging"
  publish = true
  code    = <<-EOT
  function handler(event) {
    var auth = event.request.headers.authorization;
    var origin = event.request.headers.origin;

    // The Base64-encoded Auth header is `Basic base64(username:password)`
    var expectedAuth = "Basic ${var.base64_basic_auth}";
    if (auth && auth.value === expectedAuth) return event.request;

    // On develoment environment, the browser will use the local frontend,
    // but the staging backend
    // However as the local frontend doesn't require authentication,
    // the browser won't send auth headers for the backend
    var expectedOrigin = "http://localhost:5173";
    if (origin && origin.value === expectedOrigin) return event.request;

    // If we get here, request the browser present the Basic Auth dialog
    var response = {
      statusCode: 401,
      statusDescription: "Unauthorized",
      headers: {
        "www-authenticate": {
          value: 'Basic realm="Basic auth credentials needed"',
        },
      },
    };

    return response;
  }
  EOT
}

data "aws_iam_policy_document" "this" {
	statement {
		principals {
			type        = "Service"
			identifiers = ["cloudfront.amazonaws.com"]
		}
		actions = ["s3:GetObject"]
		resources = [
      "arn:aws:s3:::${var.bucket_name}/*",
    ]
		condition {
			test     = "StringEquals"
			variable = "AWS:SourceArn"
			values   = [aws_cloudfront_distribution.this.arn]
		}
	}
}

resource "aws_s3_bucket_policy" "this" {
  bucket = var.bucket_name
  policy = data.aws_iam_policy_document.this.json
}
