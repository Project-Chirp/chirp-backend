const addPost = `
  INSERT INTO post (
    "userId", timestamp, "textContent"
  ) VALUES 
    ($1, $2, $3)
  RETURNING 
    "postId",
    "textContent",
    timestamp,
    "userId";
`;

const addReply = `
  INSERT INTO post (
    "userId", "parentPostId", timestamp, "textContent"
  ) VALUES
    ($1, $2, $3, $4)
  RETURNING 
    "postId",
    "parentPostId",
    "textContent",
    timestamp,
    "userId";
`;

const getAllPosts = `
  WITH post_likes AS (
    SELECT
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
	WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT 
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "repostedBy" IS NOT NULL THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
	  AND deleted = FALSE
    GROUP BY "parentPostId"
  ),
  parent_post_content AS (
	  SELECT
	  	p."postId" AS "repostId",
	  	parent_post."postId" AS "originalPostId",
      parent_post."textContent" AS "originalTextContent",
      parent_post."timestamp" AS "originalTimestamp",
		  "username" AS "originalPostUsername",
	  	parent_post."editedTimestamp" AS "originalEditedTimestamp",
		  "displayName" AS "originalDisplayName"
	  FROM post p
	  INNER JOIN post AS parent_post
	  	ON parent_post."postId" = p."parentPostId" AND p."repostedBy" IS NOT NULL
	  INNER JOIN app_user AS u
	  	ON parent_post."userId" = u."userId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    u."userId",
    p."textContent",
    p.timestamp,
    p."editedTimestamp",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    EXISTS (
      SELECT 1 
      FROM post p2
      WHERE p2."repostedBy" = 7
        AND p2."textContent" IS NULL
		    AND (p2."parentPostId" = p."postId"
		OR p2."postId" = p."postId") 
      LIMIT 1
    ) AS "isRepostedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts",
    CASE
      WHEN p."repostedBy" IS NOT NULL THEN json_build_object(
        'textContent', parent_post_content."originalTextContent",
        'timestamp', parent_post_content."originalTimestamp",
        'username', parent_post_content."originalPostUsername",
        'editedTimestamp', parent_post_content."originalEditedTimestamp",
        'displayName', parent_post_content."originalDisplayName"
      )
      ELSE NULL
	  END AS "originalPostContent"
    FROM post AS p
    LEFT JOIN post_likes AS l
      ON l."postId" = CASE
	  	WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
		  ELSE p."postId"
		  END
    LEFT JOIN post_replies_reposts AS r
      ON r."parentPostId" = CASE
	  	WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
		  ELSE p."postId"
		  END
	LEFT JOIN parent_post_content
		ON parent_post_content."repostId" = p."postId"
    INNER JOIN app_user AS u
      ON p."userId" = u."userId"
    WHERE NOT(p."parentPostId" IS NOT NULL AND p."repostedBy" IS NULL) -- Filter out replies
  	AND p."deleted" = FALSE
  ORDER BY p.timestamp DESC;
`;

const getPost = `
   WITH post_likes AS (
    SELECT 
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
	 WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT 
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "repostedBy" IS NOT NULL THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
	  AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    u."userId",
    p."textContent",
    p.timestamp,
    p."editedTimestamp",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    EXISTS (
      SELECT 1 
      FROM post p2
      WHERE p2."repostedBy" = $1 
        AND p2."textContent" IS NULL
		    AND p2."postId" = p."postId" 
      LIMIT 1
    ) AS "isRepostedByCurrentUser",
     CASE
      WHEN EXISTS (
        SELECT 1
        FROM follow WHERE "followerUserId" = $1
          AND "followedUserId" = u."userId"
      )
      THEN TRUE
      ELSE FALSE
    END AS "followStatus",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON l."postId" = CASE
    WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
    ELSE p."postId"
    END
  LEFT JOIN post_replies_reposts AS r
    ON r."parentPostId" = CASE
    WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
    ELSE p."postId"
    END
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  WHERE p."postId" = $2
  	AND p."deleted" = FALSE;
`;

const getReplies = `
  WITH post_likes AS (
    SELECT
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
    WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "repostedBy" IS NOT NULL THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    u."userId",
    p."textContent",
    p.timestamp,
    p."parentPostId",
    p."editedTimestamp",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    EXISTS (
      SELECT 1 
      FROM post p2
      WHERE p2."repostedBy" = $1 
        AND p2."textContent" IS NULL
		    AND p2."postId" = p."postId" 
      LIMIT 1
    ) AS "isRepostedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r
    ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"

  WHERE p."parentPostId" = $2
    AND p."deleted" = FALSE
  ORDER BY "numberOfLikes" DESC, "timestamp" DESC;
`;

const deletePost = `
  UPDATE post
  SET deleted = TRUE
  WHERE "postId" = $1
  AND deleted = FALSE`;

const likePost = `INSERT INTO liked_post ("userId", "postId") VALUES 
  ($1, $2)`;

const unlikePost = `DELETE FROM liked_post
  WHERE "userId" = $1
    AND "postId" = $2;
`;

const editPost = `
UPDATE post as p
SET "textContent" = $2, 
    "editedTimestamp" = $3
WHERE p."postId" = $1;
`;

const addRepost = `
  INSERT INTO post (
  "userId", "parentPostId",  timestamp, "repostedBy"
) VALUES 
  ($1, $2, $3, $1);
  `;

module.exports = {
  addPost,
  getAllPosts,
  likePost,
  unlikePost,
  getPost,
  getReplies,
  addReply,
  deletePost,
  editPost,
  addRepost,
};
