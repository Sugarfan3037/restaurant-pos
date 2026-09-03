CREATE DATABASE  IF NOT EXISTS `restaurant_pos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurant_pos`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant_pos
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
-- Table structure for table `daily_closing`
--

DROP TABLE IF EXISTS `daily_closing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_closing` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `closing_date` date NOT NULL,
  `total_orders` int NOT NULL DEFAULT '0',
  `total_revenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `cash_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `card_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `other_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `employee_id` bigint NOT NULL,
  `closed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `closing_date` (`closing_date`),
  KEY `fk_daily_closing_employee` (`employee_id`),
  CONSTRAINT `fk_daily_closing_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_closing`
--

LOCK TABLES `daily_closing` WRITE;
/*!40000 ALTER TABLE `daily_closing` DISABLE KEYS */;
INSERT INTO `daily_closing` VALUES (1,'2026-09-03',6,740.00,390.00,350.00,0.00,1,'2026-09-03 14:40:43');
/*!40000 ALTER TABLE `daily_closing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'admin','$2a$10$Lq1.i.EPeSh9RckAGWlZwu1zKvZ6KI77LA/yz4GmJhBF6/pTxlxIq','王店長','ADMIN',1,'2026-08-25 15:40:45','2026-09-03 13:45:51'),(2,'staff01','$2a$10$/jlU6dICH5j.LbTAUChCgeS5G5UCmr6SQVtQV2pNGAUKOauxB1AfC','汪小明','STAFF',1,'2026-08-25 15:40:45','2026-09-03 12:03:06'),(3,'staff02','$2a$10$5GmDlaGGKumPKCy3FFMnzOTsYUmDR5csBpvi6UZowyQotrwwM7W5i','王五','STAFF',1,'2026-09-03 11:57:43','2026-09-03 16:04:41');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_item`
--

DROP TABLE IF EXISTS `menu_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item`
--

LOCK TABLES `menu_item` WRITE;
/*!40000 ALTER TABLE `menu_item` DISABLE KEYS */;
INSERT INTO `menu_item` VALUES (1,'起司蛋餅','FOOD',35.00,1,'起司蛋餅','2026-08-25 15:41:26','2026-08-26 14:43:50'),(2,'卡拉雞腿蛋堡','FOOD',65.00,1,'卡拉雞腿堡(辣/原)','2026-08-25 15:41:26','2026-08-26 14:43:50'),(3,'薯條','FOOD',50.00,1,'炸薯條','2026-08-25 15:41:26','2026-08-26 14:43:50'),(4,'紅茶','DRINK',40.00,1,'錫蘭紅茶','2026-08-25 15:41:26','2026-08-25 15:41:26'),(5,'綠茶','DRINK',40.00,1,'茉香綠茶','2026-08-25 15:41:26','2026-08-25 15:41:26'),(6,'奶茶','DRINK',55.00,1,'鮮奶茶','2026-08-25 15:41:26','2026-08-25 15:41:26'),(9,'雞塊','FOOD',45.00,1,NULL,'2026-09-03 09:46:29','2026-09-03 09:46:29');
/*!40000 ALTER TABLE `menu_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `menu_item_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `sugar_level` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ice_level` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_item_order` (`order_id`),
  KEY `fk_order_item_menu` (`menu_item_id`),
  CONSTRAINT `fk_order_item_menu` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_item` (`id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,1,1,2,150.00,300.00,NULL,NULL,NULL),(2,1,4,1,40.00,40.00,'HALF','LESS',NULL),(5,2,3,1,50.00,50.00,NULL,NULL,NULL),(6,2,4,1,40.00,40.00,'半糖','微冰',NULL),(7,2,2,1,65.00,65.00,NULL,NULL,NULL),(8,3,3,1,50.00,50.00,NULL,NULL,NULL),(9,3,6,1,55.00,55.00,'微糖','正常冰',NULL),(10,3,1,1,35.00,35.00,NULL,NULL,NULL),(11,4,1,1,35.00,35.00,NULL,NULL,NULL),(12,5,1,1,35.00,35.00,NULL,NULL,NULL),(13,5,2,1,65.00,65.00,NULL,NULL,NULL),(14,6,2,1,65.00,65.00,NULL,NULL,NULL),(15,6,1,1,35.00,35.00,NULL,NULL,NULL),(16,8,1,2,35.00,70.00,NULL,NULL,NULL),(17,8,3,2,50.00,100.00,NULL,NULL,NULL),(18,8,4,1,40.00,40.00,'微糖','少冰',NULL),(19,9,2,1,65.00,65.00,NULL,NULL,NULL);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `table_id` bigint NOT NULL,
  `employee_id` bigint NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OPEN',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_table` (`table_id`),
  KEY `fk_orders_employee` (`employee_id`),
  CONSTRAINT `fk_orders_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_orders_table` FOREIGN KEY (`table_id`) REFERENCES `restaurant_table` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,2,'PAID',340.00,'2026-08-25 15:43:50','2026-08-25 15:47:53','2026-08-25 15:47:53'),(2,5,1,'PAID',155.00,'2026-09-03 10:14:59','2026-09-03 11:09:25','2026-09-03 11:09:25'),(3,1,1,'PAID',140.00,'2026-09-03 11:10:18','2026-09-03 11:10:34','2026-09-03 11:10:34'),(4,2,1,'PAID',35.00,'2026-09-03 11:10:46','2026-09-03 11:10:59','2026-09-03 11:10:59'),(5,8,1,'PAID',100.00,'2026-09-03 11:25:15','2026-09-03 11:26:02','2026-09-03 11:26:02'),(6,3,1,'PAID',100.00,'2026-09-03 11:35:03','2026-09-03 11:35:43','2026-09-03 11:35:43'),(7,8,1,'CANCELLED',0.00,'2026-09-03 11:44:43','2026-09-03 11:44:43',NULL),(8,1,1,'PAID',210.00,'2026-09-03 11:45:16','2026-09-03 11:46:10','2026-09-03 11:46:10'),(9,9,1,'PAID',65.00,'2026-09-03 11:51:19','2026-09-03 14:42:24','2026-09-03 14:42:24');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `payment_method` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paid_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `employee_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `fk_payment_employee` (`employee_id`),
  CONSTRAINT `fk_payment_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,'CASH',340.00,'2026-08-25 15:47:35',2),(2,2,'CASH',155.00,'2026-09-03 11:09:25',1),(3,3,'CREDIT_CARD',140.00,'2026-09-03 11:10:34',1),(4,4,'CASH',35.00,'2026-09-03 11:10:59',1),(5,5,'CASH',100.00,'2026-09-03 11:26:02',1),(6,6,'CASH',100.00,'2026-09-03 11:35:43',1),(7,8,'CREDIT_CARD',210.00,'2026-09-03 11:46:10',1),(8,9,'CASH',65.00,'2026-09-03 14:42:24',1);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_table`
--

DROP TABLE IF EXISTS `restaurant_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_table` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `table_number` int NOT NULL,
  `capacity` int NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_number` (`table_number`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_table`
--

LOCK TABLES `restaurant_table` WRITE;
/*!40000 ALTER TABLE `restaurant_table` DISABLE KEYS */;
INSERT INTO `restaurant_table` VALUES (1,1,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(2,2,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(3,3,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:48:07'),(4,4,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(5,5,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(6,6,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(7,7,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(8,8,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(9,9,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(10,10,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(11,11,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(12,12,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(13,13,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(14,14,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(15,15,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(16,16,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(17,17,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(18,18,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(19,19,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22'),(20,20,4,'AVAILABLE','2026-08-25 15:42:22','2026-08-25 15:42:22');
/*!40000 ALTER TABLE `restaurant_table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-03 16:44:31
