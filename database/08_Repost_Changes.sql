ALTER TABLE post 
DROP COLUMN "isRepost",
DROP COLUMN "isQuotePost",
ADD COLUMN "repostedBy" INT NOT NULL,
ADD CONSTRAINT "fkRepostedBy" FOREIGN KEY("repostedBy") REFERENCES app_user("userId")