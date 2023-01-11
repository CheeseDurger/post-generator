data "aws_region" "current" {}

resource "aws_iam_role" "this" {
  name = "${var.lambda_name}_role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  inline_policy {
    name   = data.aws_iam_policy_document.lambda_logging.policy_id
    policy = data.aws_iam_policy_document.lambda_logging.json
  }

  inline_policy {
    name   = data.aws_iam_policy_document.lambda_dynamodb.policy_id
    policy = data.aws_iam_policy_document.lambda_dynamodb.json
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_logging" {
  policy_id = "lambda_logging"
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
    effect    = "Allow"
  }
}

data "aws_iam_policy_document" "lambda_dynamodb" {
  policy_id = "lambda_dynamodb"
  statement {
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
    ]
    resources = [var.dynamodb_arn]
    effect    = "Allow"
  }
}

resource "aws_lambda_function" "this" {
  # Lambda function must be provisionned with a file for the code
  # The path is relative to the root module
  filename      = "./build.zip"
  function_name = var.lambda_name
  role          = aws_iam_role.this.arn
  handler       = "index.Lambda.handler"

  # source_code_hash = filebase64sha256("./build.zip")

  runtime = "nodejs16.x"
  timeout = 40 # 40 seconds

}

resource "aws_lambda_function_url" "this" {
  function_name      = aws_lambda_function.this.function_name
  authorization_type = "NONE"

  cors {
    allow_origins  = var.environment == "production" ? ["https://${var.subdomain_name}"] : ["https://${var.subdomain_name}", "http://localhost:5173"]
    allow_methods  = ["*"]
    allow_headers  = ["keep-alive", "date"]
    expose_headers = ["keep-alive", "date"]
    max_age        = 86400
  }

}
