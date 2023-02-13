const getAllPosts = `SELECT u.email AS "username", 
   u.display_name AS "displayName",
   p.text_content AS "textContent",
   p.post_timestamp AS "timestamp"
   FROM post AS p 
   INNER JOIN app_user AS u ON p.user_id = u.user_id`;

const addPost = `INSERT INTO post (user_id, post_timestamp, text_content, is_repost, is_quote_post, is_reply) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

module.exports = {
  addPost,
  getAllPosts,
};
