import secret_variables
import openai
import time
import variables

openai.api_key = secret_variables.OPENAI_API_KEY

# Upload file
training_file = openai.File.create(
  file=open("data_prepared_train.jsonl", "rb"),
  purpose="fine-tune"
)
validation_file = openai.File.create(
  file=open("data_prepared_valid.jsonl", "rb"),
  purpose="fine-tune"
)
print("Uploading training file :", training_file)
print("Uploading validation file :", validation_file)

# Wait for uploaded file to be ready
while training_file.status != "processed" and validation_file.status != "processed":
    time.sleep(1)
    training_file = openai.File.retrieve(training_file.id)
    validation_file = openai.File.retrieve(validation_file.id)

# Exit if uploaded file couldn't be processed successfuly by OpenAI
if training_file.status_details != None or validation_file.status_details != None:
    openai.File.delete(training_file.id)
    openai.File.delete(validation_file.id)
    print("There as been a problem while OpenAI was processing the files remotely.\nHere is the last info for this file from OpenAI :")
    print("Training file :", training_file)
    print("Validation file :", validation_file)
    print("Note : we already deleted this file.")
    exit()

# Create fine-tuned model
fine_tune = openai.FineTune.create(
    training_file=training_file.id,
    validation_file=validation_file.id,
    model="ada",
    # n_epochs=4,
    suffix="classification",
    compute_classification_metrics=True,
    classification_positive_class=" "+variables.ok_class+variables.completion_stop
)
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
