const { Client } = require("pg");
require("dotenv").config();

const SQL = `
  CREATE TABLE IF NOT EXISTS player (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(96),
    level INTEGER,
    experience INTEGER,
    created_at VARCHAR(96)
  );

  CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(64),
    description VARCHAR(512)
  );

  CREATE TABLE IF NOT EXISTS item (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(64),
    description VARCHAR(512),
    category_id INTEGER REFERENCES category(id)
  );

  CREATE TABLE IF NOT EXISTS player_items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    player_id INTEGER REFERENCES player(id),
    item_id INTEGER REFERENCES item(id),
    quantity INTEGER
  );
`;

async function main() {
  console.log("seeding ...");
  
  const client = new Client({
    connectionString: `postgresql://${process.env.USER_ROLE}:${process.env.USER_ROLE_PWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("done");
  } catch (err) {
    console.error("Error during database seeding:", err);
  } finally {
    await client.end();
  }
}

main();
