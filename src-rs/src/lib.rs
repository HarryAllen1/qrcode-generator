use image::{io::Reader, DynamicImage};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = convertToWebp)]
pub fn convert_to_webp(url: &str) {
    let img = Reader::open(url);
    let img: DynamicImage = match img {
        Ok(img) => img.with_guessed_format().unwrap().decode().unwrap(),
        Err(e) => {
            println!("Error: {}", e);
            return ();
        }
    };
}
