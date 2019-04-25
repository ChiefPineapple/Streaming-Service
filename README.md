# Pineapple Music
This application designed to run for all systems, but have only been tested on Windows and Raspbian. Use with windows is recommended.
# REQUIREMENTS
Node.js:
  https://nodejs.org/en/download/
MySQL:
  MySQL Community Server 8.0.15 https://dev.mysql.com/downloads/mysql/
  MySQL Connector/ODBC 8.0.15 https://dev.mysql.com/downloads/connector/odbc/ (this is the one i couldnt get installed on mac. Troubleshooting says you need the previous version of 5.3.12, but that wouldnt install either)
  MySQL Connector/Node.js 8.0.15 https://dev.mysql.com/downloads/connector/nodejs/
  MySQL Workbench 8.0.15 https://dev.mysql.com/downloads/workbench/ (I know you didnt want us to instruct you to use an IDE, but we ran out of time to make a build script for the whole system)
#INSTALLATION 
  Run the PineappleMusicSchema.sql file in MySQL Workbench
  Run the Dump20190418.sql file in MySQL Workbench (you can omit this step if you like but there will be no songs in the application)
!!Please edit the information on line 15 of the nodeinterface.js file to match the login for your local MySQL Server Instance. (I would have liked to implement this through command line arguments but we ran out of time)
  Go to the file where this package is installed on your command line
  Type $ npm install
  this installs dependencies 
  Type $ node nodeinterface.js
  go to http://localhost:3000/ in your web browser
  
#MODULES
	The uploads file comes with .mp3 files to initially populate the database. THE Dump20190418.sql FILE MUST BE RUN FOR THESE SONGS TO BE RECOGNIZED.
		once new songs are uploaded by users, this is were those audio files are stored

	nodeinterface.js contains all communication between front and back-end services.
	
	package.json contains a list of dependencies used in this application
	
	node_modules contains installed dependencies, these should contain required dependencies listed in the package.json file after the 'npm install' command has been issued

	PineappleMusicSchema.sql is the build script for the database schema
	
	Dump20190418.sql contains data to populate the database initially to demonstrate how the application runs in normal working conditions with active users and their data
