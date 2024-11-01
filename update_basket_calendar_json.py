import requests
import json
from ics import Calendar
from datetime import datetime, timedelta, timezone
import pytz
import re
from urllib.parse import urlparse

# URL of the public Google Calendar ICS file
ics_url = 'https://calendar.google.com/calendar/ical/f8a14c4037d9ab411f93f19ee369218f0ed54be7c2d88deaf09d6b76fbe72e7f%40group.calendar.google.com/public/basic.ics'

# Function to fetch the ICS file
def fetch_ics_file(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching ICS file: {e}")
        return None

# Fetch the ICS file
ics_content = fetch_ics_file(ics_url)
if not ics_content:
    print("Failed to fetch ICS file. Exiting...")
    exit(1)

# Parse the ICS file
try:
    calendar = Calendar(ics_content)
except Exception as e:
    print(f"Error parsing ICS file: {e}")
    exit(1)

# Current time minus days (offset-aware)
now_minus_days = datetime.now(timezone.utc) - timedelta(days=1)

# Berlin time zone
berlin_tz = pytz.timezone('Europe/Berlin')

def add_http_if_missing(url):
    if not url:
        return None

    if not url.startswith(('http://', 'https://')):
        print(f"add https to url %s" % url)
        return f"https://{url}"
    return url

# Function to extract the first URL from a text
def extract_first_url(text):
    if not text:
        return None
    url_pattern = re.compile(r'(https?://\S+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})')
    match = url_pattern.search(text)
    return match.group(0) if match else None

# Function to get the domain name from a URL
def get_domain_name(url):
    parsed_url = urlparse(url)
    return parsed_url.netloc

# Convert the calendar events to a list of dictionaries, filtering out events older than two days
events = []
for event in calendar.events:
    event_begin_berlin = event.begin.datetime.astimezone(berlin_tz)
    if event_begin_berlin > now_minus_days:
        url = extract_first_url(event.location)
        url = add_http_if_missing(url)  # Add https if missing
        location = get_domain_name(url) if url and url.startswith('http') else event.location
        if not url:
            printf(f"url is empty {event.name}")

        # Check for 'league: Name' in description and remove it
        league = None
        if 'league:' in event.description:
            league_match = re.search(r'league:\s*([^\n]+)', event.description)
            if league_match:
                league = league_match.group(1).strip()
                event.description = event.description.replace(league_match.group(0), '').strip()
        
        event_dict = {
            'name': event.name,
            'begin': event_begin_berlin.isoformat(),
            'end': event.end.datetime.astimezone(berlin_tz).isoformat(),
            'description': event.description,
            'location': location,
            'url': url,
            'league': league  # Add league to the JSON
        }
        events.append(event_dict)

# Order events by their start time (begin)
events.sort(key=lambda x: x['begin'])

# Save the events to a JSON file in the /assets folder
output_file = 'assets/free_basket_calendar.json'
try:
    with open(output_file, 'w') as json_file:
        json.dump(events, json_file, indent=4)
    print(f"Calendar events have been saved to {output_file}")
except Exception as e:
    print(f"Error saving events to JSON file: {e}")
