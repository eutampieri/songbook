extern crate cargo_lock;

fn main() {
    if let Ok(lock_file) = cargo_lock::Lockfile::load("Cargo.lock") {
        if let Some(package) = lock_file
            .packages
            .iter()
            .find(|x| x.name.as_str() == "chordcalc")
        {
            let version;
            if package
                .source
                .as_ref()
                .map(|x| x.is_git())
                .unwrap_or_default()
            {
                version = format!(
                    "{} ({})",
                    package.version,
                    package.source.as_ref().map(|x| x.to_string()).unwrap()
                );
            } else {
                version = format!("{}", package.version);
            }
            println!("cargo:rustc-env=CHORDCALC_VER={version}");
        }
    }
}
