const http = require("http"),
  path = require("path"),
  express = require("express"),
  bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");
db.serialize(function () {
  db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
  db.run(
    "INSERT INTO user VALUES ('brownStudent', 'colorBlind2', 'The Chosen One')"
  );
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query =
    "SELECT title FROM user where username = '" +
    username +
    "' and password = '" +
    password +
    "'";

  //res.send(`Username: ${username}, Password: ${password}`);
  console.log("username: " + username);
  console.log("password: " + password);
  console.log("query: " + query);

  db.get(query, function (err, row) {
    if (err) {
      console.log("ERROR", err);
      res.redirect("/index.html#error");
    } else if (!row) {
      res.redirect("/index.html#unauthorized");
    } else {
      res.send(
        "Hello <b>" +
          row.title +
          '!</b><br /> This file contains broken dreams and promises...: <br /><br /> Treasure Stuff... <br /><br /> Where your dreams are hidden <br /><br /> <a href="/index.html">Go back to login</a>'
      );
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
