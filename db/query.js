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
    INSERT INTO player (username, level, experience)
    VALUES ($1, $2, $3);
  `;
  await db.query(SQL, [username, level, experience]);
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

const getPlayerFromID = async (ID) => {
  const SQL = `
    SELECT * FROM player
    WHERE id = $1;
  `;

  try {
    const { rows } = await db.query(SQL, [ID]);
    return rows[0];
  } catch (err) {
    throw err;
  }
}

const getAllPlayers = async () => {
  const SQL = `
    SELECT * FROM player;
  `;

  try {
    const { rows } = await db.query(SQL);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getItemsFiltered = async (category) => {
  const SQL = `
    SELECT item.name, item.description, category.name AS category
    FROM item
    INNER JOIN category
    ON item.category_id = category.id
    WHERE LOWER(category.name) LIKE $1;
  `;
  
  const SQLUnfiltered = `
    SELECT item.name, item.description, category.name AS category
    FROM item
    INNER JOIN category
    ON item.category_id = category.id;
  `;

  try {
    if (category) {
      const { rows } = await db.query(SQL, [category]);
      return rows;
    } else {
      const { rows } = await db.query(SQLUnfiltered);
      return rows;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getItemsFromPlayerID = async (playerID) => {
  const SQL = `
    SELECT item.name, player_items.quantity, item.description
    FROM player_items
    INNER JOIN item
    ON player_items.item_id = item.id
    WHERE player_items.player_id = $1;
  `;

  try {
    const { rows } = await db.query(SQL, [playerID]);
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createPlayer,
  createCategory,
  createItem,
  updateOrAddItemToPlayer,
  getPlayerFromID,
  getAllPlayers,
  getItemsFiltered,
  getItemsFromPlayerID 
};
