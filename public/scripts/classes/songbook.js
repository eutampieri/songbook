class Songbook {
    constructor(title) {
        this.title = title;
        this.songs = [];
        this.sort = "Author";
        this.lang = "English";
        this.font = "10";
    }

    addSong(song) {
        this.songs.push(song);
    }

    removeSong(artist, title) {
        for(var i=0;i<this.songs.length;i++) {
            if (this.songs[i].artist == artist && this.songs[i].title == title) {
                var index = this.songs.indexOf(this.songs[i]);
                if (index > -1) {
                    this.songs.splice(index, 1);
                }
            }
        }
    }
}

module.exports = Songbook;