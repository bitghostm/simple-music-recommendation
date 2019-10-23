const env = process.env.NODE_ENV || "development";
// use env variables or enter database info
const config = {
  development: {
    database: "recommendation",
    user: "",
    password: "",
  },
  test: {
    database: "recommendation_test",
    user: "",
    password: "",
  },
};

module.exports = {
  client: "pg",
  connection: config[env],
  migrations: {
    tableName: "migrations",
  }
};
