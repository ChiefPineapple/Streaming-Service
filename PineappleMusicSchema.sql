SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pineapplemusic
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `pineapplemusic` ;

-- -----------------------------------------------------
-- Schema pineapplemusic
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pineapplemusic` DEFAULT CHARACTER SET utf8 ;
USE `pineapplemusic` ;

-- -----------------------------------------------------
-- Table `pineapplemusic`.`Accounts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pineapplemusic`.`Accounts` ;

CREATE TABLE IF NOT EXISTS `pineapplemusic`.`Accounts` (
  `accountID` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `passwordResetCode` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NULL,
  PRIMARY KEY (`accountID`),
  UNIQUE INDEX `accountID_UNIQUE` (`accountID` ASC)  ,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC)  ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)  )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pineapplemusic`.`Artist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pineapplemusic`.`Artist` ;

CREATE TABLE IF NOT EXISTS `pineapplemusic`.`Artist` (
  `acntID` INT NOT NULL,
  `stageName` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NULL,
  `artistTag` VARCHAR(45) NULL,
  PRIMARY KEY (`acntID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pineapplemusic`.`AccountFollowsArtist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pineapplemusic`.`AccountFollowsArtist` ;

CREATE TABLE IF NOT EXISTS `pineapplemusic`.`AccountFollowsArtist` (
  `acntID` INT NOT NULL,
  `artistID` INT NOT NULL,
  PRIMARY KEY (`acntID`, `artistID`),
  INDEX `fk_AccountFollowsArtist_Artist1_idx` (`artistID` ASC)  ,
  CONSTRAINT `fk_AccountFollowsArtist_Accounts`
    FOREIGN KEY (`acntID`)
    REFERENCES `pineapplemusic`.`Accounts` (`accountID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AccountFollowsArtist_Artist1`
    FOREIGN KEY (`artistID`)
    REFERENCES `pineapplemusic`.`Artist` (`acntID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pineapplemusic`.`Songs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pineapplemusic`.`Songs` ;

CREATE TABLE IF NOT EXISTS `pineapplemusic`.`Songs` (
  `songID` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(45) NULL,
  `songTag` VARCHAR(45) NULL,
  PRIMARY KEY (`songID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pineapplemusic`.`SongOwner`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pineapplemusic`.`SongOwner` ;

CREATE TABLE IF NOT EXISTS `pineapplemusic`.`SongOwner` (
  `acntID` INT NOT NULL,
  `sID` INT NOT NULL,
  PRIMARY KEY (`acntID`, `sID`),
  INDEX `fk_SongOwner_Songs1_idx` (`sID` ASC)  ,
  CONSTRAINT `fk_SongOwner_Artist1`
    FOREIGN KEY (`acntID`)
    REFERENCES `pineapplemusic`.`Artist` (`acntID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_SongOwner_Songs1`
    FOREIGN KEY (`sID`)
    REFERENCES `pineapplemusic`.`Songs` (`songID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pineapplemusic`.`Playlist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pineapplemusic`.`Playlist` ;

CREATE TABLE IF NOT EXISTS `pineapplemusic`.`Playlist` (
  `playlistID` INT NOT NULL AUTO_INCREMENT,
  `ownerID` INT NULL,
  `name` VARCHAR(45) NULL,
  `album` TINYINT NULL COMMENT 'if playlist is an album, all of the songs in the playlist must be owned by the owner of the playlist',
  `playlistTag` VARCHAR(45) NULL,
  PRIMARY KEY (`playlistID`),
  INDEX `fk_Playlist_Accounts1_idx` (`ownerID` ASC)  ,
  CONSTRAINT `fk_Playlist_Accounts1`
    FOREIGN KEY (`ownerID`)
    REFERENCES `pineapplemusic`.`Accounts` (`accountID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pineapplemusic`.`Playlist_has_Songs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pineapplemusic`.`Playlist_has_Songs` ;

CREATE TABLE IF NOT EXISTS `pineapplemusic`.`Playlist_has_Songs` (
  `playlistID` INT NOT NULL,
  `songID` INT NOT NULL,
  PRIMARY KEY (`playlistID`, `songID`),
  INDEX `fk_Playlist_has_Songs_Songs1_idx` (`songID` ASC)  ,
  INDEX `fk_Playlist_has_Songs_Playlist1_idx` (`playlistID` ASC)  ,
  CONSTRAINT `fk_Playlist_has_Songs_Playlist1`
    FOREIGN KEY (`playlistID`)
    REFERENCES `pineapplemusic`.`Playlist` (`playlistID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Playlist_has_Songs_Songs1`
    FOREIGN KEY (`songID`)
    REFERENCES `pineapplemusic`.`Songs` (`songID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
