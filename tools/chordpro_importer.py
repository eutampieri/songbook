import enum
from glob import glob
import json


class ChordProDirective(enum.Enum):
    CHORD = enum.auto()
    CHORD_COLOUR = enum.auto()
    CHORD_FONT = enum.auto()
    CHORD_SIZE = enum.auto()
    CHORUS = enum.auto()
    COLUMN_BREAK = enum.auto()
    COLUMNS = enum.auto()
    COMMENT = enum.auto()
    COMMENT_BOX = enum.auto()
    COMMENT_ITALIC = enum.auto()
    DEFINE = enum.auto()
    END_OF_BRIDGE = enum.auto()
    END_OF_CHORUS = enum.auto()
    END_OF_GRID = enum.auto()
    END_OF_TAB = enum.auto()
    END_OF_VERSE = enum.auto()
    FOOTER_SIZE = enum.auto()
    FOOTER_COLOUR = enum.auto()
    FOOTER_FONT = enum.auto()
    GRID = enum.auto()
    HIGHLIGHT = enum.auto()
    IMAGE = enum.auto()
    META = enum.auto()
    NEW_PAGE = enum.auto()
    NEW_PHYSICAL_PAGE = enum.auto()
    NEW_SONG = enum.auto()
    NO_GRID = enum.auto()
    PAGETYPE = enum.auto()
    RECORDING = enum.auto()
    START_OF_BRIDGE = enum.auto()
    START_OF_CHORUS = enum.auto()
    START_OF_GRID = enum.auto()
    START_OF_TAB = enum.auto()
    START_OF_VERSE = enum.auto()
    SUBTITLE = enum.auto()
    TABCOLOUR = enum.auto()
    TABFONT = enum.auto()
    TABSIZE = enum.auto()
    TEXTCOLOUR = enum.auto()
    TEXTFONT = enum.auto()
    TEXTSIZE = enum.auto()
    TITLE = enum.auto()
    TITLESIZE = enum.auto()
    TITLECOLOUR = enum.auto()
    TITLEFONT = enum.auto()
    TITLES = enum.auto()
    TOCSIZE = enum.auto()
    TOCCOLOUR = enum.auto()
    TOCFONT = enum.auto()
    TRANSPOSE = enum.auto()


DIRECTIVES = {"chord": ChordProDirective.CHORD, "chordcolour": ChordProDirective.CHORD_COLOUR, "chordfont": ChordProDirective.CHORD_FONT, "chordsize": ChordProDirective.CHORD_SIZE, "chorus": ChordProDirective.CHORUS, "column_break": ChordProDirective.COLUMN_BREAK, "cb": ChordProDirective.COLUMN_BREAK, "columns": ChordProDirective.COLUMNS, "col": ChordProDirective.COLUMNS, "comment": ChordProDirective.COMMENT, "c": ChordProDirective.COMMENT, "comment_box": ChordProDirective.COMMENT_BOX, "cb": ChordProDirective.COMMENT_BOX, "comment_italic": ChordProDirective.COMMENT_ITALIC, "ci": ChordProDirective.COMMENT_ITALIC, "define": ChordProDirective.DEFINE, "end_of_bridge": ChordProDirective.END_OF_BRIDGE, "eob": ChordProDirective.END_OF_BRIDGE, "end_of_chorus": ChordProDirective.END_OF_CHORUS, "eoc": ChordProDirective.END_OF_CHORUS, "end_of_grid": ChordProDirective.END_OF_GRID, "eog": ChordProDirective.END_OF_GRID, "end_of_tab": ChordProDirective.END_OF_TAB, "eot": ChordProDirective.END_OF_TAB, "end_of_verse": ChordProDirective.END_OF_VERSE, "eov": ChordProDirective.END_OF_VERSE, "footersize": ChordProDirective.FOOTER_SIZE, "footercolour": ChordProDirective.FOOTER_COLOUR, "footerfont": ChordProDirective.FOOTER_FONT, "grid": ChordProDirective.GRID, "g": ChordProDirective.GRID, "highlight": ChordProDirective.HIGHLIGHT, "image": ChordProDirective.IMAGE, "meta": ChordProDirective.META, "album": ChordProDirective.META, "artist": ChordProDirective.META, "capo": ChordProDirective.META, "composer": ChordProDirective.META, "copyright": ChordProDirective.META, "duration": ChordProDirective.META, "key": ChordProDirective.META, "lyricist": ChordProDirective.META, "sorttitle": ChordProDirective.META,
              "tempo": ChordProDirective.META, "time": ChordProDirective.META, "year": ChordProDirective.META, "new_page": ChordProDirective.NEW_PAGE, "np": ChordProDirective.NEW_PAGE, "new_physical_page": ChordProDirective.NEW_PHYSICAL_PAGE, "npp": ChordProDirective.NEW_PHYSICAL_PAGE, "new_song": ChordProDirective.NEW_SONG, "ns": ChordProDirective.NEW_SONG, "no_grid": ChordProDirective.NO_GRID, "ng": ChordProDirective.NO_GRID, "pagetype": ChordProDirective.PAGETYPE, "start_of_bridge": ChordProDirective.START_OF_BRIDGE, "sob": ChordProDirective.START_OF_BRIDGE, "start_of_chorus": ChordProDirective.START_OF_CHORUS, "soc": ChordProDirective.START_OF_CHORUS, "start_of_grid": ChordProDirective.START_OF_GRID, "sog": ChordProDirective.START_OF_GRID, "start_of_tab": ChordProDirective.START_OF_TAB, "sot": ChordProDirective.START_OF_TAB, "start_of_verse": ChordProDirective.START_OF_VERSE, "sov": ChordProDirective.START_OF_VERSE, "subtitle": ChordProDirective.SUBTITLE, "st": ChordProDirective.SUBTITLE, "tabcolour": ChordProDirective.TABCOLOUR, "tabfont": ChordProDirective.TABFONT, "tabsize": ChordProDirective.TABSIZE, "textcolour": ChordProDirective.TEXTCOLOUR, "textfont": ChordProDirective.TEXTFONT, "tf2": ChordProDirective.TEXTFONT, "textsize": ChordProDirective.TEXTSIZE, "ts2": ChordProDirective.TEXTSIZE, "title": ChordProDirective.TITLE, "t": ChordProDirective.TITLE, "titlesize": ChordProDirective.TITLESIZE, "titlecolour": ChordProDirective.TITLECOLOUR, "titlefont": ChordProDirective.TEXTFONT, "titles": ChordProDirective.TITLES, "tocsize": ChordProDirective.TOCSIZE, "toccolour": ChordProDirective.TOCCOLOUR, "tocfont": ChordProDirective.TOCFONT, "transpose": ChordProDirective.TRANSPOSE, "x_songbook_recording": ChordProDirective.RECORDING}


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
            if not dir in DIRECTIVES:
                print(f"Unknown directive {dir} with value {val}")
                continue
            raw_dir = dir
            dir = DIRECTIVES[dir]
            if dir == ChordProDirective.TITLE:
                song["title"] = val
            elif dir == ChordProDirective.START_OF_CHORUS:
                song["lyrics"].append([])
                song["refrain"].append(True)
                current_stanza += 1
                current_verse = 0
            elif dir == ChordProDirective.END_OF_CHORUS:
                song["lyrics"].append([])
                song["refrain"].append(False)
                current_stanza += 1
                current_verse = 0
            elif dir == ChordProDirective.COMMENT:
                line = line + f"({val})"
            elif dir == ChordProDirective.META:
                val = val.split(' ', 1)
                meta = raw_dir == 'meta'
                name = val[0] if meta else raw_dir
                val = val[1:] if meta else ' '.join(val)
                if name == 'artist':
                    song['authors'].append(val)
                elif name == 'tag':
                    song['tags'].append(val)
                else:
                    print(f"Unsupported metadata {name} = {val}")
            else:
                print(f"Unsupported directive found: {dir} ({raw_dir}). Value = {val}.")
        if line == "":
            continue
        song["lyrics"][len(song["lyrics"]) - 1].append(line)
        for c in chords:
            song["chords"].append(fix_chord(c, current_stanza, current_verse))
        current_verse += 1
    with open(filename.replace(".crd", ".json"), 'w') as f:
        json.dump(song, f)
