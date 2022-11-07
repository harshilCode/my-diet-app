module.exports = {
  globDirectory: "./build/",
  globPatterns: ["**/*.{html,js}"],
  swDest: "./build/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
};
