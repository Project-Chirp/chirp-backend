const addMessage = `
  INSERT INTO message (timestamp, "textContent", "sentUserId", "receivedUserId") VALUES 
    ($1, $2, $3, $4)
  RETURNING *;
`;

const getConversations = `
  SELECT DISTINCT ON("userId")
    "displayName",
    username,
    "textContent",
    timestamp,
    s."userId"
  FROM (
    SELECT m.*,
      CASE
        WHEN "sentUserId" = $1 
        THEN "receivedUserId" 
        ELSE "sentUserId" 
      END AS "userId"
    FROM message m
    WHERE m."sentUserId" = $1
      OR m."receivedUserId" = $1
  ) AS s
  INNER JOIN app_user u 
    ON s."userId" = u."userId"
  ORDER BY "userId", timestamp DESC;
`;

const getFollowedList = `
  SELECT 
    u."userId", 
    u."displayName", 
    u."username"
  FROM app_user u
  INNER JOIN follow f
    ON u."userId" = f."followedUserId"
  WHERE f."followerUserId" = $1;
`;

const getMessages = `
  SELECT *
  FROM message
  WHERE "sentUserId" in ($1, $2) 
    AND "receivedUserId" in ($1, $2)
  ORDER BY timestamp;
`;

const getOtherUser = `
  SELECT
    username,
    "displayName",
    "bio",
    "joinedDate",
    (
      SELECT
        COUNT(*)
      FROM follow
      WHERE "followedUserId" = u."userId"
    ) AS "followerCount",
     "userId"
  FROM app_user as u
  WHERE "userId" = $1;
`;

module.exports = {
  addMessage,
  getConversations,
  getFollowedList,
  getMessages,
  getOtherUser,
};
