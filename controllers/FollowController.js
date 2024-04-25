const pool = require("../database/db");
const profileQueries = require("../models/FollowModel");

const followUser = async (req, res) => {
  try {
    const { currentUserId, visitedUsername } = req.body;
    const query = await pool.query(profileQueries.followUser, [
      currentUserId,
      visitedUsername,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { currentUserId, visitedUsername } = req.body;
    const query = await pool.query(profileQueries.unfollowUser, [
      currentUserId,
      visitedUsername,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
};
