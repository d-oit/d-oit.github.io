import requests
import json
from ics import Calendar
from datetime import datetime, timedelta, timezone
import pytz
import re
from urllib.parse import urlparse

# URL of the public Google Calendar ICS file
ics_url = 'https://calendar.google.com/calendar/ical/f8a14c4037d9ab411f93f19ee369218f0ed54be7c2d88deaf09d6b76fbe72e7f%40group.calendar.google.com/public/basic.ics'

# Fetch the ICS file
response = requests.get(ics_url)
ics_content = response.text

# Parse the ICS file
calendar = Calendar(ics_content)

# Current time minus two days (offset-aware)
now_minus_two_days = datetime.now(timezone.utc) - timedelta(days=2)

# Berlin time zone
berlin_tz = pytz.timezone('Europe/Berlin')

# Function to extract the first URL from a text
def extract_first_url(text):
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
    if event_begin_berlin > now_minus_two_days:
        url = extract_first_url(event.location)
        location = get_domain_name(url) if url and url.startswith('http') else event.location
        event_dict = {
            'name': event.name,
            'begin': event_begin_berlin.isoformat(),
            'end': event.end.datetime.astimezone(berlin_tz).isoformat(),
            'description': event.description,
            'location': location,
            'url': url
        }
        events.append(event_dict)

# Order events by their start time (begin)
events.sort(key=lambda x: x['begin'])

# Save the events to a JSON file in the /assets folder
with open('assets/free_basket_calendar.json', 'w') as json_file:
    json.dump(events, json_file, indent=4)

print('Calendar events have been saved to assets/free_basket_calendar.json')
