const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path');

router.use(bodyParser.json());

router.get('/fetchNames', (req, res) => {
    const mdDirectory = __dirname + '/../MarkdownFiles/';

    var fileArray = [];
    
    fs.readdir(mdDirectory, (err, files) => {
        
        for (i = 0; i < files.length; i++) {
            var stats = fs.statSync(mdDirectory + files[i]);
            var lstats = fs.lstatSync(mdDirectory + files[i]);

            var info = {
                name: files[i],
                isDirectory: lstats.isDirectory(),
                creationDate: stats.birthtime,
                modifiedDate: stats.mtime,
                size: stats.size,
            }

            fileArray.push(info);
        }

        res.send(fileArray);
    });
});

router.get('/:filename', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../MarkdownFiles/' + req.params.filename + '.md'));
});

router.post('/new_file', (req, res) => {
    if (req.body.filename.trim() != "" && req.body.newFile.trim() != "") {
        fs.writeFileSync(__dirname + '/../MarkdownFiles/' + req.body.filename + '.md', req.body.newFile, function (err) {
            if (err) { return console.log(err); }
        });
    }
});

router.post('/:filename', (req, res) => {
    if (req.body.updatedFile.trim(7) != "") {
        var filename = req.originalUrl.slice(7) + '.md';
        fs.writeFileSync(__dirname + '/../MarkdownFiles/' + filename, req.body.updatedFile, function (err) {
            if (err) { return console.log(err); }
        });
    }
    res.redirect(req.originalUrl);
});

router.delete('/:filename', (req, res) => {
    fs.unlinkSync(__dirname + '/../MarkdownFiles/' + req.params.filename + '.md');
});

module.exports = router;