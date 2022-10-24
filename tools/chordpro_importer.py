from glob import glob
import json


def parse_line(l):
    chords = []
    line = ""
    chord = ""
    in_chord = False
    for c in l:
        if c == '[':
            in_chord = True
            chord = ""
        elif c == ']':
            in_chord = False
            chords.append({"position": len(line), "chord": chord})
        elif in_chord:
            chord += c
        elif not in_chord:
            line += c
    return line, chords


def parse_directive(d):
    parsed = d.strip(" \t\n{}").split(':')
    if len(parsed) == 1:
        return parsed[0], None
    else:
        return parsed[0], parsed[1]


def fix_chord(c, stanza, row):
    c["stanza"] = stanza
    c["row"] = row
    return c


for filename in glob("songs/*.crd"):
    current_stanza = 0
    current_verse = 0
    song = {"title": "", "tags": [],
            "authors": [], "lyrics": [[]], "refrain": [False], "chords": []}
    with open(filename) as f:
        chordpro = f.readlines()
    for line in chordpro:
        line = line.strip()
        if len(line) == 0:
            continue
        if line[0] == '#':
            continue
        elif line[0] == '{':
            dir, val = parse_directive(line)
            if dir == "title":
                song["title"] = val
            elif dir == "soc":
                song["lyrics"].append([])
                song["refrain"].append(True)
                current_stanza += 1
                current_verse = 0
            elif dir == "eoc":
                song["lyrics"].append([])
                song["refrain"].append(False)
                current_stanza += 1
                current_verse = 0
            else:
                print(dir, val)
            continue
        line, chords = parse_line(line)
        song["lyrics"][len(song["lyrics"]) - 1].append(line)
        for c in chords:
            song["chords"].append(fix_chord(c, current_stanza, current_verse))
        current_verse += 1
    with open(filename.replace(".crd", ".json"), 'w') as f:
        json.dump(song, f)
