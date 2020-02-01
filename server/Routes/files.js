const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path');

router.use(bodyParser.json());

router.get('/fetchFiles/:pathname*', (req, res) => {
    var mdDirectory = __dirname + '/../MarkdownFiles/';

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

                    var creationDate = stats.birthtime.toISOString();
                    creationDate = creationDate.substring(8, 10) + '/' + creationDate.substring(5, 7) + '/' + creationDate.substring(2, 4);
                    var modifiedDate = stats.mtime.toISOString();
                    modifiedDate = modifiedDate.substring(8, 10) + '/' + modifiedDate.substring(5, 7) + '/' + modifiedDate.substring(2, 4);


                    var info = {
                        name: files[i],
                        isDirectory: lstats.isDirectory(),
                        creationDate: creationDate,
                        modifiedDate: modifiedDate,
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
        fs.writeFileSync(__dirname + '/../MarkdownFiles/' + req.body.filename + '.md', req.body.newFile, function (err) {
            if (err) { return console.log(err); }
        });
    }
});

// Update an existing file
router.post('/:filename', (req, res) => {
    var filepath = req.body.pathname.replace(/%20/g, ' ');
    if (req.body.updatedFile.trim() != "") {
        var filename = req.originalUrl.split('/').pop().replace(/%20/g, ' ');
        fs.writeFileSync(__dirname + '/../MarkdownFiles/' + filepath, req.body.updatedFile, function (err) {
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