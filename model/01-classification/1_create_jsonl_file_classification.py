import pandas
import variables

# Read excel document
df = pandas.read_excel(variables.import_filename, sheet_name="data")

# Filtering data
df = df[df["Classification"].notnull()]
df = df[[variables.content_column_name, "Classification"]]
df = df.rename(columns={variables.content_column_name: "prompt", "Classification": "completion"})

# Reshaping data for GPT-3 fine-tuning
df["prompt"] = df["prompt"] + variables.prompt_separator
df["completion"] = " " + df["completion"].replace({"ok": variables.ok_class, "ko": variables.ko_class}) + variables.completion_stop

# Shuffle rows
df = df.sample(frac=1)

print("Head after filtering data:\n", df.head())

# Write data to .jsonl file
df.to_json("data.jsonl", orient="records", lines=True)
print("\nTotal number of rows :", df.shape[0])

# Verify file with the following shell command:
# openai tools fine_tunes.prepare_data -f "data.jsonl"
