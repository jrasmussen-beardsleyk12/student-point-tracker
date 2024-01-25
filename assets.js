// A custom format for defining assets for a web based project

module.exports = {
  output: "./static",
  files: {
    "home-page": {
      source: "./static/home-page.js"
    },
    "setup-dialogs": {
      source: "./static/setup-dialogs.js"
    },
    "site": {
      source: "./views/assets/site.less"
    }
  }
};
