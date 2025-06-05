const dotenv = require("dotenv");
dotenv.config();

const commonConfig = {
  dialect: "mysql",
  timezone: process.env.DB_TIMEZONE || "+00:00", // 추가된 부분
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = {
  development: {
    username: "appuser",
    password: "gywo9988!@",
    database: "lngw2025_db",
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      socketPath: "/home/runner/workspace/mysql.sock",
    },
    timezone: process.env.DB_TIMEZONE || "+00:00",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    use_env_variable: "DATABASE_URL",
    ...commonConfig,
  },

  production: {
    use_env_variable: "DATABASE_URL",
    ...commonConfig,
  },
};
