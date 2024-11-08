import os
from bs4 import BeautifulSoup
from transformers import pipeline
from huggingface_hub import HfApi

# Set up the summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Function to extract text from HTML files
def extract_text_from_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        return soup.get_text()

# Function to summarize text
def summarize_text(text):
    summary = summarizer(text, max_length=100, min_length=30, do_sample=False)
    return summary[0]['summary_text']

# Function to process all HTML files in a directory
def process_directory(directory):
    summaries = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                text = extract_text_from_html(file_path)
                summary = summarize_text(text)
                summaries.append((file, summary))
    return summaries

# Main execution
if __name__ == "__main__":
    blog_directory = "../public/blog"
    results = process_directory(blog_directory)

    # Print results
    for file, summary in results:
        print(f"File: {file}")
        print(f"Summary: {summary}")
        print("---")

    # Optionally, upload results to Hugging Face Hub
    api = HfApi()
    api.upload_file(
        path_or_fileobj=str(results),
        path_in_repo="blog_summaries.txt",
        repo_id="your-username/your-repo-name",
        repo_type="dataset",
    )