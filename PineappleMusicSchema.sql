SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema PineappleMusic
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `PineappleMusic` ;

-- -----------------------------------------------------
-- Schema PineappleMusic
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `PineappleMusic` DEFAULT CHARACTER SET utf8 ;
USE `PineappleMusic` ;

-- -----------------------------------------------------
-- Table `PineappleMusic`.`Accounts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PineappleMusic`.`Accounts` ;

CREATE TABLE IF NOT EXISTS `PineappleMusic`.`Accounts` (
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
-- Table `PineappleMusic`.`Artist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PineappleMusic`.`Artist` ;

CREATE TABLE IF NOT EXISTS `PineappleMusic`.`Artist` (
  `acntID` INT NOT NULL,
  `stageName` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NULL,
  PRIMARY KEY (`acntID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PineappleMusic`.`AccountFollowsArtist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PineappleMusic`.`AccountFollowsArtist` ;

CREATE TABLE IF NOT EXISTS `PineappleMusic`.`AccountFollowsArtist` (
  `acntID` INT NOT NULL,
  `artistID` INT NOT NULL,
  PRIMARY KEY (`acntID`, `artistID`),
  INDEX `fk_AccountFollowsArtist_Artist1_idx` (`artistID` ASC)  ,
  CONSTRAINT `fk_AccountFollowsArtist_Accounts`
    FOREIGN KEY (`acntID`)
    REFERENCES `PineappleMusic`.`Accounts` (`accountID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AccountFollowsArtist_Artist1`
    FOREIGN KEY (`artistID`)
    REFERENCES `PineappleMusic`.`Artist` (`acntID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PineappleMusic`.`Songs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PineappleMusic`.`Songs` ;

CREATE TABLE IF NOT EXISTS `PineappleMusic`.`Songs` (
  `songID` INT NOT NULL,
  `filename` VARCHAR(45) NULL,
  PRIMARY KEY (`songID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PineappleMusic`.`SongOwner`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PineappleMusic`.`SongOwner` ;

CREATE TABLE IF NOT EXISTS `PineappleMusic`.`SongOwner` (
  `acntID` INT NOT NULL,
  `sID` INT NOT NULL,
  PRIMARY KEY (`acntID`, `sID`),
  INDEX `fk_SongOwner_Songs1_idx` (`sID` ASC)  ,
  CONSTRAINT `fk_SongOwner_Artist1`
    FOREIGN KEY (`acntID`)
    REFERENCES `PineappleMusic`.`Artist` (`acntID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_SongOwner_Songs1`
    FOREIGN KEY (`sID`)
    REFERENCES `PineappleMusic`.`Songs` (`songID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PineappleMusic`.`Playlist`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PineappleMusic`.`Playlist` ;

CREATE TABLE IF NOT EXISTS `PineappleMusic`.`Playlist` (
  `playlistID` INT NOT NULL,
  `ownerID` INT NULL,
  `name` VARCHAR(45) NULL,
  `album` TINYINT NULL COMMENT 'if playlist is an album, all of the songs in the playlist must be owned by the owner of the playlist',
  `Accounts_accountID` INT NOT NULL,
  PRIMARY KEY (`playlistID`),
  INDEX `fk_Playlist_Accounts1_idx` (`ownerID` ASC)  ,
  CONSTRAINT `fk_Playlist_Accounts1`
    FOREIGN KEY (`ownerID`)
    REFERENCES `PineappleMusic`.`Accounts` (`accountID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `PineappleMusic`.`Playlist_has_Songs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `PineappleMusic`.`Playlist_has_Songs` ;

CREATE TABLE IF NOT EXISTS `PineappleMusic`.`Playlist_has_Songs` (
  `playlistID` INT NOT NULL,
  `songID` INT NOT NULL,
  PRIMARY KEY (`playlistID`, `songID`),
  INDEX `fk_Playlist_has_Songs_Songs1_idx` (`songID` ASC)  ,
  INDEX `fk_Playlist_has_Songs_Playlist1_idx` (`playlistID` ASC)  ,
  CONSTRAINT `fk_Playlist_has_Songs_Playlist1`
    FOREIGN KEY (`playlistID`)
    REFERENCES `PineappleMusic`.`Playlist` (`playlistID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Playlist_has_Songs_Songs1`
    FOREIGN KEY (`songID`)
    REFERENCES `PineappleMusic`.`Songs` (`songID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
