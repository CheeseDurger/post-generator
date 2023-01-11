# Introduction
This codebase contains the code to prepare the training data for OpanAI.

# How to create a fine-tuned model
Steps :
1. Search for a Linkedin influencer and retrieve 
2. From `scraper.json` : update `.startUrl[0]` with the url of the influencer's posts, and `.id` with a custom name
3. Import the new `scaper.json` into webscraper.io's chrome extension
4. Scrape Linkedin posts
5. Export the posts as an `.xlsx` file into `./data`
6. Update `./variables.py` with the xlsx file path
7. Run `python 1_create_jsonl_file.py`
8. Run `openai tools fine_tunes.prepare_data -f "data.jsonl"` and follow any instrutions
9. Run `python 2_create_finetune.py`