PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
DROP TABLE IF EXISTS todo_item;
CREATE TABLE IF NOT EXISTS todo_item
(
    item_id   integer not null
        constraint todo_item_pk
            primary key autoincrement,
    item_name text    not null,
    due_date  text    not null
);
INSERT INTO todo_item VALUES(1,'assignment 1','2022-05-12');
INSERT INTO todo_item VALUES(2,'project 1','2022-05-16');
INSERT INTO todo_item VALUES(3,'essay 1','2022-05-30');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('todo_item',3);
CREATE UNIQUE INDEX todo_item_item_id_uindex
    on todo_item (item_id);
COMMIT;
