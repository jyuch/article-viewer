import { walk } from "@std/fs";
import { JSX } from "npm:react/jsx-runtime";

const files = walk("./article", { maxDepth: 1, includeFiles: false });
const sorted_files: string[] = [];

for await (const file of files) {
  if (file.name !== "article") {
    sorted_files.push(file.name);
  }
}

const articles: JSX.Element[] = [];

for await (const file of sorted_files.sort()) {
  articles.push(
    <li>
      <a href={"article/" + file + "/"}>{file}</a>
    </li>,
  );
}

export default (data: Lume.Data, helpers: Lume.Helpers) => (
  <>
    <ul>
      {articles}
    </ul>
  </>
);
