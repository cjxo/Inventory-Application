const express = require("express");
const path = require("node:path");
const IndexRouter = require("./routes/indexRouter");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", IndexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}. http://localhost:3000`);
});
