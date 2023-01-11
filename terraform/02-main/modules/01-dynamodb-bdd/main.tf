resource "aws_dynamodb_table" "this" {
  name           = var.table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "topic"
  range_key      = "timestamp"

  attribute {
    name = "topic"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "language" # Language as a 2 letters code (eg. en, cn, de, es)
    type = "S"
  }

  global_secondary_index {
    name               = "languageIndex"
    hash_key           = "language"
    range_key          = "timestamp"
    write_capacity     = 5
    read_capacity      = 5
    projection_type    = "ALL"
  }
}
