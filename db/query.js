const db = require("./pool");

function getTimeNow() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const createPlayer = async (username, level, experience) => {
  const created_at = getTimeNow();
  const SQL = `
    INSERT INTO player (username, level, experience, created_at)
    VALUES ($1, $2, $3, $4);
  `;
  await db.query(SQL, [username, level, experience, created_at]);
};

const createCategory = async (name, description) => {
  const SQL = `
    INSERT INTO category (name, description)
    VALUES ($1, $2);
  `;

  await db.query(SQL, [name, description]);
};

const createItem = async (name, description, categoryName) => {
  // https://dba.stackexchange.com/questions/46410/how-do-i-insert-a-row-which-contains-a-foreign-key
  const insertItemSQL = `
    INSERT INTO item (name, description, category_id)
    VALUES ($1, $2, (SELECT id FROM category WHERE name = $3));
  `;

  try {
    await db.query(insertItemSQL, [name, description, categoryName]);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateOrAddItemToPlayer = async (playerName, itemName, quantity) => {
  const SQL = `
    INSERT INTO player_items (player_id, item_id, quantity)
    VALUES
    ((SELECT id FROM player WHERE username = $1),
     (SELECT id FROM item WHERE name = $2),
     $3)
  `;

  try {
    await db.query(SQL, [playerName, itemName, quantity]);
  } catch(err) {
    console.error(err);
    throw err;
  };
};

const getAllPlayers = async () => {
  const SQL = `
    SELECT * FROM player;
  `;

  try {
    const { result } = await db.query(SQL);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getItemsFiltered = async (category) => {
  const SQL = `
    SELECT * FROM item AS i
    INNER JOIN category AS c
    ON i.category_id = c.id
    WHERE c.name = $1;
  `;

  try {
    const { result } = await db.query(SQL, [category]);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  createPlayer,
  createCategory,
  createItem,
  updateOrAddItemToPlayer,
  getAllPlayers,
};
