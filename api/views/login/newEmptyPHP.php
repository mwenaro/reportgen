<?php

"SELECT name,adm,form,studentId FROM students 
WHERE studentId NOT IN (
SELECT studentId FROM marks 
WHERE examId IS '6 ' AND subjectId IS ' 1') AND form IS '2' AND isDeleted IS NOT 1 "





(1,1),
(1,2),
(1,3),
(1,4),
(2,1),
(2,2),
(2,3),
(2,4),
(3,1),
(3,2),
(3,3),
(3,4),
(4,1),
(4,2),
(4,3),
(4,4),
(5,1),
(5,2),
(5,3),
(5,4),
(6,1),
(6,2),
(6,3),
(6,4)
(7,1),
(7,2),
(7,3),
(7,4),
(8,1),
(8,2),
(8,3),
(8,4),
(9,1),
(9,2),
(9,3),
(9,4),
(10,1),
(10,2),
(10,3),
(10,4),
(11,1),
(11,2),
(11,3),
(11,4),
(12,1),
(12,2),
(12,3),
(12,4)



CREATE TABLE `tests` (
	`testId`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`courseId`	INTEGER,
	`examId`	INTEGER,
	`max_score`	NUMERIC DEFAULT 100,
	`dateCreated`	datetime DEFAULT current_timestamp,
	`dateUpdated`	datetime DEFAULT current_timestamp,
	`updatorId`	INTEGER,
	`creatorId`	INTEGER DEFAULT 1,
	`isDeleted`	INTEGER DEFAULT 0
);






















