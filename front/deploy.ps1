# We deploy to production if passed as first parameter, else to staging
if ($args.length -ne 0 -and $args[0] -eq "production") {
    $include = "production"
    $exclude = "staging"
    $s3 = "s3://production-front-u9s7wl2j82"
    $cloudfront = "E2DHMWJ1DQH0BM"
} else {
    $include = "staging"
    $exclude = "production"
    $s3 = "s3://staging-front-u9s7wl2j82"
    $cloudfront = "E10050UH32LF8F"
}
npm run "build-$include"
aws s3 sync dist $s3 --exclude="*.ps1"
aws cloudfront create-invalidation --distribution-id $cloudfront --paths "/*"
