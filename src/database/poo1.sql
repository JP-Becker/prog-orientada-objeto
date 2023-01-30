-- Active: 1675099022431@@127.0.0.1@3306
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    video_length REAL NOT NULL,
    uploaded_at TEXT DEFAULT (DATETIME()) NOT NULL
);

SELECT * FROM videos;

DROP TABLE videos;

INSERT INTO videos (id, title, video_length)
VALUES
    ("v001", "video1", 100),
    ("v002", "video2", 200),
    ("v003", "video3", 300),
    ("v004", "video4", 400);