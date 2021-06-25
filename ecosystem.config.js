module.exports = {
  apps: [
    {
      name: "app",
      script: "./src/index.js",
      autorestart: true,
      max_memory_restart: "500M",
      log_date_format: "HH:mm:ss",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
