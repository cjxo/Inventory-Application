const db = require("../db/query");

function getMaxExpWithRespectToLevel(level) {
  const result = (5 * level * level * level) / 4;
  return Math.floor(result);
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

const indexMainPage = async (request, response) => {
  const players = await db.getAllPlayers();
  response.render("index", {
    players: players.map(player => {
      return {
        ...player,
        maxExperience: getMaxExpWithRespectToLevel(player.level),
      };
    }),
    navBar: navBarItems(0)
  });
};

const indexDisplayPlayerInventory = async (request, response) => {
  const playerID = parseInt(request.params.id);

  const resultItems = await db.getItemsFromPlayerID(playerID);
  const player = await db.getPlayerFromID(playerID);

  console.log(resultItems);
  response.render("index", { 
    playerItems: resultItems,
    player: { 
      ...player,
      maxExperience: getMaxExpWithRespectToLevel(player.level),
    },
    navBar: navBarItems(0),
  });
};

const indexDisplayItems = async (request, response) => {
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

  console.log(await db.getItemsFiltered(itemCate), itemCate)
  if (navBarIdx !== -1) {
    response.render("index", {
      allItems: await db.getItemsFiltered(itemCate),
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
