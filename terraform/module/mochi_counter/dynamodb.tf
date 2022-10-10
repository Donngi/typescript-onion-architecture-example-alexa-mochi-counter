resource "aws_dynamodb_table" "mochi" {
  name         = "mochi-count-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "person"

  attribute {
    name = "person"
    type = "S"
  }
}

