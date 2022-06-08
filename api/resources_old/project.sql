-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2018 at 12:25 AM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `courseId` int(11) NOT NULL,
  `courseName` varchar(200) NOT NULL,
  `form` int(11) NOT NULL,
  `subjectId` int(11) NOT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `studentNo` int(4) DEFAULT '0',
  `creatorId` int(11) DEFAULT NULL,
  `dateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateUpdated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`courseId`, `courseName`, `form`, `subjectId`, `teacherId`, `studentNo`, `creatorId`, `dateCreated`, `dateUpdated`) VALUES
(1, 'biology form1', 1, 1, 1, 0, NULL, '2018-05-08 01:00:12', NULL),
(2, 'biology form2', 2, 1, 0, 0, NULL, '2018-05-08 01:05:16', NULL),
(3, 'biology form3', 3, 1, 0, 0, NULL, '2018-05-08 01:05:30', NULL),
(4, 'biology form4', 4, 1, 0, 0, NULL, '2018-05-08 01:05:43', NULL),
(5, 'mathematics form1', 1, 2, 0, 0, NULL, '2018-05-08 01:05:57', NULL),
(6, 'mathematics form2', 2, 2, 0, 0, NULL, '2018-05-08 01:06:10', NULL),
(7, 'mathematics form3', 3, 2, 0, 0, NULL, '2018-05-08 01:06:22', NULL),
(8, 'mathematics form4', 4, 2, 0, 0, NULL, '2018-05-08 01:07:30', NULL),
(9, 'chemitry form1', 1, 3, 0, 0, NULL, '2018-05-08 01:07:45', NULL),
(10, 'chemitry form2', 2, 3, 0, 0, NULL, '2018-05-08 01:07:57', NULL),
(11, 'chemitry form3', 3, 3, 0, 0, NULL, '2018-05-08 01:08:18', NULL),
(12, 'chemitry form4', 4, 3, 0, 0, NULL, '2018-05-08 01:08:30', NULL),
(13, 'english form1', 1, 4, 0, 0, NULL, '2018-05-08 01:09:00', NULL),
(14, 'english form2', 2, 4, 0, 0, NULL, '2018-05-08 01:09:13', NULL),
(15, 'english form3', 3, 4, 0, 0, NULL, '2018-05-08 01:09:24', NULL),
(16, 'english form4', 4, 4, 0, 0, NULL, '2018-05-08 01:09:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deparments`
--

CREATE TABLE `deparments` (
  `departmentId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `intials` varchar(10) DEFAULT NULL,
  `type` enum('edu','other') NOT NULL DEFAULT 'edu',
  `hodId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `deparments`
--

INSERT INTO `deparments` (`departmentId`, `name`, `intials`, `type`, `hodId`) VALUES
(1, 'languages', 'lan', 'edu', NULL),
(2, 'mathematics', 'mat', 'edu', NULL),
(3, 'sciences', 'sci', 'edu', NULL),
(4, 'humanities', 'hu', 'edu', NULL),
(5, 'technicals', 'tech', 'edu', NULL),
(6, 'guidance and counselling', 'g/c', 'other', NULL),
(7, 'games', 'games', 'other', NULL),
(8, 'desciplinary', NULL, 'other', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `designation`
--

CREATE TABLE `designation` (
  `designationId` int(11) NOT NULL,
  `desigName` varchar(100) NOT NULL,
  `initials` varchar(100) DEFAULT NULL,
  `type` enum('tr','st') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `designation`
--

INSERT INTO `designation` (`designationId`, `desigName`, `initials`, `type`) VALUES
(1, 'principal', 'p', 'tr'),
(2, 'deputy principal', 'd/p', 'tr'),
(3, 'head of department', 'hod', 'tr'),
(4, 'senior teacher', 'sr', 'tr'),
(5, 'teacher', 'tr', 'tr'),
(6, 'prefect', 'pre', 'st'),
(7, 'games captain', 'cap', 'st'),
(8, 'head boy', 'hb', 'st'),
(9, 'head girl', 'hg', 'st'),
(10, 'bell ringer', 'ringer', 'st'),
(11, 'dining hall captain', 'db cap', 'st'),
(12, 'class monitor', 'monitor', 'st'),
(13, 'student', '', 'st'),
(14, 'blackboard cleaner', NULL, 'st');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `examId` int(11) NOT NULL,
  `examName` varchar(200) NOT NULL,
  `dateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `term` int(11) NOT NULL,
  `examType` set('o','m','e') NOT NULL,
  `status` enum('done','not') DEFAULT 'not',
  `nature` enum('internal','external') NOT NULL DEFAULT 'internal',
  `year` year(4) NOT NULL,
  `creatorId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`examId`, `examName`, `dateCreated`, `term`, `examType`, `status`, `nature`, `year`, `creatorId`) VALUES
(1, 'opener term two exam 2014', '2018-05-06 06:00:54', 2, 'o', 'done', 'internal', 2014, NULL),
(2, 'mid term term two exam 2015', '2018-05-06 06:13:33', 2, 'm', 'done', 'internal', 2015, NULL),
(3, 'opener  term one  exam 2017', '2018-05-08 19:02:36', 1, 'o', 'done', 'internal', 2017, NULL),
(4, 'mid of  term one  exam 2017', '2018-05-08 19:03:03', 1, 'm', 'done', 'internal', 2017, NULL),
(5, 'end of  term one  exam 2017', '2018-05-08 19:03:22', 1, 'e', 'done', 'internal', 2017, NULL),
(6, 'mid of term two exam 2014', '2018-05-08 19:04:10', 2, 'm', 'done', 'internal', 2014, NULL),
(7, 'end of term two exam 2014', '2018-05-08 19:04:29', 2, 'e', 'done', 'internal', 2014, NULL),
(8, 'opener term two exam 2015', '2018-05-08 19:05:02', 2, 'o', 'done', 'internal', 2015, NULL),
(9, 'end of term two exam 2015', '2018-05-08 19:05:19', 2, 'e', 'done', 'internal', 2015, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

CREATE TABLE `forms` (
  `formId` int(11) NOT NULL,
  `form` int(2) NOT NULL,
  `formName` varchar(100) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `forms`
--

INSERT INTO `forms` (`formId`, `form`, `formName`, `teacherId`) VALUES
(1, 1, 'Form One', NULL),
(2, 2, 'Form Two', NULL),
(3, 3, 'Form Three', NULL),
(4, 4, 'Form Four', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `guardians`
--

CREATE TABLE `guardians` (
  `guardianId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `fName` varchar(100) NOT NULL,
  `mName` varchar(100) DEFAULT NULL,
  `lName` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `occupation` varchar(200) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `relation` varchar(100) DEFAULT NULL,
  `sex` enum('m','f') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kcpedetails`
--

CREATE TABLE `kcpedetails` (
  `kcpeId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `indexNo` varchar(12) NOT NULL,
  `kcpeYr` year(4) NOT NULL,
  `mat` int(3) NOT NULL,
  `eng` int(3) NOT NULL,
  `kis` int(3) NOT NULL,
  `sci` int(3) NOT NULL,
  `sos` int(3) NOT NULL,
  `priSch` varchar(100) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `county` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `markId` int(20) NOT NULL,
  `testId` int(20) NOT NULL,
  `examId` int(20) NOT NULL,
  `studentId` int(20) NOT NULL,
  `mark` float NOT NULL,
  `outof` float NOT NULL,
  `courseId` int(20) NOT NULL,
  `dateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateUpdated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `reportId` int(11) NOT NULL,
  `examId` int(11) NOT NULL,
  `term` int(11) NOT NULL,
  `year` year(4) DEFAULT NULL,
  `dateCreated` date DEFAULT NULL,
  `status` enum('created','not') NOT NULL DEFAULT 'not'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleId` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  `privillage` set('0','1','2','3','4') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleId`, `role`, `privillage`) VALUES
(1, 'developer', '4'),
(2, 'user', '0'),
(3, 'secretary', '1'),
(4, 'accountant', '1'),
(5, 'admin', '3'),
(6, 'student', '0'),
(7, 'teacher', '1');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `studentId` int(11) UNSIGNED NOT NULL,
  `fName` varchar(100) NOT NULL,
  `mName` varchar(100) DEFAULT NULL,
  `lName` varchar(100) NOT NULL,
  `dob` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sex` enum('m','f') NOT NULL,
  `relogion` varchar(100) DEFAULT NULL,
  `county` varchar(150) DEFAULT NULL,
  `subcounty` varchar(150) DEFAULT NULL,
  `doa` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admNo` varchar(11) DEFAULT NULL,
  `formId` int(11) DEFAULT NULL,
  `upi` varchar(7) DEFAULT NULL,
  `club` int(11) DEFAULT NULL,
  `designationId` int(11) DEFAULT '13',
  `constituency` varchar(200) DEFAULT NULL,
  `residence` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`studentId`, `fName`, `mName`, `lName`, `dob`, `sex`, `relogion`, `county`, `subcounty`, `doa`, `admNo`, `formId`, `upi`, `club`, `designationId`, `constituency`, `residence`) VALUES
(1, 'abdalla', 'mangale', 'mwero', '1989-07-14 00:00:00', 'm', NULL, NULL, NULL, '2018-04-21 02:49:16', '1', 4, NULL, NULL, 13, NULL, NULL),
(2, 'abdalla1', 'mangale1', 'mwero1', '1989-07-14 00:00:00', 'm', NULL, NULL, NULL, '2018-04-21 02:57:14', '2', 4, NULL, NULL, 13, NULL, NULL),
(22, 'rgtfghfgh', 'gfh', 'vghfhgf', '2018-05-02 00:00:00', 'm', NULL, NULL, NULL, '2018-05-03 09:50:22', '3', 1, NULL, NULL, 13, NULL, NULL),
(23, 'jgkdhklj', 'njdjkfnlkbvj', 'jncvklbjdflbkj', '2018-05-10 00:00:00', 'm', NULL, NULL, NULL, '2018-05-04 11:51:27', '4', 3, NULL, NULL, 13, NULL, NULL),
(24, ',kmjl;gnmgf', 'mbfnmkl', ',lmbf,.nl;f', '2018-05-16 00:00:00', 'm', NULL, NULL, NULL, '2018-05-04 11:51:44', '5', 3, NULL, NULL, 13, NULL, NULL),
(25, 'l,mhglm,', 'l;,km;hl;', 'bjjhj', '2018-05-17 00:00:00', 'f', NULL, NULL, NULL, '2018-05-04 11:52:01', '6', 4, NULL, NULL, 13, NULL, NULL),
(26, 'john', 'dewi', 'doe', '1990-11-30 00:00:00', 'f', NULL, NULL, NULL, '2018-05-09 12:03:27', '7', 2, NULL, NULL, 13, NULL, NULL),
(27, 'saum', 'mlongo', 'mwero', '2015-07-11 00:00:00', 'm', NULL, NULL, NULL, '2018-05-11 19:38:00', '8', 1, NULL, NULL, 13, NULL, NULL),
(28, 'juma', 'omar', 'chidudu', '2017-04-15 00:00:00', 'm', NULL, NULL, NULL, '2018-05-16 00:23:05', '9', 2, NULL, NULL, 13, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subjectId` int(11) NOT NULL,
  `subjectName` varchar(100) NOT NULL,
  `intitals` varchar(10) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `status` enum('a','p') NOT NULL DEFAULT 'a',
  `link` int(1) NOT NULL DEFAULT '1',
  `dateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateUpdated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subjectId`, `subjectName`, `intitals`, `departmentId`, `status`, `link`, `dateCreated`, `dateUpdated`) VALUES
(1, 'biology', 'bio', 3, 'a', 1, '2018-05-07 21:10:37', NULL),
(2, 'mathematics', 'mat', 2, 'a', 1, '2018-05-07 21:10:37', NULL),
(3, 'chemitry', 'che', 3, 'a', 1, '2018-05-07 21:10:37', NULL),
(4, 'english', 'eng', 1, 'a', 1, '2018-05-07 21:10:37', NULL),
(5, 'physics', 'phy', 3, 'a', 1, '2018-05-07 21:10:37', NULL),
(6, 'kiswahili', 'kisw', 1, 'a', 1, '2018-05-07 21:10:37', NULL),
(7, 'geography', 'geo', 4, 'a', 1, '2018-05-07 21:10:37', NULL),
(8, 'history and government', 'his', 4, 'a', 1, '2018-05-07 21:10:37', NULL),
(9, 'christian religious education', 'cre', 4, 'a', 1, '2018-05-07 21:10:37', NULL),
(10, 'business studies education', 'bed', 5, 'a', 1, '2018-05-07 21:10:37', NULL),
(11, 'agriculture', 'agr', 5, 'a', 1, '2018-05-07 21:10:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `teacherId` int(11) NOT NULL,
  `upi` varchar(7) DEFAULT NULL,
  `fName` varchar(100) NOT NULL,
  `mName` varchar(100) NOT NULL,
  `lName` varchar(100) NOT NULL,
  `initials` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `sex` enum('f','m') NOT NULL,
  `marital` enum('m','s') NOT NULL DEFAULT 's',
  `type` enum('bom','tsc','tp') NOT NULL DEFAULT 'bom',
  `county` varchar(100) DEFAULT NULL,
  `subcounty` varchar(100) DEFAULT NULL,
  `dateJoin` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('a','p') NOT NULL DEFAULT 'p',
  `phone` varchar(15) DEFAULT NULL,
  `idNo` int(20) NOT NULL,
  `link` int(1) DEFAULT '1',
  `dateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateUpdated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`teacherId`, `upi`, `fName`, `mName`, `lName`, `initials`, `dob`, `sex`, `marital`, `type`, `county`, `subcounty`, `dateJoin`, `status`, `phone`, `idNo`, `link`, `dateCreated`, `dateUpdated`) VALUES
(1, NULL, 'mimi', 'wewe', 'yule', 'mwy', '2018-05-15', 'm', 's', 'bom', NULL, NULL, '2018-05-04 15:01:03', 'p', '255', 255, 1, '2018-05-07 21:08:38', NULL),
(2, NULL, 'abdalla', 'mangale', 'mwero', NULL, '2018-12-31', 'm', 'm', 'bom', NULL, NULL, '2018-05-04 15:12:40', 'p', '0701687982', 28981100, 1, '2018-05-07 21:08:38', NULL),
(3, NULL, 'mtu', 'wangu', 'wenu', 'MWW', '2017-11-30', 'f', 's', 'tp', NULL, NULL, '2018-05-05 18:11:47', 'p', '2123454', 255465, 1, '2018-05-07 21:08:38', NULL),
(4, NULL, 'yule', 'pale', 'kwao', 'YPK', '2017-12-31', 'm', 's', 'tsc', NULL, NULL, '2018-05-05 18:12:37', 'p', '31', 28, 1, '2018-05-07 21:08:38', NULL),
(5, NULL, 'mimi', 'wewe', 'wao', 'MWW', '2018-12-31', 'm', 's', 'tp', NULL, NULL, '2018-05-07 17:58:28', 'p', '212121', 7632323, 1, '2018-05-07 21:08:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `terms`
--

CREATE TABLE `terms` (
  `termId` int(11) NOT NULL,
  `term` set('1','2','3') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `testId` int(20) NOT NULL,
  `examId` int(20) NOT NULL,
  `courseId` int(20) NOT NULL,
  `testDate` date DEFAULT NULL,
  `supervisorId` int(20) DEFAULT NULL,
  `status` enum('done','not') NOT NULL DEFAULT 'not'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `role` set('admin','developer','accountant','teacher','student','secretary','user') NOT NULL DEFAULT 'user',
  `password` varchar(150) NOT NULL,
  `date_reg` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('1','0') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `username`, `role`, `password`, `date_reg`, `status`) VALUES
(2, 'user', 'user', 'user', '2018-04-18 19:23:18', '0'),
(3, 'mdroaer', 'developer', 'dev', '2018-04-21 03:20:15', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`courseId`);

--
-- Indexes for table `deparments`
--
ALTER TABLE `deparments`
  ADD PRIMARY KEY (`departmentId`);

--
-- Indexes for table `designation`
--
ALTER TABLE `designation`
  ADD PRIMARY KEY (`designationId`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`examId`);

--
-- Indexes for table `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`formId`);

--
-- Indexes for table `kcpedetails`
--
ALTER TABLE `kcpedetails`
  ADD PRIMARY KEY (`kcpeId`),
  ADD UNIQUE KEY `studentId` (`studentId`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`markId`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`reportId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`studentId`),
  ADD UNIQUE KEY `adm_no` (`admNo`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subjectId`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`teacherId`),
  ADD UNIQUE KEY `idNo` (`idNo`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`testId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `deparments`
--
ALTER TABLE `deparments`
  MODIFY `departmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `designation`
--
ALTER TABLE `designation`
  MODIFY `designationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `examId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `formId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kcpedetails`
--
ALTER TABLE `kcpedetails`
  MODIFY `kcpeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marks`
--
ALTER TABLE `marks`
  MODIFY `markId` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `reportId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `studentId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subjectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `teacherId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `testId` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
