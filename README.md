# songbook

This project aims to create a static site generator (there is no per-request server-side processing required) to display song lyrics and chords.

## Deployment
1. Fetch the build and the plugins
1. Place songs in the `songs` folder
1. Edit your `conf.json` file
1. If needed, run `chordpro_importer.py` to import all chordpro songs (If you find any issue with the importer, report it in [issue #7](https://github.com/eutampieri/spngbook/issues/7))
1. Run `make_index.py` (which generates `index.json`)
1. Deploy all the files (except for `make_index.py`)

## Structure
### Core

- `index.html` is the main webpage and lists all available songs, It gets them from the generated `index.json` file.
- `song.html` displays a song whose file name is provided in the query string (i.e. `song.html?wearing_the_inside_out` will fetch the song from `songs/wearing_the_inside_out.json` file)
### BetterChords

This is an optional plugin that provides tonality changes (UI still to be implemented) and Unicode chord visualisation.

To enable it you have to download the `BetterChords.zip` archive and decompress it in the `res` folder

A future goal for this plugin is to calculate chord tabulatures.
### Search (TODO)

Support for lunr search in the main page. To be enabled during deployment by running a `.js` script.

## Song format

TODO, waiting for it to stabilize enough. In the meantime, you can check the provided examples in the `songs` dir.
This software is able to parse chordpro files.

## Configuration file

TODO, waiting for it to stabilize enough. In the meantime, you can check the provided `conf.json.sample` example.

