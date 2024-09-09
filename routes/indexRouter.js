const { Router } = require("express");
const {
  indexMainPage,
} = require("../controllers/indexController");
const IndexRouter = Router();

IndexRouter.get("/", indexMainPage);

module.exports = IndexRouter;
