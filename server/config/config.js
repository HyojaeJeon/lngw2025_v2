// server/config/config.js
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "marketing_dashboard",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: "mysql",
    timezone: "+09:00",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  test: {
    username: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "marketing_dashboard",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: "mysql",
    timezone: "+09:00",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  production: {
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "marketing_dashboard",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: "mysql",
    timezone: "+09:00",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
