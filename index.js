const express = require("express");
const appUserRoute = require("./routes/appUsersRoutes");
const appPostRoute = require("./routes/postRoutes");
// Modules
const axios = require("axios");
const appUserRoute = require("./Routes/appUsersRoutes");

// Middlewears
const cors = require("cors");
const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");

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

const app = express();
const port = process.env.SERVER_PORT || 3001;
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).send(message);
});

app.use("/api/appUsers", appUserRoute);
app.use("/api/posts", appPostRoute);

app.get("/public", (req, res) => {
  console.log(req);
  res.send("Hello World!");
});

app.get("/protected", verifyJwt, async (req, res) => {
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
    console.log(userInfo);
    res.send(userInfo);
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}....`));
