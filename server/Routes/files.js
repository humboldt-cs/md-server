const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path');

router.use(bodyParser.json());

router.get('/fetchNames', (req, res) => {
    const mdDirectory = __dirname + '/../MarkdownFiles/';

    fs.readdir(mdDirectory, (err, files) => {
        res.send(files);
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