
const express = require('express');
const app = express();
const db = require('./Database/database');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 8080;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());


// VERIFY LOGIN
var verifyToken = function (req, res, next) {
	// Get auth header value
   	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		// Get token from split array
		// FORMAT OF HEADER: "Authorization: Bearer <access_token>"
		const bearerToken = bearer[1];

		jwt.verify(bearerToken, process.env.SECRET, (err, authData) => {
			if (err) {
				res.sendStatus(403);
			} else {
				console.log(authData); // user email in authData
				next();
			}
		});

	} else {
		res.sendStatus(403); // Forbidden
	}
}

// REGISTER OUR ROUTES
// =============================================================
const userRoutes = require('./Routes/users');
const fileRoutes = require('./Routes/files');

app.use('/users', userRoutes)
app.use('/files', verifyToken, fileRoutes);

// ROUTE TO REACT CLIENT FILES
// =============================================================
if (process.env.NODE_ENV === 'production') {
   console.log("In build mode");

   // Express first tries to serve production assets
   app.use(express.static(path.resolve(__dirname + '/../client/build/')));

   // Express will serve index.html if it doesn't recognize route
   app.get('*', (req, res) => {
      console.log(req.protocol + "://" + req.get('host') + req.originalUrl);
      res.sendFile(path.resolve("server/client", "build", "index.html"));
   });
}


// START THE SERVER
// =============================================================
app.listen(PORT);
console.log('Server running on port ' + PORT);