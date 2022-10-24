from glob import glob
import json


def parse_line(l):
    chords = []
    directives = []
    line = ""
    chord = ""
    directive = ""
    in_chord = False
    in_directive = False
    for c in l:
        if c == '[':
            in_chord = True
            chord = ""
        elif c == ']':
            in_chord = False
            chords.append({"position": len(line), "chord": chord})
        elif c == '{':
            in_directive = True
            directive = ""
        elif c == '}':
            in_directive = False
            directives.append(parse_directive(directive))
        elif in_chord:
            chord += c
        elif in_directive:
            directive += c
        elif not in_chord:
            line += c
    return line, chords, directives


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
            "authors": [], "lyrics": [[]], "refrain": [False], "chords": [], "recordings": []}
    with open(filename) as f:
        chordpro = f.readlines()
    for line in chordpro:
        line = line.strip()
        if len(line) == 0:
            continue
        if line[0] == '#':
            continue
        line, chords, directives = parse_line(line)
        for dir, val in directives:
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
            elif dir == "c":
                line = line + f"({val})"
            else:
                print(dir, val)
        if line == "":
            continue
        song["lyrics"][len(song["lyrics"]) - 1].append(line)
        for c in chords:
            song["chords"].append(fix_chord(c, current_stanza, current_verse))
        current_verse += 1
    with open(filename.replace(".crd", ".json"), 'w') as f:
        json.dump(song, f)
