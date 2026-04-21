use std::process::{Command, exit};
use std::env;

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let status = Command::new("npx")
        .arg("--yes")
        .arg("@async-atharv/ipaship")
        .args(&args)
        .status()
        .expect("Failed to execute npx");
    
    if !status.success() {
        exit(status.code().unwrap_or(1));
    }
}
