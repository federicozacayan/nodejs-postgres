CREATE SCHEMA authentication;

CREATE TABLE authentication.users (
	id  SERIAL,
	email text NOT NULL,
	pass text NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO authentication.users (email,pass) VALUES
	 ('juan','123'),
	 ('pedro','456');
