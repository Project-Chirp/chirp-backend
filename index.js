// Imports
const { createServer } = require("http");
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const { unless } = require("express-unless");
const jwks = require("jwks-rsa");
const { Server } = require("socket.io");
const pool = require("./database/db");
const followRoute = require("./routes/followRoutes");
const messagesRoute = require("./routes/messagesRoutes");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const userRoute = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const server = createServer(app);
const port = process.env.SERVER_PORT || 3001;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const unauthenticatedRoutes = ["/"];

app.use(express.json());
app.use(cors());

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
}).unless({ path: unauthenticatedRoutes });

const currentUserCheck = async (req, res, next) => {
  if (!req.auth) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid auth token" });
  }
  const auth0Id = req.auth.sub;
  const query = await pool.query(
    `SELECT * FROM app_user WHERE "auth0Id" = $1`,
    [auth0Id],
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
        },
      );
      const userInfo = response.data;
      pool.query(
        `INSERT INTO app_user ("auth0Id", email, "joinedDate") VALUES ($1, $2, $3)`,
        [userInfo.sub, userInfo.email, new Date()],
      );
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

currentUserCheck.unless = unless;

app.use(jwtMiddleware);
app.use(currentUserCheck.unless({ path: unauthenticatedRoutes }));

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/profile", profileRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/follow", followRoute);

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}....`));
