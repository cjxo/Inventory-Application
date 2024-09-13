const { Client } = require("pg");
require("dotenv").config();

const SQL = `
  DROP TABLE IF EXISTS player_items;
  DROP TABLE IF EXISTS player;
  DROP TABLE IF EXISTS item;
  DROP TABLE IF EXISTS category;

  CREATE TABLE IF NOT EXISTS player (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(96),
    level INTEGER,
    experience INTEGER
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

  INSERT INTO category (name, description)
  VALUES
  ('Potion', 'A liquid that can be drank, usually once, immediately invoking special effects to the player who drank it.'),
  ('Weapon', 'An item that can enhance the performance of the welder.'),
  ('Food', 'An item that prevents the consumer from starving. It also helps in regeneration.');

  INSERT INTO item (name, description, category_id)
  VALUES
  ('Steel Long Sword', 'Crafted with high-quality steel, the Steel Long Sword offers a balance of strength and durability.', 2),
  ('Regeneration Pot', 'A mysterious glass vial shimmering with green liquid that swirls on its own. Consume it to regain a slow, but steady, regenerative effect that restores health.', 1),
  ('Cooked Steak', 'A thick, juicy steak that has been expertly cooked over an open flame.', 3);

  INSERT INTO player (username, level, experience)
  VALUES
  ('gigglesbiggles0', 12, 312),
  ('gigglesbiggles1', 12, 312);

  INSERT INTO player_items (player_id, item_id, quantity)
  VALUES
  (1, 1, 1),
  (1, 2, 4),
  (1, 3, 12);
`;
/*
  
*/

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
