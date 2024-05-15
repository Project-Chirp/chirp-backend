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

const getUsers = `
  SELECT 
      u."userId",
      u."displayName",
      u.username,
      COUNT(f."followedUserId") AS follower_count
  FROM 
      public.app_user u
  LEFT JOIN 
      public.follow f ON u."userId" = f."followedUserId"
  WHERE 
      u.username ILIKE '%' || $1 || '%'
      OR u."displayName" ILIKE '%' || $1 || '%'
  GROUP BY 
      u."userId", u."displayName", u.username
  ORDER BY 
      follower_count DESC
  OFFSET ($2 - 1) * 4
  LIMIT 4;
`;

module.exports = {
  getUserInfo,
  updateUserInfo,
  getUsers,
};
