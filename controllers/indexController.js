const Players = [
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
];

const Categories = [
  createCategory(1, "potion", "A liquid that can be drank, usually once, immediately invoking special effects to the player who drank it."),
  createCategory(2, "weapon", "An item that can enhance the performance of the welder."),
  createCategory(3, "food", "An item that prevents the consumer from starving. It also helps in regeneration.")
];

const Items = [
  createItem(1, "Steel Long Sword", "Crafted with high-quality steel, the Steel Long Sword offers a balance of strength and durability.", 2),
  createItem(2, "Regeneration Pot", "A mysterious glass vial shimmering with green liquid that swirls on its own. Consume it to regain a slow, but steady, regenerative effect that restores health.", 1),
  createItem(3, "Cooked Steak", "A thick, juicy steak that has been expertly cooked over an open flame.", 3),
];

const PlayerItems = [
  addOrUpdateItemToPlayer(1, 1, 1, 1),
  addOrUpdateItemToPlayer(2, 1, 3, 12),
  addOrUpdateItemToPlayer(3, 1, 2, 3),
];

function getTimeNow() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// TODO: actual DB functions. Currently drafting one.
function createPlayer(id, username, level, experience) {
  const result = {
    id: id,
    username: username,
    level: level,
    experience: experience,
    created_at: getTimeNow(),
  };
  return result;
};

function createCategory(id, name, description) {
  const result = {
    id: id,
    name: name,
    description: description,
  };
  return result;
};

function createItem(id, name, description, category_id) {
  const result = {
    id: id,
    name: name,
    description: description,
    category_id: category_id, // the foreign key
  };
  return result;
}

function addOrUpdateItemToPlayer(id, player_id, item_id, quantity) {
  const result = {
    id: id,
    player_id: player_id, // the foreign key
    item_id: item_id, // the foreign key
    quantity: quantity,
  };

  return result;
}

function getMaxExpWithRespectToLevel(level) {
  const result = (5 * level * level * level) / 4;
  console.log(result);
  return Math.floor(result);
}

function getAllPlayers() {
  return Players.map(player => {
    return {
      ...player,
      maxExperience: getMaxExpWithRespectToLevel(player.level)
    };
  });
}

const indexMainPage = (request, response) => {
  response.render("index", { players: getAllPlayers() });
};

module.exports = {
  indexMainPage,
};
