-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: food_rescue_final
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `food_donations`
--

DROP TABLE IF EXISTS `food_donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_donations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_id` int DEFAULT NULL,
  `food_name` varchar(100) NOT NULL,
  `food_type` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `location` varchar(255) NOT NULL,
  `preparation_time` datetime DEFAULT NULL,
  `expiry_time` datetime DEFAULT NULL,
  `food_category` varchar(30) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'Posted',
  `donor_contact` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  CONSTRAINT `food_donations_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_donations`
--

LOCK TABLES `food_donations` WRITE;
/*!40000 ALTER TABLE `food_donations` DISABLE KEYS */;
INSERT INTO `food_donations` VALUES (26,1,'Fried Rice','Non-Vegetarian',50,'Malappuram','2026-10-12 00:00:00','2026-10-13 12:00:00',NULL,'Delivered','9846803521'),(27,1,'Fried Rice','Non-Vegetarian',50,'Malappuram','2026-10-26 00:00:00','2026-10-27 12:00:00',NULL,'Delivered','9835762348'),(28,1,'Loaded fries','Non-Vegetarian',10,'palakkad','2026-10-12 00:00:00','2026-10-13 12:00:00',NULL,'Delivered','7546392341'),(29,1,'Paneer curry','Vegetarian',10,'palakkad','2026-10-20 00:00:00','2026-10-11 12:00:00',NULL,'Delivered','4538298321'),(30,1,'Sadhya','Vegetarian',60,'Thrissur','2026-10-20 00:00:00','2026-10-21 12:00:00',NULL,'Delivered','9836723121'),(31,1,'Chicken biriyani','Non-Vegetarian',40,'Malappuram','2026-10-22 00:00:00','2026-10-23 12:00:00',NULL,'Delivered','9867452343');
/*!40000 ALTER TABLE `food_donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_requests`
--

DROP TABLE IF EXISTS `food_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `donation_id` int NOT NULL,
  `requester_id` int NOT NULL,
  `quantity` int NOT NULL,
  `status` varchar(30) DEFAULT 'Requested',
  `request_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_requests`
--

LOCK TABLES `food_requests` WRITE;
/*!40000 ALTER TABLE `food_requests` DISABLE KEYS */;
INSERT INTO `food_requests` VALUES (1,5,1,5,'Delivered','2026-09-21 09:32:57'),(2,5,1,10,'Delivered','2026-09-21 10:37:56'),(3,5,1,4,'Delivered','2026-09-21 12:34:39'),(4,5,1,8,'Delivered','2026-09-21 12:49:22'),(5,6,1,5,'Delivered','2026-09-21 13:15:46'),(6,7,1,6,'Delivered','2026-09-21 13:25:40'),(7,8,1,6,'Delivered','2026-09-21 13:32:11'),(8,9,1,7,'Delivered','2026-09-21 13:37:49'),(9,10,1,20,'Delivered','2026-09-25 15:22:01'),(10,11,1,6,'Accepted','2026-09-25 16:30:14'),(11,11,1,11,'Picked Up','2026-09-25 16:30:27'),(12,12,1,5,'Delivered','2026-09-25 16:44:55'),(13,18,1,5,'Delivered','2026-09-25 18:50:44'),(14,21,1,6,'Delivered','2026-09-25 23:14:30'),(15,21,1,5,'Delivered','2026-09-26 00:23:27'),(16,21,1,7,'Delivered','2026-09-26 01:22:59'),(17,22,1,10,'Delivered','2026-09-26 01:26:22'),(18,23,1,15,'Accepted','2026-10-02 13:41:18'),(19,26,1,20,'Delivered','2026-10-02 14:53:40'),(20,27,1,20,'Delivered','2026-10-02 14:56:02'),(21,25,1,5,'Requested','2026-10-02 15:03:16'),(22,28,1,5,'Delivered','2026-10-02 15:05:11'),(23,29,1,5,'Delivered','2026-10-02 15:14:17'),(24,29,1,3,'Delivered','2026-10-02 18:19:28'),(25,28,1,4,'Requested','2026-10-02 18:20:05'),(26,29,1,5,'Delivered','2026-10-02 18:43:06'),(27,30,1,20,'Delivered','2026-10-02 19:15:20'),(28,31,1,30,'Delivered','2026-10-02 19:30:43');
/*!40000 ALTER TABLE `food_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','test@example.com','test123','REQUESTER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-03  1:48:09
