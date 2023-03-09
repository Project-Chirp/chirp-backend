// Imports
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");

const pool = require("./database/db");
const appUserRoute = require("./Routes/appUsersRoutes");
const appPostRoute = require("./routes/postRoutes");

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
}).unless({ path: ["/"] });

const currentUserCheck = async (req, res, next) => {
  const auth0Id = req.auth.sub;
  const query = await pool.query(
    `SELECT * FROM app_user WHERE "auth0Id" = $1`,
    [auth0Id]
  );
  const user = query.rows;
  if (!user) {
    try {
      const accessToken = req.headers.authorization.split(" ")[1];
      const response = await axios.get(
        "https://dev-gxkwzphy3vwb5jqh.us.auth0.com/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userInfo = response.data;
      pool.query(
        `INSERT INTO app_user ("auth0Id", email, "joinedDate") VALUES ($1, $2, $3)`,
        [userInfo.sub, userInfo.email, new Date()]
      );
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

const app = express();
const port = process.env.SERVER_PORT || 3001;
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/appUsers", verifyJwt, currentUserCheck, appUserRoute);
app.use("/api/posts", appPostRoute);

app.get("/public", (req, res) => {
  res.send("Hello World!");
});

app.get("/protected", verifyJwt, currentUserCheck, async (req, res) => {
  res.send("Hello from protected route!");
});

app.listen(port, () => console.log(`Listening on port ${port}....`));
