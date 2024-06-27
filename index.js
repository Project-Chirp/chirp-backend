// Imports
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");

const pool = require("./database/db");
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const messagesRoute = require("./routes/messagesRoutes");
const followRoute = require("./routes/followRoutes");

const jwtMiddleware = jwt({
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
  if (user.length == 0) {
    try {
      const accessToken = req.headers.authorization.split(" ")[1];
      const response = await axios.get(
        `https://${process.env.AUTH0_DOMAIN}/userinfo`,
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

const extractUserId = async (req, res, next) => {
  console.log("Auth object:", req.auth); // Log the auth object

  if (req.auth && req.auth.sub) {
    const auth0Id = req.auth.sub;
    try {
      const query = await pool.query(
        `SELECT "userId" FROM app_user WHERE "auth0Id" = $1`,
        [auth0Id]
      );
      const user = query.rows[0];
      console.log("User found:", user);
      if (user) {
        req.user = user;
      } else {
        return res.status(401).send("User not found");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
  next();
};
const app = express();
const port = process.env.SERVER_PORT || 3001;
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(jwtMiddleware.unless({ path: ["/"] }));
app.use(currentUserCheck);

app.use("/api/users", userRoute);
app.use("/api/posts", jwtMiddleware, extractUserId, postRoute);
app.use("/api/profile", jwtMiddleware, extractUserId, profileRoute);
app.use("/api/messages", jwtMiddleware, extractUserId, messagesRoute);
app.use("/api/follow/", jwtMiddleware, extractUserId, followRoute);

app.listen(port, () => console.log(`Listening on port ${port}....`));
