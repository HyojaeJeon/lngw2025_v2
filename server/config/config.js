const dotenv = require("dotenv");
dotenv.config();

const commonConfig = {
  dialect: "mysql",
  timezone: process.env.DB_TIMEZONE || "+00:00",
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
    dialect: "mysql",
    storage: "./database/lngw2025_dev.sqlite",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  },
  production: {
    dialect: "sqlite",
    storage: "./database/lngw2025_prod.sqlite",
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  },
};
