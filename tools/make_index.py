import json
from glob import glob
from sys import argv

def get_id(fn):
    return '.'.join(fn.split("/")[-1].split('.')[:-1])


index = []

for song in glob("songs/*.json"):
    with open(song) as f:
        song_data = json.load(f)
    index.append(
        {"id": get_id(song), "title": song_data["title"], "authors": song_data["authors"], "tags": song_data["tags"]})

index = (sorted(index, key=lambda k: k['title'].upper()))

with open("index.json", "w") as f:
    json.dump(index, f)

if len(argv) >=2:
    with open("sitemap.xml", "w") as f:
        f.write("<?xml version=\"1.0\" encoding=\"utf-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">")
        for page in index:
            f.write(f"<url><loc>{argv[1]}/song.html?{page['id']}</loc></url>")
        f.write("</urlset>")
else:
    print("Sitemap was not generated. Run with base URL as a parameter (i.e. ./make_index.py https://example.com)")