import os
import pandas
import variables
import openai

# Read excel document
df = pandas.read_excel(variables.import_filename, sheet_name="data")

df = df[[variables.content_column_name]]
df = df.rename(columns={variables.content_column_name: "completion"})


# Reshaping data for GPT-3 fine-tuning
df.insert(0, "prompt", variables.prompt + variables.prompt_stop)
df["completion"] = " " + df["completion"].astype(str) + variables.completion_stop

# Write data to .jsonl file
df.to_json("data.jsonl", orient="records", lines=True)
print("Training file saved to ./data.jsonl")
print('You should run : openai tools fine_tunes.prepare_data -f "data.jsonl"')
