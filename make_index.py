import json
from glob import glob


def get_id(fn):
    return '.'.join(fn.split("/")[-1].split('.')[:-1])


index = []

for song in glob("songs/*.json"):
    with open(song) as f:
        song_data = json.load(f)
    index.append(
        {"id": get_id(song), "title": song_data["title"], "authors": song_data["authors"], "tags": song_data["tags"]})
with open("index.json", "w") as f:
    json.dump(index, f)
