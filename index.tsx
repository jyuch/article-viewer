import { walk } from "@std/fs";
import { JSX } from "npm:react/jsx-runtime";

const files = walk("./article", { maxDepth: 1, includeFiles: false });

const articles: JSX.Element[] = [];

for await (const file of files) {
  if (file.name !== "article") {
    articles.push(
      <li>
        <a href={"article/" + file.name + "/"}>{file.name}</a>
      </li>,
    );
  }
}

export default (data: Lume.Data, helpers: Lume.Helpers) => (
  <>
    <ul>
      {articles}
    </ul>
  </>
);
