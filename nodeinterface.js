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
app.use(upload()) 
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	//password : 'Jarolddontdothat1',
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

app.post('/authLogin', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM Accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.userID = results[0].accountID;
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
					var table = '';
					var rows= 5;
					var cols=10;
					for(var r = 0; r < rows; r++){
						table += '<tr>';
						for(var c = 0; c <= cols;c++){
							table += '<td>' + c + '</td>';
						}
						table += '<tr>';
					}
					response.write('<table border=1>' + table + '</table>');

					response.write("<table>");
					response.write("<tr>");
					for(var column in results[0]){
						response.write("<td><label>" + column + "</label></td>");
					}
					response.write("</tr>");
					for(var row in results[row]){
						response.write("<tr>");
						for(var column in results[row]){
							response.write("<td><label>" + results[row][column] + "</label></td>");
						}
						response.write("</tr>");
					}
					response.write("</table>");
					response.end;
				}
				else{
					response.send('not found');
					response.end;
				}});
			} else {
				connection.query('SELECT * FROM Artist WHERE artistTag = ?', [value], function (error, results, fields) {
					response.send(results);
					response.end;
				});
			}
		} else if (searchObject=="song"){
			if(attribute=="title"){
				var sql = "SELECT * FROM Songs WHERE filename = ?";
				connection.query(sql,value, function (error, results, fields) {
					if(results.length>0){
						response.send(results);
					}
					response.end;
				});
			} else {
				connection.query('SELECT * FROM Songs WHERE songTag = ?', [value], function (error, results, fields) {
					response.send(results);
					response.end;
				});
			}
		} else {
			if(attribute=="title"){
				connection.query('SELECT * FROM Playlist WHERE name = ?', [value], function (error, results, fields) {
					response.send(results);
					response.end;
				});
			} else {
				connection.query('SELECT * FROM Playlist WHERE playlistTag = ?', [value], function (error, results, fields) {
					response.send(results);
					response.end;
				});
			}
		}
			
			
	} else {
		response.send('Please login to view this page!');
	}
	//response.end();
});

app.get('/results', function(request,response) {
	response.sendFile(path.join(__dirname + '/results.html'));
});

app.post('/upload', function(request, response) {
	if(request.files){
		var file = request.files.filename,
			filename = file.name;
		file.mv("C:/Users/Alex/eclipse-workspace/PineappleMiddleware/nodeMiddleware/uploads/"+filename,function(err){
			if(err){
				console.log(err)
				response.send("error occured")
			}else{
				response.send("Done!")
			}
		})
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
			response.redirect('/artistHomePage');
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