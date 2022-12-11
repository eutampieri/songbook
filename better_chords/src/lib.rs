use std::borrow::Borrow;

//use chordcalc::chords::Chord;
use chordcalc::{instruments::Instrument, Mode};
use git_version::git_version;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn transpose_chord(chord: &str, semitones: i8) -> String {
    if let Ok((n, m)) = chordcalc::parse_chord(chord) {
        format!("{}{}", n + semitones, m)
    } else if semitones == 0 {
        format!("{}", chord)
    } else {
        "Err".to_string()
    }
}

#[wasm_bindgen]
pub fn get_version() -> String {
    format!(
        "{} {} ({}) - chordcalc {}",
        env!("CARGO_CRATE_NAME"),
        env!("CARGO_PKG_VERSION"),
        git_version!(),
        env!("CHORDCALC_VER")
    )
}

#[wasm_bindgen]
pub fn generate_chord_ukulele(chord: &str, semitones: i8) -> Vec<i8> {
    if let Ok((n, m)) = chordcalc::parse_chord(chord) {
        chordcalc::instruments::Ukulele::play(m.make_chord(n + semitones).borrow())
            .iter()
            .map(|x| x.map(|x| x as i8).unwrap_or(-1))
            .collect()
    } else {
        vec![]
    }
}
