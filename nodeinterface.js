
var mysql = require('mysql');
var express = require('express'),
	app = express(),
	upload = require("express-fileupload");
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var nodemailer = require('nodemailer');
var multer = require('multer');
var fs = require('fs');//to access file system
const querystring = require('querystring');

app.use(upload())
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'pineapplemusic'
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static('public'));

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'pineapplemusicdonotreply@gmail.com',
		pass: 'Softwareeng!neering2019'
	}
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/firstPage.html'));
});

app.get('/first', function(request, response) {
	response.sendFile(path.join(__dirname + '/firstPage.html'));
});

app.get('/homePage', function(request, response) {
	response.sendFile(path.join(__dirname + '/homePage.html'));
});

app.get('/artistProfilePage', function(request, response) {
	response.sendFile(path.join(__dirname + '/artistProfilePage.html'));
});

app.get('/nonArtistProfilePage', function(request, response) {
	response.sendFile(path.join(__dirname + '/nonArtistProfilePage.html'));
});

app.get('/updatingPage', function(request, response) {
	response.sendFile(path.join(__dirname + '/updatingPage.html'));
});

app.get('/createPlaylist', function(request, response) {
	response.sendFile(path.join(__dirname + '/CreatePlaylistPage.html'));
});

app.get('/uploadSong', function(request, response) {
	response.sendFile(path.join(__dirname + '/UploadingPage.html'));
});

app.get('/ForgotPassword', function(request, response) {
	response.sendFile(path.join(__dirname + '/forgotPassword.html'));
});

app.post('/loadCreateAccount', function(request, response) {
	response.sendFile(path.join(__dirname + '/createAccount.html'));
});

app.post('/loadBecomeArtist', function(request, response) {
	response.sendFile(path.join(__dirname + '/becomeArtist.html'));
});

app.get('/uploadPage', function(request,response) {
	response.sendFile(path.join(__dirname + '/uploadPage.html'));
});

app.get('/results', function(request,response) {
	response.sendFile(path.join(__dirname + '/results.html'));
});

app.post('/authLogin', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM Accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.userID = results[0].accountID;
				request.session.selectedSong = "";
				connection.query('SELECT * FROM Artist WHERE acntID = ?', [request.session.userID], function(error, results, fields) {
					if (results.length > 0) {
						request.session.isArtist=true;
					}else{
						request.session.isArtist=false;
					}
					response.send('success');
				});
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			//response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/forgotPassword', function(request,response) {
	connection.query('SELECT passwordResetCode FROM Accounts WHERE email = ?', [request.body.email], function(error, results, fields) {
		if (results.length > 0) {
			request.session.email=request.body.email;
			var mailOptions = {
				from: 'pineapplemusicdonotreply@gmail.com',
				to: request.body.email,
				subject: 'Reset password for Pineapple Music',
				text: 'your reset code is: ' + results[0].passwordResetCode
			};
			
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent succesfully: ' + info.response);
					response.send("email has been sent");
				}
			});
		
		}else{
			response.send("There is no account associated with this email " + request.body.email);
		}
	});
}); 

app.post('/changePassword', function(request, response) {
	connection.query('SELECT * FROM Accounts WHERE email = ? && passwordResetCode = ?', [request.session.email, request.body.prCode], function(error, results, fields) {
		if (results.length>0) {
			connection.query('UPDATE Accounts SET password = ?, passwordResetCode = ? WHERE email = ?', [request.body.password, getRandomInt(1000,9999), request.session.email], function(error, results, fields) {
				response.send("password has been reset, please click back to login");
			});
		} else {
			response.send("password reset code is invalid")
		}
	});
});

app.post('/updateAccount', function(request,response) {
	var username = request.body.username;
	var password = request.body.password;
	var newusername = request.body.newusername;
	var newemail = request.body.newemail;
	var newpassword = request.body.newpassword;
	var email = request.session.email;
	if (username && password && newusername && newpassword && newemail) {
		connection.query('SELECT * FROM Accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				connection.query('UPDATE Accounts SET username= ?, email = ?, password = ? WHERE username=?', [newusername,newemail,newpassword,username], function(error, results, fields) {
					request.session.username = newusername;
					response.send('success');
				});
			} else {
				response.send();
			}			
			//response.end();
		});
	}else{
		response.send('Enter username and password!');
	}
});
// the querys in this post are nested because the output of one query 
app.post('/authCreateAccount', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var verifyPassword = request.body.verifyPassword;
	var email = request.body.email;
	if (username && password && verifyPassword && email) {
		if (password==verifyPassword) {			//these queries are nested because the output of the query determines the input of the next
			connection.query('SELECT * FROM Accounts WHERE username = ?', [username], function(error, results, fields) {
				if (results.length > 0) {
					response.send('Username is taken');
					response.end();
				} else {
					connection.query('SELECT * FROM Accounts WHERE email = ?', [email], function(error, results, fields) {
						if (results.length > 0) {
							response.send('There is already an account associated with this email');
							response.end();
						} else {
							connection.query('INSERT INTO Accounts (username, password, passwordResetCode, email) VALUES (?,?,?,?)', [username, password, getRandomInt(1000, 9999), email], function(error, results, fields) {
								request.session.loggedin = true;
								request.session.username = username;
								request.session.userID = results.insertId;
								request.session.isArtist=false;
								request.session.selectedSong = "";
								connection.query('INSERT INTO Playlist (ownerID, name, album) VALUES (?,?,?)', [request.session.userID, "My Library", 0], function(error, results, fields) {
									console.log(error);
								});
								response.send("success");
							});
						}
					});
				}
			}); 
				
		} else {
			response.send('Passwords do not match');
			response.end();
		}
	} else {
		response.send('Please fill out required fields');
		response.end();
	}
});

app.post('/signOut', function(request, response) {
	
	request.session.regenerate(function(err) {
		console.log(err);  
	});
	
	response.redirect('/first');
});

//these queries still need functionality for the returned values
app.post('/search', function(request, response) {
	if (request.session.loggedin) {
		var searchObject = request.body.searchObject;
		var attribute = request.body.attribute;
		var value = request.body.value;
		if (searchObject=="artist"){
			if(attribute=="title"){
				connection.query('SELECT * FROM Artist WHERE stageName = ?', [value], function (error, results, fields) {
					if(results.length>0){
						console.log(results);
						response.send(results);
					}
					else{
						response.send('not found');
					}
				});
			} else {
				connection.query('SELECT * FROM Artist WHERE artistTag = ?', [value], function (error, results, fields) {
					if(results.length>0){
						response.send(results);
					}
					else{
						response.send('not found');
					}
				});
			}
		} else if (searchObject=="song"){
			if(attribute=="title"){
				connection.query('SELECT * FROM Songs WHERE filename = ?', [value], function (error, results, fields) {
					if(results.length>0){
						response.send(results);
					}
					else{
						response.send('not found');
					}
				});
			} else {
				connection.query('SELECT * FROM Songs WHERE songTag = ?', [value], function (error, results, fields) {
					if(results.length>0){
						response.send(results);
					}
					else{
						response.send('not found');
					}
				});
			}
		} else {
			if(attribute=="title"){
				connection.query('SELECT * FROM Playlist WHERE name = ?', [value], function (error, results, fields) {
					if(results.length>0){
						response.send(results);
					}
					else{
						response.send('not found');
					}
				});
			} else {
				connection.query('SELECT * FROM Playlist WHERE playlistTag = ?', [value], function (error, results, fields) {
					if(results.length>0){
						response.send(results);
					}else{
						response.send('not found');
					}
				});
			}
		}
			
			
	} else {
		response.send('Please login to view this page!');
	}
});

app.post('/resultSelect', function(request, response) {
	console.log(request);
	if(request.body.acntID){
		
		connection.query('INSERT INTO AccountFollowsArtist VALUES (?,?)', [request.session.userID, request.body.acntID], function(error, results, fields) {
			console.log("acntID " + request.body.acntID + " added to " + request.session.userID);
		});
		if (request.session.isArtist==true){
		response.redirect('/artistProfilePage');
		}else{
		response.redirect('/nonArtistProfilePage');
		}
	}
	else if(request.body.songID) {
		connection.query('SELECT * FROM Playlist  WHERE ownerID = ? AND name = ?', [request.session.userID, "My Library"], function(error, results, fields) {
			var pId = results[0].playlistID;
			connection.query('INSERT INTO Playlist_has_Songs VALUES (?,?)', [pId, request.body.songID], function(error,results,fields) {
				console.log(error);
			});
		});
		if (request.session.isArtist==true){
			response.redirect('/artistProfilePage');
		}else{
			response.redirect('/nonArtistProfilePage');
		}
	}else {
		response.send("error");
	}
		
	
	
});

app.post('/getMyLib', function(request, response) {
	//console.log(request);
	connection.query('SELECT s.songID, s.filename, a.stageName FROM Songs as s, Artist as a, songowner as so WHERE s.songID in(SELECT songID FROM Playlist_has_Songs as ps WHERE ps.playlistID = (SELECT playlistID FROM Playlist as p WHERE p.name= "My Library" AND p.ownerID = ?)) AND so.sID = s.songID AND a.acntID = so.acntID;', [request.session.userID], function(error, results, fields) {
		if (error)
			console.log('error 1 displayProfileContent ' + error);
		//var mylib = results;
		console.log(results);
		response.send(results);
	});
});

app.post('/getMyFollows', function(request, response) {
	connection.query('SELECT p.playlistID, s.filename, s.songID, p.name, a.stageName from songs as s, Playlist as p, playlist_has_songs as ps, Artist as a WHERE p.ownerID in(SELECT af.artistID FROM AccountFollowsArtist as af WHERE af.acntID =?) AND a.acntID in(SELECT af.artistID FROM AccountFollowsArtist as af WHERE af.acntID =?) AND p.ownerID = a.acntID AND p.album = 1 AND ps.playlistID = p.playlistID AND ps.songID = s.songID;', [request.session.userID, request.session.userID], function(error, results, fields) {
			
		if (error)
			console.log('error 2 displayProfileContent ' + error);
		if (results.length>0){
			response.send(results);	
		}
	});
});
app.post('/getMyUploads', function(request, response) {
	connection.query('SELECT s.songID, s.filename, p.name FROM Songs as s, Playlist_has_Songs as ps, Playlist as p WHERE p.ownerID = ? AND p.album = 1 AND ps.playlistID = p.playlistID AND s.songID = ps.songId', [request.session.userID], function(error, results, fields) {
		response.send(results);
	});
});

		
app.post('/upload', function(request, response) {
	if(request.files){
		var file = request.files.filename,
			filename = request.body.songName;
		console.log(file);
		var songTag = request.body.songTag;
		var albumTag = request.body.albumTag;
		var albumName=request.body.albumName;
		connection.query('INSERT INTO Songs (filename, songTag) VALUES (?,?)', [filename, songTag], function(error, results, fields) {
			console.log('1 '+ error);
			var insertedSong = results.insertId;
			connection.query('INSERT INTO SongOwner (acntID,sID) VALUES (?,?)', [request.session.userID, insertedSong], function(error, results, fields) {
				console.log('2 '+ error);
			});
			connection.query('SELECT * FROM Playlist WHERE ownerID = ? AND name = ?', [request.session.userID, albumName], function(error, results, fields) {
				if(results.length>0){
					var list = results[0].playlistID;
					connection.query('INSERT INTO Playlist_has_Songs (playlistID,songID) VALUES (?,?)', [list, insertedSong], function(error, results, fields) {
						console.log('3 '+error);
					});
				}
				else{
					connection.query('INSERT INTO Playlist (ownerID,name,album,playlistTag) VALUES (?,?,true,?)',[request.session.userID, albumName,albumTag], function(error, results, fields) {
						var list = results.insertId;
						connection.query('INSERT INTO Playlist_has_Songs (playlistID,songID) VALUES (?,?)', [list, insertedSong],function(error, results, fields){
							console.log('4 '+error);
						});
					});
				}
			});
		});
		var filenamesave = filename.replace(/\s/g,'');
		file.mv(__dirname + '/uploads/'+filenamesave+".mp3",function(err){
			if(err){
				console.log(err)
				response.send("error occured")
			}else{
				response.redirect('/artistProfilePage');
			}
		})
	}
});

app.get('/setSelectedSong', function(request, response) {
	console.log(request);
	request.session.selectedSong = request.body.song;
	response.send(request.session.selectedSong);
});
app.post('/setTitle', function(request, response) {
	var song = request.query.id;
	console.log(request);
	connection.query('SELECT filename FROM Songs WHERE songID =?', [song], function(error, results, fields) {
		response.send(results);
	});
});
app.get('/uploads', function(req,res){
	console.log(req.query.name);
  var encoded = req.query.name;
  
  
  
  const path =  __dirname + '/uploads/' +encoded;
  
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
  
});

app.post('/loadProfile', function(request, response) {
	if (request.session.isArtist==true)
		response.redirect('/artistProfilePage');
	else
		response.redirect('/nonArtistProfilePage');
});

app.post('/becomeArtist', function(request, response) {
	if (request.session.loggedin) {
		connection.query('INSERT INTO Artist VALUES (?,?,?,?)', [request.session.userID, request.body.stageName, request.body.location, request.body.artistTag], function (error, results, fields) {
			request.session.isArtist=true;
			response.redirect('/homePage');
		});
	
	} else {
		response.send('Please login to view this page!');
	}
});
	

//default from tutorial
app.get('/home', function(request, response) { 
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/homePage', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/homePage.html'));
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


//used for generating passwordResetCode in accounts
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


app.listen(3000);