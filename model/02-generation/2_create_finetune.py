import secret_variables
import openai
import time
import variables

openai.api_key = secret_variables.OPENAI_API_KEY

# Upload file
uploaded_file = openai.File.create(
  file=open("data.jsonl", "rb"),
  purpose="fine-tune"
)
print("Uploading file :", uploaded_file)

# Wait for uploaded file to be ready
while uploaded_file.status != "processed":
    time.sleep(1)
    uploaded_file = openai.File.retrieve(uploaded_file.id)

# Exit if uploaded file couldn"t be processed successfuly by OpenAI
if uploaded_file.status_details != None:
    openai.File.delete(uploaded_file.id)
    print("There as been a problem while OpenAI was processing the file remotely.\nHere is the last info for this file from OpenAI :")
    print(uploaded_file)
    print("Note : we already deleted this file.")
    exit()

# Create fine-tuned model
fine_tune = openai.FineTune.create(training_file=uploaded_file.id, model="davinci", suffix=variables.topic)
print("Fine-tuning model :", fine_tune)

# Wait for fine-tuned model to be ready
while fine_tune.status != "succeeded" and fine_tune.status != "failed" and fine_tune.status != "cancelled":
    print("Checking if model fine-tuned ready in 20s...")
    time.sleep(20)
    fine_tune = openai.FineTune.retrieve(id=fine_tune.id)
    print("Current status :", fine_tune)

if fine_tune.status == "succeeded" :
    print("SUCCESS")
else :
    print("FAILURE")

print("Fine-tuned model :", fine_tune)
