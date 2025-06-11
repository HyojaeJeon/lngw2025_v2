const dotenv = require("dotenv");
dotenv.config();

// Replit 환경 감지
const isReplit = process.env.REPLIT || process.env.REPLIT_DB_URL;

const commonConfig = {
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

// SQLite 설정 (Replit 환경)
const sqliteConfig = {
  dialect: "sqlite",
  storage: "./database.sqlite",
  ...commonConfig
};

// MySQL 설정 (로컬 환경)
const mysqlConfig = {
  dialect: "mysql",
  dialectModule: require('mysql2'),
  ...commonConfig
};

module.exports = {
  development: isReplit ? {
    ...sqliteConfig
  } : {
    username: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "gywo9988!@",
    database: process.env.DB_NAME || "lngw2025_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    ...mysqlConfig
  },
  production: isReplit ? {
    ...sqliteConfig
  } : {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lngw2025_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    ...mysqlConfig
  },
};
