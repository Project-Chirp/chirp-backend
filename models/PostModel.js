const getAllPosts =
  "SELECT u.email, u.display_name, p.text_content, p.post_timestamp FROM post p INNER JOIN app_user u on p.user_id = u.user_id";

module.exports = {
  getAllPosts,
};
