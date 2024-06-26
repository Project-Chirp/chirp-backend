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
      u.username
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
      (SELECT COUNT(f1."followedUserId") 
     FROM public.follow f1 
     WHERE f1."followedUserId" = u."userId") DESC
  LIMIT 15;
`;

module.exports = {
  getUserInfo,
  updateUserInfo,
  getUsers,
};
