const pool = require("../database/db");
const userQueries = require("../models/UserModel");

const getUserInfo = async (req, res) => {
  const auth0Id = req.auth.sub;
  const query = await pool.query(userQueries.getUserInfo, [auth0Id]);
  const user = query.rows[0];
  user.isLoading = false;
  res.send(user);
};

const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { username, birthDate } = req.body;
  let { displayName } = req.body;
  if (!displayName) {
    displayName = username;
  }
  const query = await pool.query(userQueries.updateUserInfo, [
    username,
    displayName,
    birthDate,
    userId,
  ]);
  res.send({ ...query.rows[0], isLoading: false });
};

const getUsers = async (req, res) => {
  try {
    const { keyword, offset } = req.query;
    const query = await pool.query(userQueries.getUsers, [keyword, offset]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  getUsers,
};
