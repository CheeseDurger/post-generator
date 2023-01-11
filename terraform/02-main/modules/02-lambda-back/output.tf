output "lambda_function_url" {
  value = aws_lambda_function_url.this.function_url
}

output "lambda_function_url_id" {
  value = aws_lambda_function_url.this.url_id
}

output "lambda_function_invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}