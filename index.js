const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");
const appUserRoute = require("./Routes/appUsersRoutes");

const cors = require("cors");
const { response } = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-8e2eney2zngtvaof.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "tweeter identifier",
  issuer: "https://dev-8e2eney2zngtvaof.us.auth0.com/",
  algorithms: ["RS256"],
}).unless({ path: ["/"] });

app.use(verifyJwt);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/protected", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split("")[1];
    const response = await axios.get(
      "https://dev-8e2eney2zngtvaof.us.auth0.com/userinfo",
      {
        header: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userInfo = response.data;
    console.log(userInfo);
    res.send(userInfo);
  } catch (error) {
    res.send(error.message);
  }

  // res.send("Hello from protected route!");
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).send(message);
});

app.use("/api/appUsers", appUserRoute);
app.listen(port, () => console.log(`Listening on port ${port}....`));

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
