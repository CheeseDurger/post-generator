# Overview
This repo contains everything for a web application that uses AI to generate viral Linkedin posts.

# Architecture
```mermaid
graph
    route53(fa:fa-network-wired Route53) -->cloudfront(fa:fa-globe Cloudfront)
    cloudfront --> s3(fa:fa-bucket S3)
    s3 --> lambda(fa:fa-gear Lambda)
    lambda -->|validates captcha| recaptcha[[fa:fa-server Recaptcha]]
    lambda -->|get completion| openai[[fa:fa-server OpenAI]]
    lambda -->|store completion| dynamodb(fa:fa-database DynamoDB)
```

# Folder structure
```
.
├── back                    # Backend files
├── front                   # Frontend files
├── model                   # AI training files
├── terraform               # Infrastructure code
└── ...
```