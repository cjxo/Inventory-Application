const { Router } = require("express");
const {
  indexMainPage,
  indexDisplayPlayerInventory,
  indexDisplayItems,
} = require("../controllers/indexController");
const IndexRouter = Router();

IndexRouter.get("/", indexMainPage);
IndexRouter.get("/players", (_, response) => {
  response.redirect("/");
});
IndexRouter.get("/:id/inventory", indexDisplayPlayerInventory);
IndexRouter.get("/:category", indexDisplayItems);

module.exports = IndexRouter;
