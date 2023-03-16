const getAllPosts = `SELECT u.username,
   u."displayName",
   p."textContent",
   p.timestamp
   FROM post AS p
   INNER JOIN app_user AS u ON p."userId" = u."userId"`;

const addPost = `INSERT INTO post ("userId", timestamp, "textContent", "isRepost", "isQuotePost", "isReply") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

module.exports = {
  addPost,
  getAllPosts,
};
