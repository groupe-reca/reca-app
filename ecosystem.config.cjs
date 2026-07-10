module.exports = {
  apps: [
    {
      name: "reca-app",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "./dist",
        PM2_SERVE_PORT: 3010,
        PM2_SERVE_SPA: "true",
        NODE_ENV: "production"
      }
    }
  ]
};
