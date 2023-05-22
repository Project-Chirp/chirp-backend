const getLatestMessages = `SELECT DISTINCT ON(otherUser) "displayName",
  username,
  "textContent",
  timestamp
  FROM 
    (SELECT m.*, 
     CASE WHEN "sentUserId" = $1 THEN "receivedUserId" ELSE "sentUserId" END AS otherUser 
    FROM message m
    WHERE m."sentUserId" = $1 OR m."receivedUserId" = $1) s
  JOIN app_user u ON s.otherUser = u."userId"
  ORDER BY otherUser, timestamp DESC;`;

module.exports = {
  getLatestMessages,
};
