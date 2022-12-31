const pool = require("../db");
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

module.exports = {
  getAppUsers,
  getUserById,
  addUser,
};
