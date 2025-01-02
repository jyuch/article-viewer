import { walk } from "@std/fs";
import { basename } from "@std/path/basename";
import { extname } from "@std/path/extname";

export const layout = "layouts/article.vto";

interface Article {
  title: string;
  pages: string[];
}

const files = walk("./article", { maxDepth: 1, includeFiles: false });

const articles: Article[] = [];

for await (const file of files) {
  if (file.name !== "article") {
    const pages = walk(`./article/${file.name}`, {
      maxDepth: 1,
      includeDirs: false,
    });
    const p: string[] = [];

    for await (const page of pages) {
      if (extname(page.path) === ".avif") {
        p.push(basename(page.path));
      }
    }
    articles.push({ title: file.name, pages: p.sort() });
  }
}

export default function* () {
  for (const article of articles) {
    yield {
      title: article.title,
      pages: article.pages,
      url: `/article/${article.title}/index.html`,
    };
  }
}
