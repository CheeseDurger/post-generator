# Overview
The goal of this codebase is to build a generation model that generates viral social media posts that could be posted by anyone.

We call those posts **good posts** :
- They contains no personal info : names, marital status, children, author's number of followers, author's product names, etc.
- They can be posted any time : no yearly events (eg. "happy new year"), no media events (eg. covid, Ukraine, etc.)
- They can be posted alone : no image / carousel / webinar / newsletter / etc. needed

The process happens in multiple steps :
1. Scrape Linkedin influencer's posts and build a dataset `A` of viral posts
2. From the dataset `A`, build a sub-dataset `B` by mannually classifying P good posts vs Q not good posts (P and Q > 100)
3. From the dataset `B`, fine-tune a classification model that select good posts
4. From the dataset `A` and the classification model, build a dataset `C` that is all the good posts from `A`
5. From the dataset `C`, fine-tune a generation model that generates good posts

# Folder structure
```
.
├── 00-data                 # Datasets
├── 01-classification       # Code to fine-tune the classification model
├── 02-generation           # Code to fine-tune the generation model
└── ...
```
