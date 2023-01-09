const listOfUsers = "SELECT * FROM app_user";

const getUserById = "SELECT * FROM app_user WHERE user_id = $1";

const checkIfEmailExists = "SELECT s.email FROM app_user s WHERE s.email = $1";

const addUser =
  "INSERT INTO app_user (email, password_hash, last_name, first_name, birth_date) VALUES ($1, $2, $3, $4, $5)";

module.exports = {
  listOfUsers,
  getUserById,
  checkIfEmailExists,
  addUser,
};
