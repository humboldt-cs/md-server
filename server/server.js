
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const PORT = process.env.PORT || 8080;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());


// REGISTER OUR ROUTES
// =============================================================
const fileRoutes = require('./Routes/files');

app.use('/files', fileRoutes);


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