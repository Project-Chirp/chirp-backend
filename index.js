const express = require("express");
const appUserRoute = require("./routes/appUsersRoutes");
const appPostRoute = require("./routes/postRoutes");

const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}....`));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/appUsers", appUserRoute);
app.use("/api/posts", appPostRoute);
