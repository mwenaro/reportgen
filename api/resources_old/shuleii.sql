BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `users` (
	`userId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`username`	varchar ( 100 ) NOT NULL UNIQUE,
	`role`	VARCHAR ( 100 ) NOT NULL DEFAULT "user",
	`password`	varchar ( 150 ) NOT NULL,
	`date_reg`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`active`	enum ( 1 , 0 ) NOT NULL DEFAULT 0,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL,
	`securityQuiz`	varchar ( 250 ),
	`securityAns`	TEXT
);
INSERT INTO `users` (userId,username,role,password,date_reg,active,isDeleted,creatorId,dateCreated,dateUpdated,updatorId,securityQuiz,securityAns) VALUES (2,'admin','admin','admin','2018-07-26 19:34:16',1,0,2,'2018-07-26 19:34:16',NULL,NULL,NULL,NULL),
 (3,'user','user','user','2018-07-26 19:35:03',1,0,2,'2018-07-26 19:35:03',NULL,NULL,NULL,NULL),
 (7173,'mwero','admin','user','2018-07-26 19:33:29',1,0,2,'2018-07-26 19:33:29',NULL,NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS `tests` (
	`testId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`examId`	int ( 20 ) NOT NULL,
	`courseId`	int ( 20 ) NOT NULL,
	`testDate`	date DEFAULT NULL,
	`supervisorId`	int ( 20 ) DEFAULT NULL,
	`isItDone`	enum ( 0 , 1 ) NOT NULL DEFAULT 0,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `terms` (
	`termId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`termName`	varchar ( 10 ) NOT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `teachers` (
	`teacherId`	int ( 11 ) NOT NULL,
	`upi`	varchar ( 7 ) DEFAULT NULL,
	`fName`	varchar ( 100 ) NOT NULL,
	`mName`	varchar ( 100 ) NOT NULL,
	`lName`	varchar ( 100 ) NOT NULL,
	`initials`	varchar ( 10 ) DEFAULT NULL UNIQUE,
	`dob`	date DEFAULT NULL,
	`sex`	CHAR ( 1 ) NOT NULL,
	`marital`	CHAR ( 1 ) NOT NULL DEFAULT "s",
	`type`	varchar ( 5 ) NOT NULL DEFAULT "bom",
	`county`	varchar ( 100 ) DEFAULT NULL,
	`subcounty`	varchar ( 100 ) DEFAULT NULL,
	`dateReport`	datetime DEFAULT CURRENT_TIMESTAMP,
	`isPresent`	enum ( 0 , 1 ) NOT NULL DEFAULT 0,
	`phone`	varchar ( 15 ) DEFAULT NULL,
	`idNo`	int ( 20 ) NOT NULL UNIQUE,
	`link`	int ( 1 ) DEFAULT 1,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL,
	`password`	varchar ( 160 ),
	`securityQuiz`	TEXT,
	`securityAns`	TEXT,
	PRIMARY KEY(`teacherId`)
);
CREATE TABLE IF NOT EXISTS `subjects` (
	`subjectId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`subjectName`	varchar ( 100 ) NOT NULL,
	`intitals`	varchar ( 10 ) DEFAULT NULL,
	`departmentId`	int ( 11 ) DEFAULT NULL,
	`isOffered`	enum ( 0 , 1 ) NOT NULL DEFAULT 0,
	`link`	int ( 1 ) NOT NULL DEFAULT 1,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `students` (
	`studentId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`fName`	varchar ( 100 ) NOT NULL,
	`mName`	varchar ( 100 ) DEFAULT NULL,
	`lName`	varchar ( 100 ) NOT NULL,
	`dob`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`sex`	CHAR ( 1 ) NOT NULL,
	`religion`	varchar ( 100 ) DEFAULT NULL,
	`county`	varchar ( 150 ) DEFAULT NULL,
	`subcounty`	varchar ( 150 ) DEFAULT NULL,
	`admNo`	varchar ( 11 ) DEFAULT NULL,
	`formId`	int ( 11 ) DEFAULT NULL,
	`upi`	varchar ( 7 ) DEFAULT NULL,
	`clubs`	VARCHAR ( 250 ) DEFAULT NULL,
	`designationId`	int ( 11 ) DEFAULT NULL,
	`constituency`	varchar ( 200 ) DEFAULT NULL,
	`residence`	varchar ( 200 ) DEFAULT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`doa`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL,
	`password`	varchar ( 150 ),
	`securityQuiz`	TEXT,
	`securityAns`	TEXT
);
INSERT INTO `students` (studentId,fName,mName,lName,dob,sex,religion,county,subcounty,admNo,formId,upi,clubs,designationId,constituency,residence,isDeleted,creatorId,doa,dateCreated,dateUpdated,updatorId,password,securityQuiz,securityAns) VALUES (1,'abdalla','mwero','mangale','2018-07-14','m','i','kwale','kinango','7173',4,NULL,NULL,NULL,NULL,NULL,0,NULL,'2018-07-27 12:43:29','2018-07-27 12:43:29',NULL,NULL,NULL,NULL,NULL),
 (2,'saum','mlongo','mwero','2018-07-27 12:46:01','f','i','kwale','kinango','200',1,'',NULL,NULL,NULL,NULL,0,NULL,'2018-07-27 12:46:01','2018-07-27 12:46:01',NULL,NULL,NULL,NULL,NULL),
 (3,'rashid','mwero','mwero','18181818-2727-0707','m','i',NULL,NULL,'300',2,NULL,NULL,NULL,NULL,'miyani',0,NULL,'2018-07-27 14:21:00','2018-07-27 14:21:00',NULL,NULL,NULL,NULL,NULL),
 (4,'Rashid','mwero','mweroe','2018-07-2016','m','i',NULL,NULL,'300',2,NULL,NULL,NULL,NULL,'miyani',0,NULL,'2018-07-27 14:21:01','2018-07-27 14:21:01',NULL,NULL,NULL,NULL,NULL),
 (5,'rashid','mwero','mwero','18181818-2727-0707','m','i',NULL,NULL,'300',2,NULL,NULL,NULL,NULL,'miyani',1,NULL,'2018-07-27 14:21:08','2018-07-27 14:21:08',NULL,NULL,NULL,NULL,NULL),
 (6,'Rashid','mwero','mweroe','2018-07-2016','m','i',NULL,NULL,'300',2,NULL,NULL,NULL,NULL,'miyani',1,NULL,'2018-07-27 14:21:08','2018-07-27 14:21:08',NULL,NULL,NULL,NULL,NULL),
 (7,'rashid','mwero','mwero','18181818-2727-0707','m','i',NULL,NULL,'300',2,NULL,NULL,NULL,NULL,'miyani',1,NULL,'2018-07-27 14:21:34','2018-07-27 14:21:34',NULL,NULL,NULL,NULL,NULL),
 (8,'Rashid','mwero','mweroe','2018-07-2016','m','i',NULL,NULL,'300',2,NULL,NULL,NULL,NULL,'miyani',0,NULL,'2018-07-27 14:21:34','2018-07-27 14:21:34',NULL,NULL,NULL,NULL,NULL),
 (9,'rashid','mwero','mwero','2018-07-18','m','i',NULL,NULL,'300',2,NULL,NULL,NULL,NULL,'Miyani',0,NULL,'2018-07-27 14:23:39','2018-07-27 14:23:39',NULL,NULL,NULL,NULL,NULL),
 (10,'hussein','nyawa','mwero','2018-07-14','m','i',NULL,NULL,'111',3,NULL,NULL,NULL,NULL,'miyani',0,NULL,'2018-07-27 16:02:04','2018-07-27 16:02:04',NULL,NULL,NULL,NULL,NULL),
 (11,'bora','nyawa','mangale','1920-12-11','m','c',NULL,NULL,'100',2,NULL,NULL,NULL,NULL,'miyani',0,NULL,'2018-07-27 16:08:06','2018-07-27 16:08:06',NULL,NULL,NULL,NULL,NULL),
 (12,'charo','rocha','mube','1020-01-02','m','c',NULL,NULL,'178',1,NULL,NULL,NULL,NULL,'kwao',0,NULL,'2018-07-28 05:48:35','2018-07-28 05:48:35',NULL,NULL,NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS `stud` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name`	VARCHAR ( 100 ) NOT NULL,
	`username`	VARCHAR ( 100 ) NOT NULL UNIQUE,
	`password`	VARCHAR ( 120 ),
	`reg_date`	datetime DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `roles` (
	`roleId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`role`	varchar ( 100 ) NOT NULL,
	`privillage`	INTEGER NOT NULL DEFAULT 0,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `reports` (
	`reportId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`examId`	int ( 11 ) NOT NULL,
	`term`	int ( 11 ) NOT NULL,
	`year`	year ( 4 ) DEFAULT NULL,
	`isItCreated`	enum ( 0 , 1 ) NOT NULL DEFAULT 0,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `performance_records` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`studentId`	int ( 20 ) NOT NULL UNIQUE,
	`marksData`	Text DEFAULT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `marks` (
	`markId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`testId`	int ( 20 ) DEFAULT NULL,
	`examId`	int ( 20 ) NOT NULL,
	`studentId`	int ( 20 ) NOT NULL,
	`markData`	Text DEFAULT NULL,
	`mark`	float NOT NULL DEFAULT 0,
	`outof`	float NOT NULL DEFAULT 100,
	`courseId`	int ( 20 ) NOT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `kcpedetails` (
	`kcpeId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`studentId`	int ( 11 ) NOT NULL,
	`indexNo`	varchar ( 12 ) NOT NULL UNIQUE,
	`kcpeYr`	year ( 4 ) NOT NULL,
	`mat`	int ( 3 ) NOT NULL,
	`eng`	int ( 3 ) NOT NULL,
	`kis`	int ( 3 ) NOT NULL,
	`sci`	int ( 3 ) NOT NULL,
	`sos`	int ( 3 ) NOT NULL,
	`school`	varchar ( 100 ) NOT NULL,
	`type`	varchar ( 100 ) DEFAULT NULL,
	`county`	varchar ( 100 ) DEFAULT NULL,
	`subcounty`	varchar ( 100 ) DEFAULT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `guardians` (
	`guardianId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`studentsId`	text NOT NULL,
	`fName`	varchar ( 100 ) NOT NULL,
	`mName`	varchar ( 100 ) DEFAULT NULL,
	`lName`	varchar ( 100 ) NOT NULL,
	`phone`	varchar ( 15 ) DEFAULT NULL,
	`mail`	varchar ( 15 ) DEFAULT NULL UNIQUE,
	`upi`	varchar ( 15 ) DEFAULT NULL UNIQUE,
	`occupation`	varchar ( 200 ) DEFAULT NULL,
	`religion`	varchar ( 100 ) DEFAULT NULL,
	`relationship`	varchar ( 100 ) DEFAULT NULL,
	`sex`	CHAR ( 1 ) DEFAULT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `forms` (
	`formId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`formName`	varchar ( 100 ) DEFAULT NULL UNIQUE,
	`teacherId`	int ( 11 ) DEFAULT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `exams` (
	`examId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`examName`	varchar ( 200 ) NOT NULL,
	`term`	int ( 11 ) NOT NULL,
	`examType`	char ( 1 ) NOT NULL,
	`isItInternal`	enum ( 0 , 1 ) NOT NULL DEFAULT 1,
	`year`	year ( 4 ) NOT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `designation` (
	`designationId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`desigName`	varchar ( 100 ) NOT NULL,
	`initials`	varchar ( 100 ) DEFAULT NULL,
	`type`	VARCHAR ( 10 ) NOT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `deparments` (
	`departmentId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name`	varchar ( 100 ) NOT NULL UNIQUE,
	`intials`	varchar ( 10 ) DEFAULT NULL,
	`type`	varchar ( 10 ) NOT NULL DEFAULT "edu",
	`hodId`	int ( 11 ) DEFAULT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS `courses` (
	`courseId`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`courseName`	varchar ( 200 ) NOT NULL UNIQUE,
	`form`	int ( 11 ) NOT NULL,
	`subjectId`	int ( 11 ) NOT NULL,
	`teacherId`	int ( 11 ) DEFAULT NULL,
	`students`	TEXT DEFAULT NULL,
	`isDeleted`	enum ( 0 , 1 ) DEFAULT 0,
	`creatorId`	int ( 11 ) DEFAULT NULL,
	`dateCreated`	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`dateUpdated`	datetime DEFAULT NULL,
	`updatorId`	int ( 11 ) DEFAULT NULL
);
COMMIT;
