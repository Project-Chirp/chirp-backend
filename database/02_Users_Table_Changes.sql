ALTER TABLE app_user
ADD COLUMN "bio" TEXT;
UPDATE app_user
SET "bio" = 'Hi guys!. Im new here and I am a big Manchester United Fan. PS I also watch anime and play Valorant!'
WHERE "userId" = 6;