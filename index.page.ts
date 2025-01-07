import { expandGlob } from "@std/fs/expand-glob";

export const layout = "layouts/index.vto";
export const url = "/index.html";
export const title = "index";

interface Category {
  title: string;
}

const files = expandGlob("*", { root: "./article" });

const categories: Category[] = [];

for await (const file of files) {
  if (file.isDirectory === true) {
    categories.push({ title: file.name });
  }
}

export default function* () {
  yield { categories: categories };
}
