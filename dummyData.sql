INSERT INTO accounts VALUES (1, 'Alex', 'alex', 8131, 'alex@email', 'ATL');
INSERT INTO accounts (username, password, passwordResetCode, email, location) VALUES('Ethan', 'ethan', 5823, 'ethan@email', 'ATL');
INSERT INTO accounts (username, password, passwordResetCode, email, location) VALUES('Neel', 'neel', 8490, 'neel@email', 'ATL');
INSERT INTO accounts (username, password, passwordResetCode, email, location) VALUES('David', 'david', 4923, 'david@email', 'ATL');
INSERT INTO artist (acntID, stageName, location, artistTag) VALUES (1, 'No Radicals', 'ATL', 'rock');
INSERT INTO artist (acntID, stageName, location, artistTag) VALUES (4, 'David Greene and the Runaway Girls', 'ATL', 'jazz');
INSERT INTO accountfollowsartist VALUES (1, 4);
INSERT INTO accountfollowsartist VALUES (2, 4);
INSERT INTO accountfollowsartist VALUES (3, 1);
INSERT INTO songs VALUES (1, 'bassmaster', 'rock');
INSERT INTO songs VALUES (2, 'let go', 'rock');
INSERT INTO songs VALUES (3, 'snow', 'rock');
INSERT INTO songs VALUES (4, 'Too many chickens in the coop', 'jazz');
INSERT INTO songs VALUES (5, 'somebody stole my mayo', 'jazz');
INSERT INTO songowner VALUES (4, 5);
INSERT INTO songowner VALUES (4, 4);
INSERT INTO songowner VALUES (1, 1);
INSERT INTO songowner VALUES (1, 2);
INSERT INTO songowner VALUES (1, 3);
INSERT INTO playlist VALUES (1, 1, 'Let Go', true, 'rock');
INSERT INTO playlist VALUES (2, 4, 'Happy Days', true, 'jazz');
INSERT INTO playlist VALUES (3, 2, 'Ethans favs', false, 'happy');
INSERT INTO playlist_has_songs VALUES (1, 1);
INSERT INTO playlist_has_songs VALUES (1, 2);
INSERT INTO playlist_has_songs VALUES (1, 3);
INSERT INTO playlist_has_songs VALUES (2, 4);
INSERT INTO playlist_has_songs VALUES (2, 5);
INSERT INTO playlist_has_songs VALUES (3, 1);
INSERT INTO playlist_has_songs VALUES (3, 2);
INSERT INTO playlist_has_songs VALUES (3, 4);
INSERT INTO playlist_has_songs VALUES (3, 5);