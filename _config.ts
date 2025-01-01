import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";

const site = lume();
site
  .copy("article")
  .use(jsx());

export default site;
