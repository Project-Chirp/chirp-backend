const getAllPosts = `SELECT u.email AS "username", 
   u.display_name AS "displayName",
   p.text_content AS "textContent",
   p.post_timestamp AS "timestamp"
   FROM post AS p 
   INNER JOIN app_user AS u ON p.user_id = u.user_id`;

module.exports = {
  getAllPosts,
};
