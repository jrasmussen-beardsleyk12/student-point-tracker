const less = require("less");
const fs = require("fs");
const path = require("path");

module.exports = function compileSheets() {
  // This function can be called to force the recompiling of both built in
  // and user provided sheets
  compile("./views/assets/site.less");
};

function compile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const file = fs.readFileSync(filePath, { encoding: "utf8" });
  const css = less
    .render(file, {
      sourceMap: {
        sourceMapFileInline: true,
      },
    })
    .then((output) => {
      try {
        fs.writeFileSync(
          `./static/${path.basename(filePath, ".less")}.css`,
          output.css,
        );
      } catch (err) {
        console.error(err);
      }
    });
}
