const {override} = require("customize-cra");

module.exports = override(
    config => {
        config.output.path = require("path").resolve(__dirname, "docs");
        return config;
    }
)