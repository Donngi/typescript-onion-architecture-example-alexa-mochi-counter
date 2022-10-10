data "archive_file" "mochi" {
  type        = "zip"
  source_dir  = "${path.module}/src/dist"
  output_path = "${path.module}/src/lambda.zip"
}

resource "aws_lambda_function" "mochi" {
  filename      = data.archive_file.mochi.output_path
  function_name = "mochi-counter"
  role          = aws_iam_role.lambda_mochi.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.mochi.output_base64sha256

  runtime = "nodejs16.x"

  environment {
    variables = {
      LOG_LEVEL           = "DEBUG"
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.mochi.name
    }
  }

  timeout = 30
  publish = true
}

resource "aws_lambda_permission" "mochi" {
  statement_id       = "AllowAlexa"
  action             = "lambda:InvokeFunction"
  function_name      = aws_lambda_function.mochi.arn
  principal          = "alexa-appkit.amazon.com"
  event_source_token = var.alexa_mochi_counter_skill_id
}
