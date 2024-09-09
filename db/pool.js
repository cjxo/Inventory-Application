const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  connectionString: `postgresql://${process.env.USER_ROLE}:${process.env.USER_ROLE_PWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
});
