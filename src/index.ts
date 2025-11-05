import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";
import marked from "marked";
import { loadFront } from "yaml-front-matter";
import _ from "lodash";
import ABCJS from "abcjs";

import * as helpers from "./lib/helpers";

const port: number = 3000;
const filteredLoDashFunctions = Object.entries(_)
  .filter(([key, value]) => typeof value === "function" && key !== "each")
  .reduce((acc, [key, value]) => {
    //@ts-ignore
    acc[key] = value;
    return acc;
  }, {});

const hbs = engine({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "../views", "layouts"),
  partialsDir: path.join(__dirname, "../views", "partials"),
  helpers: {
    helpers,
    filteredLoDashFunctions,
    markdown: (markdownText: string) => marked.parse(markdownText),
  },
});

const app = express();

app.engine("hbs", hbs);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));

const localLibs = "/assets/libs";
const nodeMods = path.join(__dirname, "../node_modules");

app.use("/", express.static(path.join(__dirname, "../public")));
app.use(
  `${localLibs}/bootstrap/css`,
  express.static(path.join(nodeMods, "bootstrap/dist/css"))
);
app.use(
  `${localLibs}/bootstrap-icons`,
  express.static(path.join(nodeMods, "bootstrap-icons/font"))
);
app.use(
  `${localLibs}/bootstrap/js`,
  express.static(path.join(nodeMods, "bootstrap/dist/js"))
);
app.use(
  `${localLibs}/jquery`,
  express.static(path.join(nodeMods, "jquery/dist"))
);
app.use(
  `${localLibs}/abcjs/js`,
  express.static(path.join(nodeMods, "abcjs/dist"))
);
app.use(`${localLibs}/abcjs/css`, express.static(path.join(nodeMods, "abcjs")));
app.use(`${localLibs}/lodash`, express.static(path.join(nodeMods, "lodash")));
app.use(
  `${localLibs}/moment`,
  express.static(path.join(nodeMods, "moment/min"))
);
app.use(
  `${localLibs}/moment-timezone`,
  express.static(path.join(nodeMods, "moment-timezone/builds"))
);

app.get("/", (_, res) => {
  res.render("home");
});


app.get("/ssb", (_, res) => {
  const cooleys = `X:1
  T: Cooley's
  M: 4/4
  L: 1/8
  R: reel
  K: Emin
  D2|:"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|
  "Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|1"Em"DEFD E2 D2:|2"Em"DEFD E2 gf||
  |:"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|
  "Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|1"Em"DEFD E2 gf:|2"Em"DEFD E4|]
  `;

  res.render("ssb", { layout: "music", music: cooleys });
});

app.get("/marked", (_, res) => {
  const content = fs.readFileSync(
    path.join(__dirname, "../docs/sample.md"),
    "utf-8"
  );
  const parsed = loadFront(content, {
    contentKeyName: "mdContents",
  });

  res.render("marked", {
    layout: parsed.layout,
    title: parsed.title,
    markdownContent: parsed.mdContents,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
