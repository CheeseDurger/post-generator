# We deploy to production if passed as first parameter, else to staging
if ($args.length -ne 0 -and $args[0] -eq "production") {
    $environment = "production"
    $lambda = "production_lambda_back"
} else {
    $environment = "staging"
    $lambda = "staging_lambda_back"
}
Copy-Item -Path "config/$environment.config.ts" -Destination "config/config.ts"
rm dist -r -force -ErrorAction SilentlyContinue
npm run build
Compress-Archive -Path dist/*.js -DestinationPath dist.zip -Force
aws lambda update-function-code --function-name $lambda --zip-file "fileb://dist.zip"
