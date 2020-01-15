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
    console.log(__dirname);
    res.sendFile(path.resolve(__dirname + '/../MarkdownFiles/' + req.params.filename + '.md'));
});

router.post('/:filename', (req, res) => {
    if (req.body.updatedFile.trim() != "") {
        var filename = req.originalUrl.slice(1) + '.md';
        fs.writeFileSync(__dirname + '/../MarkdownFiles/' + filename, req.body.updatedFile, function (err) {
            if (err) { return console.log(err); }
        });
    }
    res.redirect(req.originalUrl);
});

module.exports = router;