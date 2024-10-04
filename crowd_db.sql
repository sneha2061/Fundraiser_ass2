-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: crowd_db
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `CATEGORY_ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `DESCRIPTION` text,
  PRIMARY KEY (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Medical','Fundraisers to help with medical treatments and recovery.'),(2,'Education','Fundraisers to help for educational expenses.'),(3,'Crisis Relief','Fundraisers to help people in times of crisis.'),(4,'Social Impact','Fundraisers for social impact initiatives.'),(5,'Sports enhancement','Fundraisers for uplifting sports initiatives.');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation`
--

DROP TABLE IF EXISTS `donation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation` (
  `DONATION_ID` int NOT NULL AUTO_INCREMENT,
  `DONOR_NAME` varchar(100) NOT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `FUNDRAISER_ID` int DEFAULT NULL,
  `DONATION_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`DONATION_ID`),
  KEY `fk_fundraiser` (`FUNDRAISER_ID`),
  CONSTRAINT `fk_fundraiser` FOREIGN KEY (`FUNDRAISER_ID`) REFERENCES `fundraiser` (`FUNDRAISER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation`
--

LOCK TABLES `donation` WRITE;
/*!40000 ALTER TABLE `donation` DISABLE KEYS */;
INSERT INTO `donation` VALUES (1,'Alice Rozema',100.00,1,'2024-09-22 08:13:46'),(2,'Bob West',250.00,3,'2024-09-22 08:13:46'),(3,'Jane Dipika Garret',50.00,2,'2024-09-22 08:13:46'),(4,'Prince Dahal',300.00,4,'2024-09-22 08:13:46'),(5,'Sandhya Chapagain',500.00,5,'2024-09-22 08:13:46');
/*!40000 ALTER TABLE `donation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fundraiser`
--

DROP TABLE IF EXISTS `fundraiser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fundraiser` (
  `FUNDRAISER_ID` int NOT NULL AUTO_INCREMENT,
  `ORGANIZER` varchar(100) NOT NULL,
  `CAPTION` varchar(255) NOT NULL,
  `DESCRIPTION` text,
  `TARGET_FUNDING` decimal(10,2) NOT NULL,
  `CURRENT_FUNDING` decimal(10,2) DEFAULT '0.00',
  `CITY` varchar(100) DEFAULT NULL,
  `ACTIVE` tinyint(1) DEFAULT '1',
  `CATEGORY_ID` int DEFAULT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`FUNDRAISER_ID`),
  KEY `idx_fundraiser_city` (`CITY`),
  KEY `idx_fundraiser_category` (`CATEGORY_ID`),
  CONSTRAINT `fk_category` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `category` (`CATEGORY_ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fundraiser`
--

LOCK TABLES `fundraiser` WRITE;
/*!40000 ALTER TABLE `fundraiser` DISABLE KEYS */;
INSERT INTO `fundraiser` VALUES (1,'Sami Nepal','Help Bina (my mom) fight cancer','Raising money for Bina\'s medical treatment',5000.00,1200.00,'Texas',1,1,'2024-09-22 08:13:46','2024-09-25 09:39:30','Medical'),(2,'Sarah Smith','Support Sarah\'s education','Fundraiser for tuition fees for Sarah\'s higher education',10000.00,3001.00,'Melbourne',0,2,'2024-09-22 08:13:46','2024-09-25 09:39:30','Education'),(3,'Byron Community Centre','Flood Relief for Byron Bay','Help rebuild the community after severe flooding',25000.00,15059.00,'Byron Bay',1,3,'2024-09-22 08:13:46','2024-09-25 09:39:30','Crisis Relief'),(4,'Wooh-man','Empower Women Through Education','Providing education and resources to underprivileged women',20000.00,21000.00,'Brisbane',0,2,'2024-09-22 08:13:46','2024-10-02 04:47:21','Education'),(5,'SOS Bhaktapur','Crisis Relief in Jumla','Providing aid to children in the crisis zones in Jumla, Nepal.',50000.00,20000.00,'Bhaktapur',1,3,'2024-09-22 08:13:46','2024-09-25 09:39:30','Crisis Relief'),(6,'NRNA','FIND MAMTA KAFLE','Raising money to find a missing nepali mother',50000.00,14010.00,'Virginia',1,4,'2024-09-22 11:09:12','2024-10-02 04:48:40','Social Impact'),(7,'Carmella saini','Help me fight cancer','Raising money so that I can afford my chemo and treatments.',60000.00,20000.00,'Brisbane',0,1,'2024-10-02 05:47:48','2024-10-02 05:47:48',NULL),(8,'Saira Gonzalez','Support Kiara\'s Education','Help me with funds so that i can educate a homeless girl.',25000.00,5000.00,'Melbourne',0,2,'2024-10-02 05:47:48','2024-10-02 05:47:48',NULL),(9,'Shanon Grey','Find Himani, a single mom.','Fundraiser to conduct searches and help little himani.',30000.00,7000.00,'Sydney',1,4,'2024-10-02 05:47:48','2024-10-02 05:47:48',NULL),(10,'Routine of Nepal Banda','Flood and landslide relief for Nepal','Help rebuild the roads and houses of people that are affected by flood and landslide in different places of Nepal.',60000.00,10000.00,'Kathmandu',1,3,'2024-10-02 05:47:48','2024-10-02 05:47:48',NULL),(11,'Sagar Malla','Lets uplift young cricketers ','Help me train and improve all the potential young cricketers in villages.',15000.00,900.00,'Dhangadhi',1,5,'2024-10-02 05:47:48','2024-10-02 05:48:58',NULL);
/*!40000 ALTER TABLE `fundraiser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_fundraiser_progress`
--

DROP TABLE IF EXISTS `view_fundraiser_progress`;
/*!50001 DROP VIEW IF EXISTS `view_fundraiser_progress`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_fundraiser_progress` AS SELECT 
 1 AS `FUNDRAISER_ID`,
 1 AS `ORGANIZER`,
 1 AS `CAPTION`,
 1 AS `TARGET_FUNDING`,
 1 AS `CURRENT_FUNDING`,
 1 AS `progress_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_fundraiser_progress`
--

/*!50001 DROP VIEW IF EXISTS `view_fundraiser_progress`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_fundraiser_progress` AS select `fundraiser`.`FUNDRAISER_ID` AS `FUNDRAISER_ID`,`fundraiser`.`ORGANIZER` AS `ORGANIZER`,`fundraiser`.`CAPTION` AS `CAPTION`,`fundraiser`.`TARGET_FUNDING` AS `TARGET_FUNDING`,`fundraiser`.`CURRENT_FUNDING` AS `CURRENT_FUNDING`,((`fundraiser`.`CURRENT_FUNDING` / `fundraiser`.`TARGET_FUNDING`) * 100) AS `progress_percentage` from `fundraiser` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-04 17:30:04
