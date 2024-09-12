const db = require("../db/query");

const Players = [
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
  createPlayer(1, "gigglesbiggles", 12, 312),
];

const Categories = [
  createCategory(1, "Potion", "A liquid that can be drank, usually once, immediately invoking special effects to the player who drank it."),
  createCategory(2, "Weapon", "An item that can enhance the performance of the welder."),
  createCategory(3, "Food", "An item that prevents the consumer from starving. It also helps in regeneration.")
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

function navBarItems(currentSelected) {
  return {
    items: [
      {v:"Players",h:"/players"},
      {v:"All Items",h:"/items"},
      {v:"Weapons",h:"/weapons"},
      {v:"Potions",h:"/potions"},
      {v:"Foods",h:"/foods"}
    ],
    selected: currentSelected,
  };
}

function getItemsFiltered(category) {
  const result = Items.map(item => ({ ...item, category: Categories[item.category_id - 1].name}));

  if (category !== null) {
    return result.filter(item => item.category.toLowerCase() === category.toLowerCase());
  } else {
    return result;
  }
}

const indexMainPage = (request, response) => {
  response.render("index", {
    players: getAllPlayers(),
    navBar: navBarItems(0)
  });
};

const indexDisplayPlayerInventory = (request, response) => {
  const playerID = parseInt(request.params.id);
  const result = PlayerItems.filter((element) => {
    return element.player_id === playerID;
  });

  const resultItems = [];
  if (result !== undefined) {
    result.forEach(entry => {
      resultItems.push({
        name: Items[entry.item_id - 1].name,
        quantity: entry.quantity,
        description: Items[entry.item_id - 1].description,
      });
    });
  }

  const player = Players[playerID - 1];
  response.render("index", { 
    playerItems: resultItems, 
    player: { 
      ...player,
      maxExperience: getMaxExpWithRespectToLevel(player.level),
    },
    navBar: navBarItems(0),
  });
};

const indexDisplayItems = (request, response) => {
  const category = request.params.category;
  let navBarIdx = 1;
  let itemCate = null;
  if (category !== "items") {
    navBarIdx = ["weapons", "potions", "foods"].findIndex((cate => cate === category));
    if (navBarIdx !== -1) {
      itemCate = category.slice(0, category.length - 1); 
      navBarIdx += 2;
    } 
  }

  if (navBarIdx !== -1) {
    response.render("index", {
      allItems: getItemsFiltered(itemCate),
      navBar: navBarItems(navBarIdx),
    });
  } else {
    response.status(404).send("Unable to GET /" + category);
  }
};

module.exports = {
  indexMainPage,
  indexDisplayPlayerInventory,
  indexDisplayItems,
};
