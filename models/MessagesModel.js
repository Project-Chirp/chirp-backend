// Define the query to get the latest message between 2 users to display as a list
const getLatestMessages = `SELECT DISTINCT ON(otherUser) "displayName",
  username,
  "textContent",
  "messageTimestamp"
  FROM 
    (SELECT m.*, 
     CASE WHEN "sentUserId" = 1 THEN "receivedUserId" ELSE "sentUserId" END AS otherUser 
    FROM message m
    WHERE m."sentUserId" = 1 OR m."receivedUserId" = 1) s
  JOIN app_user u ON s.otherUser = u."userId"
  ORDER BY otherUser, "messageTimestamp" DESC;`;

module.exports = {
  getLatestMessages,
};
