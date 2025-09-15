use askama::Template;
use clap::Parser;
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};

#[derive(Parser, Debug)]
struct Cli {
    /// Input directory.
    input: PathBuf,
}

#[derive(Template)]
#[template(path = "index.html")]
struct Index {
    categories: Vec<String>,
}

#[derive(Template)]
#[template(path = "category.html")]
struct Category {
    name: String,
    articles: Vec<String>,
}

#[derive(Template)]
#[template(path = "article.html")]
struct Article {
    name: String,
    pages: Vec<String>,
}

fn main() -> anyhow::Result<()> {
    let opt = Cli::parse();

    let mut categories = vec![];
    for category in scan_dir(&opt.input)? {
        let mut articles = vec![];

        for article in scan_dir(opt.input.join(&category))? {
            let pages = scan_file(
                opt.input.join(&category).join(&article),
                &["avif", "jpg", "png"],
            )?;
            let a = Article {
                name: article.to_string(),
                pages,
            };
            write(
                opt.input.join(&category).join(&article).join("index.html"),
                &a.render()?,
            )?;

            articles.push(article.to_string());
        }
        let c = Category {
            name: category.to_string(),
            articles,
        };
        write(opt.input.join(&category).join("index.html"), &c.render()?)?;

        categories.push(category);
    }

    let index = Index { categories };
    write(opt.input.join("index.html"), &index.render()?)?;

    Ok(())
}

fn scan_dir<P: AsRef<Path>>(path: P) -> anyhow::Result<Vec<String>> {
    let mut results = vec![];

    for entry in (std::fs::read_dir(path)?).flatten() {
        if entry.file_type()?.is_dir() {
            if let Some(entry) = entry.file_name().to_str() {
                results.push(entry.to_string());
            }
        }
    }

    results.sort();
    Ok(results)
}

fn scan_file<P: AsRef<Path>>(path: P, exts: &[&str]) -> anyhow::Result<Vec<String>> {
    let mut results = vec![];

    for entry in (std::fs::read_dir(path)?).flatten() {
        if entry.file_type()?.is_file() {
            if let Some(file_ext) = entry.path().extension() {
                if exts.iter().any(|e| file_ext == *e) {
                    if let Some(entry) = entry.file_name().to_str() {
                        results.push(entry.to_string());
                    }
                }
            }
        }
    }

    results.sort();
    Ok(results)
}

fn write(output_path: impl AsRef<Path>, content: &str) -> anyhow::Result<()> {
    let mut output_file = File::create(output_path)?;
    output_file.write_all(content.as_bytes())?;
    Ok(())
}
