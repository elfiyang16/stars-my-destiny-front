/* eslint-disable @typescript-eslint/no-var-requires */
const { withPlugins } = require("next-compose-plugins");

module.exports = withPlugins([
  [
    process.env.ANALYZE === "true"
      ? require("@next/bundle-analyzer")({ enable: true })
      : {},
  ],
]);
