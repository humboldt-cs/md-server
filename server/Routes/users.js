const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const saltRounds = 15;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AUTH_FAILURE = "auth failure";
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database/md-server.db');
const dotenv = require('dotenv').config({ path: __dirname + '/../.env' });

router.use(bodyParser.json());

if (dotenv.error) {
    console.log("Error loading .env: " + dotenv.error);
    throw dotenv.error;
}

router.post('/login', (req, res) => {
    if (req.body === undefined
        || !req.body.email.trim()
        || !req.body.password.trim()) {
            res.send(AUTH_FAILURE);
            return null;
        }

    var email = req.body.email;
    var password = req.body.password;
    var encryptedPassword = '';

    db.get("SELECT password FROM users WHERE email = ?", [email], function(err, row) {
        if (err) { 
            console.log(err);
            return null;
        }
        if (row !== undefined) {
            bcrypt.compare(password, row.password, function (err, bcryptResponse) {
                if (err) {
                    console.log(err);
                    return null;
                }
                if (bcryptResponse) {
                    console.log("Password match");
                    jwt.sign({ email }, process.env.SECRET, { expiresIn: '7 days' }, (err, token) => {
                        if (err) {
                            console.log(err);
                            return null;
                        }
                        res.send(token);
                    });
                } else {
                    console.log("Incorrect password");
                    res.send(AUTH_FAILURE);
                }
            });
        }else{
            console.log("Query response undefined");
            res.send(AUTH_FAILURE);
        }
    });
});

router.post('/newUser', (req, res) => {
    if (req.body === undefined
        || !req.body.email.trim()
        || !req.body.password.trim()) {
            res.send(AUTH_FAILURE);
            return null;
        }

    var email = req.body.email;
    var password = req.body.password;

    console.log(email, password);

    db.get("SELECT password FROM users WHERE email = ?", [email], function(err, row) {
        if (err) { 
            console.log(err);
            return null;
        }

        if (row !== undefined) {
            console.log('Email in use');
            res.send(AUTH_FAILURE);
            return null;
        }else{
            password = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
            db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, password]);

            // Create user folder for .md files
            fs.mkdirSync(__dirname + '/../MarkdownFiles/' + email);
            res.send('account created');
        }
    });
});

module.exports = router;