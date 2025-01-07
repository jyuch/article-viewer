import { expandGlob } from "@std/fs/expand-glob";

export const layout = "layouts/category.vto";

interface Category {
  title: string;
  articles: string[];
}

const categories = expandGlob("*", { root: "./article" });

const c: Category[] = [];

for await (const category of categories) {
  if (category.isDirectory) {
    const articles = expandGlob("*", { root: `./article/${category.name}` });

    const a: string[] = [];
    for await (const article of articles) {
      a.push(article.name);
      a.push();
    }
    c.push({ title: category.name, articles: a.sort() });
  }
}

export default function* () {
  for (const category of c) {
    yield {
      title: category.title,
      articles: category.articles,
      url: `/article/${category.title}/index.html`,
    };
  }
}
