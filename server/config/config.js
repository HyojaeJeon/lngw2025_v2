const dotenv = require("dotenv");
dotenv.config();

const commonConfig = {
  dialect: "mysql",
  timezone: process.env.DB_TIMEZONE || "+00:00",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
};

module.exports = {
  development: {
    username: process.env.DB_USER, // DB_USER
    password: process.env.DB_PASSWORD, // DB_PASSWORD
    database: process.env.DB_NAME, // DB_NAME
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    timezone: process.env.DB_TIMEZONE || "+00:00",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  },
  production: {
    username: process.env.DB_USER, // DB_USER
    password: process.env.DB_PASSWORD, // DB_PASSWORD
    database: process.env.DB_NAME, // DB_NAME
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    timezone: process.env.DB_TIMEZONE || "+00:00",
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  },
};
