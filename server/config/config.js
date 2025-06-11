const dotenv = require("dotenv");
dotenv.config();

const commonConfig = {
  dialect: "mysql",
  timezone: process.env.DB_TIMEZONE || "+09:00",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: { 
    max: 5, 
    min: 0, 
    acquire: 60000, 
    idle: 30000,
    evict: 60000,
    handleDisconnects: true
  },
  retry: {
    match: [
      /ECONNRESET/,
      /ENOTFOUND/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ECONNABORTED/,
    ],
    max: 3
  },
};

module.exports = {
  development: {
    username: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "gywo9988!@",
    database: process.env.DB_NAME || "lngw2025_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    ...commonConfig
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lngw2025_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    ...commonConfig
  },
};
