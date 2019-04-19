-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: pineapplemusic
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `accountfollowsartist`
--

LOCK TABLES `accountfollowsartist` WRITE;
/*!40000 ALTER TABLE `accountfollowsartist` DISABLE KEYS */;
INSERT INTO `accountfollowsartist` VALUES (1,4);
/*!40000 ALTER TABLE `accountfollowsartist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'alex','alex','6159','amfleming3861@gmail.com',NULL),(2,'neel','neel','5561','neel@email.com',NULL),(3,'david','david','3246','david@email.com',NULL),(4,'trent','trent','1449','trent@email.com',NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `artist`
--

LOCK TABLES `artist` WRITE;
/*!40000 ALTER TABLE `artist` DISABLE KEYS */;
INSERT INTO `artist` VALUES (1,'No Radicals','ATL','rock'),(2,'Ethan and Neelfunkel','LA','rock'),(3,'Motango Bundis','NYC','electronic'),(4,'Nine Inch Nails','ATL','rock');
/*!40000 ALTER TABLE `artist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `playlist`
--

LOCK TABLES `playlist` WRITE;
/*!40000 ALTER TABLE `playlist` DISABLE KEYS */;
INSERT INTO `playlist` VALUES (1,1,'My Library',0,NULL),(2,1,'Let Go',1,'rock'),(3,2,'My Library',0,NULL),(4,2,'The Best of Ethan and Neelfunkel',1,'rock'),(5,3,'My Library',0,NULL),(6,3,'The Slimiest Songs in the South',1,'electronic'),(7,4,'My Library',0,NULL),(8,4,'The Fragile',1,'rock'),(9,4,'Year Zero',1,'rock');
/*!40000 ALTER TABLE `playlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `playlist_has_songs`
--

LOCK TABLES `playlist_has_songs` WRITE;
/*!40000 ALTER TABLE `playlist_has_songs` DISABLE KEYS */;
INSERT INTO `playlist_has_songs` VALUES (2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(4,12),(4,13),(4,14),(4,15),(4,16),(6,17),(6,18),(6,20),(8,21),(8,22),(8,23),(9,24),(9,25),(9,26);
/*!40000 ALTER TABLE `playlist_has_songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `songowner`
--

LOCK TABLES `songowner` WRITE;
/*!40000 ALTER TABLE `songowner` DISABLE KEYS */;
INSERT INTO `songowner` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(2,12),(2,13),(2,14),(2,15),(2,16),(3,17),(3,18),(3,20),(4,21),(4,22),(4,23),(4,24),(4,25),(4,26);
/*!40000 ALTER TABLE `songowner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `songs`
--

LOCK TABLES `songs` WRITE;
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` VALUES (1,'Bassmaster','rock'),(2,'Do Or Die','rock'),(3,'My First Revenge Song','rock'),(4,'Watershed','rock'),(5,'Let Go','rock'),(6,'Walk The Earth','rock'),(7,'Intergude','rock'),(8,'Snow','rock'),(9,'No Sense','rock'),(10,'MFP','rock'),(11,'The Standard','rock'),(12,'I Am a Rock','rock'),(13,'A Hazy Shade of Winter','rock'),(14,'Fakin\' It','rock'),(15,'Cecilia','rock'),(16,'Mrs. Robinson','rock'),(17,'Everyones a Loser','electronic'),(18,'Some Things Comin','electronic'),(20,'Who is She','electronic'),(21,'The Day the Whole World Went Away','rock'),(22,'The Wretched','rock'),(23,'Even Deeper','rock'),(24,'Survivalism','rock'),(25,'God Given','rock'),(26,'Meet Your Master','rock');
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-18 22:42:30
