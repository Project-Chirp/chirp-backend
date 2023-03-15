const pool = require("../database/db");
const appUsersQueries = require("../Models/appUsersModel");

const getAppUsers = (req, res) => {
  pool.query(appUsersQueries.listOfUsers, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getUserById = (req, res) => {
  const user_id = parseInt(req.params.user_id);
  pool.query(appUsersQueries.getUserById, [user_id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addUser = (req, res) => {
  const { email, password_hash, last_name, first_name, birth_date } = req.body;
  //Query to see if email exists in DB already
  pool.query(appUsersQueries.checkIfEmailExists, [email], (error, results) => {
    if (results.rows.length) {
      res.send("Email already exists");
    } else {
      //Add user to DB if it does not exist
      pool.query(
        appUsersQueries.addUser,
        [email, password_hash, last_name, first_name, birth_date],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("Account created successfully!");
        }
      );
    }
  });
};

const getBasicUserInfo = async (req, res) => {
  const auth0Id = req.auth.sub;
  const query = await pool.query(
    `SELECT "userId",
    "username",
    "displayName"
    FROM app_user WHERE "auth0Id" = $1`,
    [auth0Id]
  );
  const user = query.rows[0];
  user.isLoading = false;
  res.send(user);
};

const addBasicUserInfo = async (req, res) => {
  console.log(req.auth.sub);
  const auth0Id = req.auth.sub;
  const { username, displayName, birthDate } = req.body;
  const query = await pool.query(
    `UPDATE app_user
     SET "username" = $1,
     "displayName" = $2,
     "birthDate" = $3
     WHERE "auth0Id" = $4`,
    [username, displayName, birthDate, auth0Id]
  );
  console.log(query);
  res.send("Hey");
};

module.exports = {
  addBasicUserInfo,
  getAppUsers,
  getBasicUserInfo,
  getUserById,
  addUser,
};
