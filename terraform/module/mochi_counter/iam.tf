resource "aws_iam_role" "lambda_mochi" {
  name = "lambda-mochi-counter-role"

  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : "sts:AssumeRole",
          "Principal" : {
            "Service" : "lambda.amazonaws.com"
          },
          "Effect" : "Allow",
        }
      ]
    }
  )
}

# --------------------------------------------------------------------------------
# LambdaBasicExecution
# --------------------------------------------------------------------------------

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_mochi.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# --------------------------------------------------------------------------------
# DynamoDB - PutItem
# --------------------------------------------------------------------------------

resource "aws_iam_policy" "dynamodb" {
  name = "lambda-mochi-counter-dynamodb-policy"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:UpdateItem",
        ],
        "Resource" : aws_dynamodb_table.mochi.arn
      },
    ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "dynamodb" {
  role       = aws_iam_role.lambda_mochi.name
  policy_arn = aws_iam_policy.dynamodb.arn
}
