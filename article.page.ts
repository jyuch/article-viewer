import { walk } from "@std/fs";
import { basename } from "@std/path/basename";
import { extname } from "@std/path/extname";

export const layout = "layouts/article.vto";

interface Article {
  title: string;
  pages: string[];
}

const pagePattern = /page.+/g;

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
      if (pagePattern.test(basename(page.path))) {
        p.push(basename(page.path, extname(page.path)));
      }
    }
    articles.push({ title: file.name, pages: p });
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
