terraform {
  backend "s3" {
    bucket = "YOUR_BUCKET_NAME_HERE"
    key    = "terraform.tfstate"
    region = "ap-northeast-1"
  }
}
