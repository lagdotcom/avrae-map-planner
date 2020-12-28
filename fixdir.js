const fs = require("fs");

if (fs.existsSync("build")) {
  if (fs.existsSync("docs")) {
    console.log("removing old docs folder");
    fs.rmSync("docs", { recursive: true });
  }

  console.log("renaming build to docs");
  fs.renameSync("build", "docs");
} else console.error("no build waiting");
