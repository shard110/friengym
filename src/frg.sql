ALTER TABLE Notification
MODIFY COLUMN type VARCHAR(20);

ALTER TABLE notification
DROP FOREIGN KEY FKaewhfcco7gq989s2p43smctny;

ALTER TABLE notification
ADD CONSTRAINT FKaewhfcco7gq989s2p43smctny
FOREIGN KEY (post_id) REFERENCES post (ponum)
ON DELETE CASCADE;



show tables;


ALTER TABLE user_likes DROP FOREIGN KEY FKgjorfcjmr8hu06aoq5tm3ijgm;
ALTER TABLE user_likes
ADD CONSTRAINT FKgjorfcjmr8hu06aoq5tm3ijgm
FOREIGN KEY (post_id) REFERENCES post (ponum)
ON DELETE CASCADE;

ALTER TABLE warningtbl DROP FOREIGN KEY warningtbl_ibfk_1;
ALTER TABLE warningtbl
ADD CONSTRAINT warningtbl_ibfk_1
FOREIGN KEY (post_id) REFERENCES post (ponum)
ON DELETE CASCADE;
