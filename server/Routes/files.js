const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());

function getEmailFromToken(bearerHeader) {
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.SECRET, (err, authData) => {
           return authData.email;
        });
    }
}

router.get('/fetchFiles/:pathname*', (req, res) => {
    var email = undefined;
    var mdDirectory = undefined;

    var bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        var bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.SECRET, (err, authData) => {
           email = authData.email;
        });
    }

    if (email !== undefined) {
        mdDirectory = __dirname + '/../MarkdownFiles/' + email + '/';
    }else{
        //res.sendStatus(403);
        //return null;
    }

    if (req.params.pathname !== "root") {
        // Get index of path after 'fetchFiles'
        var pathIndex = req.originalUrl.indexOf(req.params.pathname.replace(/ /g,'%20'));
        // turn everything after 'fetchFiles' into a file route
        var fileRoute = req.originalUrl.substring(pathIndex).replace(/%20/g, ' ') + '/';
        mdDirectory = mdDirectory + fileRoute;
    }

    if (mdDirectory.substring(mdDirectory.length - 4, mdDirectory.length) === '.md/') {
        res.sendFile(path.resolve(mdDirectory));
    }else{
        var fileArray = [];
    
        fs.readdir(mdDirectory, (err, files) => {
            if (files !== undefined) {
                for (i = 0; i < files.length; i++) {
                    var stats = fs.statSync(mdDirectory + files[i]);
                    var lstats = fs.lstatSync(mdDirectory + files[i]);

                    var info = {
                        name: files[i],
                        isDirectory: lstats.isDirectory(),
                        creationDate: stats.birthtimeMs,
                        modifiedDate: stats.mtimeMs,
                        size: stats.size,
                    }
        
                    fileArray.push(info);
                }
        
                res.send(fileArray);
            }
        });
    }
});

router.post('/new_file', (req, res) => {
    if (req.body.filename.trim() != "" && req.body.newFile.trim() != "") {
        fs.writeFileSync(__dirname + '/../MarkdownFiles/' + req.body.savePath + req.body.filename + '.md', req.body.newFile, function (err) {
            if (err) { return console.log('Could not save new file: ' + err); }
        });
    }
});

// Update an existing file
router.post('/:filename', (req, res) => {
    if (req.body.updatedFile.trim() != "") {
        var filename = req.originalUrl.split('/').pop().replace(/%20/g, ' ');
        fs.writeFileSync(__dirname + '/../MarkdownFiles/' + req.body.pathname, req.body.updatedFile, function (err) {
            if (err) { return console.log(err); }
        });
    }
    res.redirect(req.originalUrl);
});

router.delete('/:pathname*', (req, res) => {
    // Get index of path after 'fetchFiles'
    var pathIndex = req.originalUrl.indexOf(req.params.pathname.replace(/ /g,'%20'));
    // turn everything after 'fetchFiles' into a file route
    var fileRoute = req.originalUrl.substring(pathIndex).replace(/%20/g, ' ');
    fs.unlinkSync(__dirname + '/../MarkdownFiles/' + fileRoute);
});

module.exports = router;