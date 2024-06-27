const getUserInfo = `
  SELECT
  "userId",
  "username",
  "displayName"
  FROM app_user
  WHERE "auth0Id" = $1;
`;

const updateUserInfo = `
  UPDATE app_user
  SET "username" = $1, "displayName" = $2, "birthDate" = $3
  WHERE "userId" = $4
  RETURNING "userId", "displayName", "username";
`;

module.exports = {
  getUserInfo,
  updateUserInfo,
};
