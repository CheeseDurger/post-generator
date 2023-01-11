#!/bin/bash
export OPENAI_API_KEY="your openai api key"
# List all uploaded files
curl https://api.openai.com/v1/files -H "Authorization: Bearer $OPENAI_API_KEY"
# Delete uploaded file
curl https://api.openai.com/v1/files/file-LfRZAubRXfNUMPngfNGpd6oI -X DELETE -H "Authorization: Bearer $OPENAI_API_KEY"
# List fine-tune
curl https://api.openai.com/v1/fine-tunes -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.data[] | "\(.id) \(.fine_tuned_model)"'
# Delete fine-tune
curl -X DELETE https://api.openai.com/v1/models/<fine-tune name - eg. davinci:ft-xxx:yyy-2022-12-29-17-03-12> -H "Authorization: Bearer $OPENAI_API_KEY"
