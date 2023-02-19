CREATE DATABASE twitter_clone;

CREATE TABLE app_user(
    "userId" SERIAL PRIMARY KEY,
    "displayName" VARCHAR(100),
    "auth0Id" VARCHAR(100),
    "userName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "birthDate" DATE,
    "joinedDate" DATE NOT NULL
);

CREATE TABLE message(
    "messageId" SERIAL PRIMARY KEY,
    "messageTimestamp" TIMESTAMPTZ NOT NULL,
    "textContent" TEXT,
    "sentUserId" INT NOT NULL,
    CONSTRAINT "fkSentUserId"
        FOREIGN KEY("sentUserId")
            REFERENCES app_user("userId"),
    "receivedUserId" INT NOT NULL,
    CONSTRAINT "fkReceivedUserId"
        FOREIGN KEY("receivedUserId")
            REFERENCES app_user("userId")
);

CREATE TABLE message_media(
    "messageId" INT NOT NULL,
    CONSTRAINT "fkMessageId"
        FOREIGN KEY("messageId")
            REFERENCES message("messageId"),
    "link" TEXT NOT NULL,
    PRIMARY KEY("messageId", "link")
);

CREATE TABLE post(
    "postId" SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
     CONSTRAINT "fkUserId"
        FOREIGN KEY("userId")
            REFERENCES app_user("userId"),
    "parentPostId" INT,
    CONSTRAINT "fkParentPostId"
        FOREIGN KEY("parentPostId")
            REFERENCES post("postId"),
    "postTimestamp" TIMESTAMPTZ NOT NULL,
    "textContent" TEXT,
    "isRepost" BOOLEAN NOT NULL,
    "isQuotePost" BOOLEAN NOT NULL,
    "isReply" BOOLEAN NOT NULL
);

CREATE TABLE post_media(
    "postId" INT NOT NULL,
    CONSTRAINT "fkPostId"
        FOREIGN KEY("postId")
            REFERENCES post("postId"),
    "link" TEXT NOT NULL,
    PRIMARY KEY("postId", "link")
);

CREATE TABLE liked_post(
    "userId" INT NOT NULL,
    CONSTRAINT "fkUserId"
        FOREIGN KEY("userId")
            REFERENCES app_user("userId"),
    "postId" INT NOT NULL,
    CONSTRAINT "fkPostId"
        FOREIGN KEY("postId")
            REFERENCES post("postId"),
    PRIMARY KEY("userId","postId")
);

CREATE TABLE follow(
    "followerUserId" INT NOT NULL,
    CONSTRAINT "fkFollowerUserId"
        FOREIGN KEY("followerUserId")
            REFERENCES app_user("userId"),
    "followedUserId" INT NOT NULL,
    CONSTRAINT "fkFollowedUserId"
        FOREIGN KEY("followedUserId")
            REFERENCES app_user("userId"),
    "followedDate" DATE NOT NULL,
    "followStatus" BOOLEAN NOT NULL,
    PRIMARY KEY("followerUserId", "followedUserId")
);


/*Inserting User*/
INSERT INTO app_user ( "displayName", "userName", "auth0Id", "email", "joinedDate", "birthDate")
VALUES ( 'John Doe', 'JohnDoe','auth|0f05fq5098g238', 'johndoe@gmail.com', '2023-01-08', '1999-01-08');

INSERT INTO app_user ( "displayName", "userName","auth0Id", "email", "joinedDate", "birthDate")
VALUES ( 'Michael Stewart', 'MStew','auth|dfg5245568g8jq','tracey.bond@gmail.com', '2022-05-18', '1980-05-22');

INSERT INTO app_user ( "displayName", "userName","auth0Id", "email", "joinedDate", "birthDate")
VALUES ( 'Benjamin Davidson', 'BenDavid123','auth|2gtunqa3113fvn','benjamin.davidson@gmail.com', '2023-02-04', '2001-10-02');

INSERT INTO app_user ( "displayName", "userName","auth0Id", "email", "joinedDate", "birthDate")
VALUES ( 'Alan Paterson', 'APaterson','auth|gjnca35769davn','alan.paterson@gmail.com', '2022-02-28', '2004-11-29');

INSERT INTO app_user ( "displayName", "userName","auth0Id", "email", "joinedDate")
VALUES ( 'Joe Anderson', 'Anderson', 'auth|sdq315gb2cavcac','joe.anderson@gmail.com', '2021-03-08');


/*Inserting Messages*/
INSERT INTO message ("messageTimestamp", "textContent", "sentUserId", "receivedUserId")
VALUES ('2022-12-27 21:26:39.023989-07', 'Hey. How are you?', 1, 2);

INSERT INTO message ("messageTimestamp", "textContent", "sentUserId", "receivedUserId")
VALUES ('2022-12-27 21:30:55.023489-07', 'Im doing okay. What are you up to?', 2, 1);

INSERT INTO message ("messageTimestamp", "textContent", "sentUserId", "receivedUserId")
VALUES ('2022-12-27 21:31:10.027424-07', 'Not much.. just work and school', 1, 2);

INSERT INTO message ("messageTimestamp", "textContent", "sentUserId", "receivedUserId")
VALUES ('2022-12-27 21:31:52.027343-07', 'Looking forward to Christmas', 1, 2);

INSERT INTO message ("messageTimestamp", "textContent", "sentUserId", "receivedUserId")
VALUES ('2022-11-10 10:22:53.027233-07', 'Going skating. Wanna come?', 3, 4);

INSERT INTO message ("messageTimestamp", "textContent", "sentUserId", "receivedUserId")
VALUES ('2022-11-10 10:25:36.024285-07', 'Yea sure, when and where', 4, 3);

INSERT INTO message ("messageTimestamp", "textContent", "sentUserId", "receivedUserId")
VALUES ('2022-12-27 21:32:22.027653-07', 'Same here', 2, 1);

/*Inserting Message Media*/


/*Inserting Post*/
INSERT INTO post ("userId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (1,'2022-12-25 10:40:36.024285-07', 'Merry Christmas', false, false, false);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (2, 1, '2022-12-25 10:45:34.024632-07', 'Merry Christmas to you too', false, false, true);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (3, 1, '2022-12-25 11:01:22.022342-07', 'Thanks John. You too.', false, false, true);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "isRepost", "isQuotePost", "isReply")
VALUES (5, 3, '2022-12-30 17:04:45.022242-07', true, false, false);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "isRepost", "isQuotePost", "isReply")
VALUES (1, 4, '2022-12-30 17:10:35.027442-07', true, false, false);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (1, 4, '2022-12-30 17:30:37.024452-07', 'I got some pretty good sales from there too, would recommend', false, true, false);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (2, 4, '2022-12-30 17:37:42.024834-07', 'What did you get?', false, false, true);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (2, 7, '2022-12-30 17:42:32.024848-07', 'Mario kart is awesome, you will have so much fun', false, false, true);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "isRepost", "isQuotePost", "isReply")
VALUES (4, 8, '2022-12-30 17:50:12.024428-07', true, false, false);

INSERT INTO post ("userId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (3,'2022-12-31 14:22:26.027885-07', 'New Years party is gonna be a blast', false, false, false);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (3, 10, '2022-12-31 14:30:22.024956-07', 'So excited for this', false, false, true);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (3, 9, '2022-12-31 14:36:32.028546-07', 'I love these games', false, false, true);

INSERT INTO post ("userId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (5,'2022-12-31 17:46:43.028646-07', 'Hockey is the best sport of all time!', false, false, false);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (2, 8, '2022-12-31 17:55:33.028634-07', 'Based take', false, true, false);

INSERT INTO post ("userId", "parentPostId", "postTimestamp", "textContent", "isRepost", "isQuotePost", "isReply")
VALUES (3, 8, '2022-12-31 17:59:46.028434-07', 'Cant agree with you on this one', false, false, true);

/*Inserting Follow*/
INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (2, 1, '2022-09-01', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (1, 2, '2022-09-01', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (3, 1, '2022-09-04', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (3, 2, '2022-09-04', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (5, 3, '2022-09-07', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (3, 5, '2022-09-07', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (1, 3, '2022-09-07', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (4, 1, '2022-09-08', false);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (4, 2, '2022-09-08', false);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (5, 1, '2022-09-10', false);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (5, 2, '2022-09-10', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (2, 5, '2022-09-12', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (2, 3, '2022-09-10', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (4, 3, '2022-09-11', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (1, 4, '2022-09-11', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (2, 4, '2022-09-09', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (3, 4, '2022-09-14', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (5, 4, '2022-09-22', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (1, 5, '2022-09-11', true);

INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
VALUES (4, 5, '2022-09-17', true);

/*Insert Liked Post*/
INSERT INTO liked_post ("userId", "postId")
VALUES (2, 1);

INSERT INTO liked_post ("userId", "postId")
VALUES (3, 1);

INSERT INTO liked_post ("userId", "postId")
VALUES (5, 4);

INSERT INTO liked_post ("userId", "postId")
VALUES (1, 4);

INSERT INTO liked_post ("userId", "postId")
VALUES (2, 9);

INSERT INTO liked_post ("userId", "postId")
VALUES (1, 9);

INSERT INTO liked_post ("userId", "postId")
VALUES (4, 4);

INSERT INTO liked_post ("userId", "postId")
VALUES (2, 10);

INSERT INTO liked_post ("userId", "postId")
VALUES (1, 12);

INSERT INTO liked_post ("userId", "postId")
VALUES (4, 12);

INSERT INTO liked_post ("userId", "postId")
VALUES (3, 12);

INSERT INTO liked_post ("userId", "postId")
VALUES (3, 9);

INSERT INTO liked_post ("userId", "postId")
VALUES (2, 13);

INSERT INTO liked_post ("userId", "postId")
VALUES (5, 12);

INSERT INTO liked_post ("userId", "postId")
VALUES (1, 8);

