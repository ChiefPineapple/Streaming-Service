var mysql = require('mysql');//for creating the mysql connection to send querys
var express = require('express');//not sure how this is different from express-session but w3schools is gospel
var session = require('express-session');//for session things to happen, like session.variables
var bodyParser = require('body-parser'); //for parsing the forms 
var path = require('path');//i think this is so the calls to other pages work
var nodemailer = require('nodemailer');//for sending an email in the forgotPassword post
var multer = require('multer');//not sure what this does but its needed to make the forms that are in an httpRequest work
var fs = require('fs');//to access file system
var formidable = require('formidable');//for file uploads so we can upload .mp3
var upload = multer();

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'pineapplemusic'
});

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
//app.use(bodyParser.json());
//this is the thing im referring to in the upload post. 
//commenting it out may have broken something that i havent stumbled upon yet
//i thought it was needed to read the forms

app.use(upload.array()); 
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
	response.sendFile(path.join(__dirname + '/CreateAccount.html'));
});

app.post('/loadBecomeArtist', function(request, response) {
	response.sendFile(path.join(__dirname + '/becomeArtist.html'));
});

app.post('/authLogin', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.userID = results[0].accountID;
				connection.query('SELECT * FROM artist WHERE acntID = ?', [request.session.userID], function(error, results, fields) {
					if (results.length > 0) {
						request.session.isArtist = true;
					}else{
						request.session.isArtist = false;
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
	connection.query('SELECT passwordResetCode FROM accounts WHERE email = ?', [request.body.email], function(error, results, fields) {
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
	connection.query('SELECT * FROM accounts WHERE email = ? && passwordResetCode = ?', [request.session.email, request.body.prCode], function(error, results, fields) {
		if (results.length>0) {
			connection.query('UPDATE accounts SET password = ?, passwordResetCode = ? WHERE email = ?', [request.body.password, getRandomInt(1000,9999), request.session.email], function(error, results, fields) {
				response.send("password has been reset, please click back to login");
			});
		} else {
			response.send("password reset code is invalid")
		}
	});
});
app.post('/authCreateAccount', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var verifyPassword = request.body.verifyPassword;
	var email = request.body.email;
	if (username && password && verifyPassword && email) {
		if (password==verifyPassword) {			//these queries are nested because the output of the query determines the input of the next
			connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
				if (results.length > 0) {
					response.send('Username is taken');
					//response.end();
				} else {
					connection.query('SELECT * FROM accounts WHERE email = ?', [email], function(error, results, fields) {
						if (results.length > 0) {
							response.send('There is already an account associated with this email');
							//response.end();
						} else {
							connection.query('INSERT INTO accounts (username, password, passwordResetCode, email) VALUES (?,?,?,?)', [username, password, getRandomInt(1000, 9999), email], function(error, results, fields) {
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
			//response.end();
		}
	} else {
		response.send('Please fill out required fields');
		//response.end();
	}
});

app.post('/signOut', function(request, response) {
	
	request.session.regenerate(function(err) {
		console.log(err);  
	});
	
	response.redirect('/first');
});

app.post('/upload', upload.single('songFile'), function(request, response) {
	
	var form  = new formidable.IncomingForm();
	//the program was skipping right over .parse until i commented line 26 .bodyparser.
	//the file is now coming through as [] instead of [null,null], idk the significance of that lol, jah help us!
	form.parse(request); //, function(err, fields, files) {
	/*	var oldpath = files.songFile.path;
		var newpath = 'C:/Users/Alex/eclipse-workspace/PineappleMiddleware/nodeMiddleware/uploads/' + files.songFile.name;
		console.log(err);
		console.log("fields");
		console.log(fields);
		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
			response.write('File uploaded and moved!');
			response.end();
        });
	});
	*/
	form.on('fileBegin', function (name, file){
        file.path = "C:/Users/Alex/eclipse-workspace/PineappleMiddleware/nodeMiddleware/uploads/" + file.name;
		//obviously change this to match your file path. 
		//i changed around properties of the uploads file to allow access to everyone but i think the problem lies somewhere with the file not being  sent with the form.
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });
	response.send(form);
});
//these queries still need functionality for the returned values
app.post('/search', function(request, response) {
	if (request.session.loggedin) {
		var searchObject = request.body.searchObject;
		var attribute = request.body.attribute;
		var value = request.body.value;
		if (searchObject=="artist"){
			if(attribute=="title"){
				connection.query('SELECT * FROM artist WHERE stageName = ?', [value], function (error, results, fields) {
					response.send(results);
					//response.end;
				});
			} else {
				connection.query('SELECT * FROM artist WHERE artistTag = ?', [value], function (error, results, fields) {
					response.send(results);
					response.end;
				});
			}
		} else if (searchObject=="song"){
			if(attribute=="title"){
				connection.query('SELECT * FROM songs WHERE filename = ?', [value], function (error, results, fields) {
					if(results.length>0){
						response.send("found it");
					}
					response.end;
				});
			} else {
				connection.query('SELECT * FROM songs WHERE songTag = ?', [value], function (error, results, fields) {
					response.send(results);
					response.end;
				});
			}
		} else {
			if(attribute=="title"){
				connection.query('SELECT * FROM playlist WHERE name = ?', [value], function (error, results, fields) {
					response.send(results);
					response.end;
				});
			} else {
				connection.query('SELECT * FROM playlist WHERE playlistTag = ?', [value], function (error, results, fields) {
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

app.post('/loadProfile', function(request, response) {
	if (request.session.isArtist==true)
		response.redirect('/artistProfilePage');
	else
		response.redirect('/nonArtistProfilePage');
});

app.post('/becomeArtist', function(request, response) {
	if (request.session.loggedin) {
		connection.query('INSERT INTO artist VALUES (?,?,?,?)', [request.session.userID, request.body.stageName, request.body.location, request.body.artistTag], function (error, results, fields) {
			request.session.isArtist=true;
			response.redirect('/artistProfilePage');
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