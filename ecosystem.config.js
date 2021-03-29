module.exports = {
  apps: [
    {
      name: "app",
      script: "./src/bot.js",
      autorestart: true,
      log_date_format: "HH:mm:ss",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
