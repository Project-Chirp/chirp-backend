const express = require("express");
const appUserRoute = require("./Routes/appUsersRoutes");

const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}....`));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/protected", (req, res) => {
  res.send("Hello from protected route!");
});

app.use("/api/appUsers", appUserRoute);

// let str = {
//   content: "Hello World!",
//   subContent: "HELLO",
// };
// const testRoute = require("./testRoute");
// const { Client } = require("pg");
// const client = new Client({
//   host: "localhost",
//   user: "postgres",
//   port: "5432",
//   password: "twitter",
//   database: "twitter_clone",
// });

// client.connect();

// client.query(`Select * from app_user`, (err, res) => {
//   if (!err) {
//     console.log(res.rows);
//   } else {
//     console.log(err.message);
//   }
//   client.end;
// });

// const users = [
//   { id: 1, name: "Messi" },
//   { id: 2, name: "Ronaldo" },
//   { id: 3, name: "Mbappe" },
// ];

// app.get("/hello", (req, res) => {
//   res.send("Hello World!!");
// });

// app.get("/api/users", (req, res) => {
//   res.send(users);
// });

// app.get("/api/usersTweet", (req, res) => {
//   client.query(`Select * from app_user`, (err, res) => {
//     if (!err) {
//       console.log(res.rows);
//     } else {
//       console.log(err.message);
//     }
//     client.end;
//   });
// });

// app.get("/api/users/:id", (req, res) => {
//   let user = users.find((c) => c.id === parseInt(req.params.id));
//   if (!user) {
//     res.status(404).send("User with that ID does not exist.");
//   }
//   res.send(user);
// });

// app.get("/api/users/:id/:name", (req, res) => {
//   res.send(req.params);
// });

// app.get('/api/user/:pid/:Fname', (req, res)=> {
//     res.send(req.query);
// });
