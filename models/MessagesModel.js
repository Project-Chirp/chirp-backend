// Define the query to get the latest message between 2 users to display as a list
const getLatestMessages = `SELECT "textContent",
   "sentUserId",
   "receivedUserId",
   "messageTimestamp"
   FROM message m
   WHERE m."messageTimestamp" = (
    SELECT MAX(m2."messageTimestamp")
    FROM message m2
    WHERE (m2."sentUserId" = m."sentUserId" AND m2."receivedUserId" = m."receivedUserId") OR
          (m2."sentUserId" = m."receivedUserId" AND m2."receivedUserId" = m."sentUserId")

    AND "sentUserId" = 1 OR "receivedUserId" = 1
      )
   ORDER BY "messageTimestamp" DESC;
   `;

module.exports = {
  getLatestMessages,
};

// JOIN
//   (SELECT MAX(messageTimestamp) maxtime) latest
//   on m.messageTimestamp=latest.maxtime
// WHERE "sentUserId" = $1 OR "receivedUserId" = $1

//get sent and received. pick the one that isnt the active user
