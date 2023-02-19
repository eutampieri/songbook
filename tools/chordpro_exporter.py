from json import load
import glob


def json_to_crd(f):
    song = load(f)
    crd = ""
    chords_map = [[[] for j in i] for i in song["lyrics"]]
    for chord in song["chords"]:
        chords_map[chord["stanza"]][chord["row"]].append(
            {"position": chord["position"], "chord": chord["chord"]})
    if "title" in song:
        crd = crd + f'{{ title: {song["title"]} }}\n'
    if "author" in song:
        crd = crd + f'{{ author: {song["author"]} }}\n'
    if len(song["tags"]) > 0:
        tags = ' '.join(song["tags"])
        crd = crd + f'{{ meta: tags {tags} }}\n'
    if len(song["recordings"]) > 0:
        recordings = []
        for r in song["recordings"]:
            for k, v in r.items():
                recordings.append(f'{k} {v}')
        recordings = ' '.join(recordings)
        crd = crd + f'{{ x_songbook_recording: {recordings} }}\n'

    for i, stanza in enumerate(song["lyrics"]):
        in_refrain = song["refrain"][i]
        if in_refrain:
            crd = crd + "{soc}\n"
        else:
            crd = crd + "{sov}\n"
        for j, verse in enumerate(stanza):
            verse_with_chords = verse
            for _, chord in sorted(enumerate(chords_map[i][j]), key=lambda x: (x[1]["position"], x[0]), reverse=True):
                verse_with_chords = verse_with_chords[:chord["position"]] + \
                    f'[{chord["chord"]}]' + \
                    verse_with_chords[chord["position"]:]
            crd = crd + verse_with_chords + "\n"
        if in_refrain:
            crd = crd + "{eoc}\n"
        else:
            crd = crd + "{eov}\n"
        crd = crd + "\n"
    return crd


for song in glob.glob("songs/**.json"):
    print(f'Exporting {song}...')
    with open(song) as f:
        crd = json_to_crd(f)
    with open(song.replace('.json', '.crd'), 'w') as f:
        f.write(crd)
