import { basename } from "@std/path/basename";
import { expandGlob } from "@std/fs/expand-glob";

export const layout = "layouts/article.vto";

interface Article {
  category: string;
  title: string;
  pages: string[];
}

const categories = expandGlob("*", { root: "./article" });

const a: Article[] = [];

for await (const category of categories) {
  if (category.isDirectory) {
    const articles = expandGlob("*", { root: `./article/${category.name}` });

    const p: string[] = [];
    for await (const article of articles) {
      const pages = expandGlob("*.avif", {
        root: `./article/${category.name}/${article.name}`,
      });
      for await (const page of pages) {
        p.push(basename(page.name));
      }
      a.push({ category: category.name, title: article.name, pages: p.sort() });
    }
  }
}

export default function* () {
  for (const article of a) {
    yield {
      title: article.title,
      pages: article.pages,
      url: `/article/${article.category}/${article.title}/index.html`,
    };
  }
}
