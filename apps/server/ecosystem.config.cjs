module.exports = {
  apps: [
    {
      name: "make-video",
      script: "./dist/main.js",
      cwd: "/www/wwwroot/make-video/makeVideo/apps/server",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
