const { Router } = require("express");
const {
  indexMainPage,
  indexDisplayPlayerInventory,
} = require("../controllers/indexController");
const IndexRouter = Router();

IndexRouter.get("/", indexMainPage);
IndexRouter.get("/players", (_, response) => {
  response.redirect("/");
});
IndexRouter.get("/:id/inventory", indexDisplayPlayerInventory);

module.exports = IndexRouter;
