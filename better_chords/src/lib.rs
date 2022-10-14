//use chordcalc::chords::Chord;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn transpose_chord(chord: &str, semitones: i8) -> String {
    if let Ok((n, m)) = chordcalc::parse_chord(chord) {
        format!("{}", n + semitones)
    } else if semitones == 0 {
        format!("{}", chord)
    } else {
        "Err".to_string()
    }
}
