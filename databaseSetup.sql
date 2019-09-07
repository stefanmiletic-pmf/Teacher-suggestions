-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 07, 2019 at 06:10 PM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nastavnicki_predlozi`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `admins_ibfk_1` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `user_id`) VALUES
(2, 135);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`) VALUES
(4, 'Biologija i ekologija'),
(5, 'Fizika'),
(6, 'Geografija'),
(7, 'Hemija'),
(8, 'Matematika'),
(9, 'Računarske nauke'),
(10, 'Uprava');

-- --------------------------------------------------------

--
-- Table structure for table `feeds`
--

DROP TABLE IF EXISTS `feeds`;
CREATE TABLE IF NOT EXISTS `feeds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `body` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=283 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `feeds`
--

INSERT INTO `feeds` (`id`, `user_id`, `title`, `body`, `createdAt`) VALUES
(264, 160, 'Naslov - predlog 4', 'Predlog 4', '2019-08-10 14:35:24'),
(265, 160, 'Naslov - predlog 5', 'Predlog 5', '2019-08-10 14:36:21'),
(266, 160, 'Naslov - predlog 6', 'Predlog 6', '2019-08-10 14:37:34'),
(267, 160, 'Naslov - predlog 7', 'Predlog 7', '2019-08-10 14:41:38'),
(270, 162, 'Naslov - predlog 8', 'Predlog 8', '2019-08-25 11:43:27'),
(271, 162, 'Naslov - predlog 9', 'Predlog 9', '2019-08-25 11:44:35'),
(272, 162, 'Naslov - predlog 10', 'Predlog 10', '2019-08-25 11:45:18'),
(273, 161, 'Naslov - predlog 11', 'Predlog 11', '2019-08-26 16:15:23'),
(281, 135, 'Novi naslov', 'Novi predlog', '2019-09-07 16:34:55'),
(282, 166, 'Novi naslov', 'Novi predlog', '2019-09-07 17:22:21');

--
-- Triggers `feeds`
--
DROP TRIGGER IF EXISTS `on_feed_created_like`;
DELIMITER $$
CREATE TRIGGER `on_feed_created_like` AFTER INSERT ON `feeds` FOR EACH ROW BEGIN

	INSERT INTO feed_likes(feed_id) VALUES (NEW.id);


END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `feed_likes`
--

DROP TABLE IF EXISTS `feed_likes`;
CREATE TABLE IF NOT EXISTS `feed_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feed_id` int(11) NOT NULL,
  `counter` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `feed_id` (`feed_id`)
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `feed_likes`
--

INSERT INTO `feed_likes` (`id`, `feed_id`, `counter`) VALUES
(242, 264, 0),
(243, 265, 0),
(244, 266, 0),
(245, 267, 0),
(248, 270, 0),
(249, 271, 0),
(250, 272, 2),
(251, 273, 2),
(259, 281, 0),
(260, 282, 0);

-- --------------------------------------------------------

--
-- Table structure for table `feed_likes_user_id`
--

DROP TABLE IF EXISTS `feed_likes_user_id`;
CREATE TABLE IF NOT EXISTS `feed_likes_user_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feed_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `feed_id` (`feed_id`,`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `feed_likes_user_id`
--

INSERT INTO `feed_likes_user_id` (`id`, `feed_id`, `user_id`) VALUES
(18, 272, 135),
(20, 272, 166),
(17, 273, 135),
(19, 273, 166);

--
-- Triggers `feed_likes_user_id`
--
DROP TRIGGER IF EXISTS `on_user_add_like`;
DELIMITER $$
CREATE TRIGGER `on_user_add_like` AFTER INSERT ON `feed_likes_user_id` FOR EACH ROW BEGIN 

	UPDATE `feed_likes`
    SET `feed_likes`.`counter`=`feed_likes`.`counter`+1
    WHERE `feed_likes`.`feed_id` = NEW.`feed_id`;
    
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `on_user_remove_like`;
DELIMITER $$
CREATE TRIGGER `on_user_remove_like` AFTER DELETE ON `feed_likes_user_id` FOR EACH ROW BEGIN 

	UPDATE `feed_likes`
    SET `feed_likes`.`counter`=`feed_likes`.`counter`-1
    WHERE `feed_likes`.`feed_id` = OLD.`feed_id`;
    
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `profile_images`
--

DROP TABLE IF EXISTS `profile_images`;
CREATE TABLE IF NOT EXISTS `profile_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `path` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `profile_images`
--

INSERT INTO `profile_images` (`id`, `user_id`, `path`) VALUES
(30, 160, 'profile_1.png'),
(31, 161, 'profile_2.png'),
(32, 162, 'profile_3.png'),
(33, 163, 'profile_4.png'),
(37, 165, 'profile_5.png'),
(38, 166, 'profile_6.png'),
(56, 135, 'profile_7.png'),
(89, 195, 'profile_8.png');

-- --------------------------------------------------------

--
-- Table structure for table `remembered_logins`
--

DROP TABLE IF EXISTS `remembered_logins`;
CREATE TABLE IF NOT EXISTS `remembered_logins` (
  `token_hash` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`token_hash`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `fullName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_reset_hash` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_reset_expires_at` datetime DEFAULT NULL,
  `activation_hash` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `department_id` int(11) NOT NULL,
  `cabinetName` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`,`password_reset_hash`),
  KEY `faculty_id` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `fullName`, `email`, `password_hash`, `password_reset_hash`, `password_reset_expires_at`, `activation_hash`, `is_active`, `department_id`, `cabinetName`, `createdAt`) VALUES
(135, 'Admin', 'Admin Adminić', 'admin@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 6, 'adminCabinet', '2019-08-08 11:40:22'),
(160, 'Milan', 'Milan Milanović', 'milan@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 6, '12', '2019-08-14 14:24:12'),
(161, 'Snežana', 'Snežana Snežanić', 'snezana@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 8, '13', '2019-08-06 14:43:45'),
(162, 'Bojan', 'Bojan Bojanić', 'bojan@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 8, '111', '2019-08-07 22:00:00'),
(163, 'Marko', 'Marko Marković', 'marko@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 9, '123', '2019-08-26 16:17:40'),
(165, 'Milena', 'Milena Milenović', 'milena@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 7, '111', '2019-08-26 16:18:08'),
(166, 'Mila', 'Mila Milanović', 'mila@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 7, '11', '2019-08-26 16:20:07'),
(195, 'Marija', 'Marija Marijanović', 'marija@pmf.edu', '$2y$10$zTSyJC0/Cz1RMjtDq9tbfe4TqfxgPN0PAqETfqsS7fCCAZIzisnB.', NULL, NULL, NULL, 1, 7, '111', '2019-09-04 11:05:53');

--
-- Triggers `users`
--
DROP TRIGGER IF EXISTS `on_user_deleted`;
DELIMITER $$
CREATE TRIGGER `on_user_deleted` BEFORE DELETE ON `users` FOR EACH ROW BEGIN 

	DELETE from `feed_likes_user_id`
    WHERE `feed_likes_user_id`.`user_id` = OLD.`id`;
    
END
$$
DELIMITER ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `feeds`
--
ALTER TABLE `feeds`
  ADD CONSTRAINT `feeds_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `feed_likes`
--
ALTER TABLE `feed_likes`
  ADD CONSTRAINT `feed_likes_ibfk_1` FOREIGN KEY (`feed_id`) REFERENCES `feeds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `feed_likes_user_id`
--
ALTER TABLE `feed_likes_user_id`
  ADD CONSTRAINT `feed_likes_user_id_ibfk_1` FOREIGN KEY (`feed_id`) REFERENCES `feeds` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `feed_likes_user_id_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `profile_images`
--
ALTER TABLE `profile_images`
  ADD CONSTRAINT `profile_images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `remembered_logins`
--
ALTER TABLE `remembered_logins`
  ADD CONSTRAINT `remembered_logins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
