const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

class UsersDb {

   /**
    * UsersDb constructor.
    * @param {Object} db_connection The database connection. 
    * @param {String} crypto_method Cryptographic hash method.
    */
   constructor(db_connection, crypto_method) {
      this.db = db_connection;
      this.crypto_method = crypto_method;

      this.authenticate = this.authenticate.bind(this);
      this.create = this.create.bind(this);
      this.exists = this.exists.bind(this);
      this.hash_password = this.hash_password.bind(this);
      this.userRow = this.userRow.bind(this); 
   }


   /**
    * Attempts to authenticate the supplied email / password combo.  
    * @param {String} email The supplied email. 
    * @param {String} password The suppllied password. 
    * @returns {Promise} Resolves with user if valid; rejects with -1 otherwise. 
    */
   authenticate(email, password) {
      const sql = "SELECT * FROM users WHERE email = $email AND password = $password LIMIT 1";
      password = this.hash_password(password, email);
      const params = { $email: email, $password: password };
      return new Promise((resolve, reject) => {
         this.db.get(sql, params, (err, row) => {
            if (err === null && row !== undefined) {
               resolve(row);
            }
            else {
               reject(-1); 
            }
         });
      });
   }

   /**
    * Creates a new user.
    * @param {Object} user The user to create. 
    * @returns {Promise} Resolves with the new user's ID if successful; rejects with error otherwise. 
    */
   create(user) {
      const sql = "INSERT INTO users " +
         " (email, first_name, last_name, password) " +
         " VALUES ($email, $first_name, $last_name, $password)";

      //hash password
      const password = this.hash_password(user.password, user.email);

      //add base options
      const params = { $email: user.email, $first_name: user.first_name, $last_name: user.last_name, $password: password };
      
      return new Promise((resolve, reject) => {

         //AC: placing db callback function into its own variable changes 
         //*this* from local object to result of sqlite3 db call.
         var local_callback = function (err) {
            if (err === null) {
               resolve(this.lastID);
            }
            else {
               console.log(err);
               reject(err);
            }
         };
         this.db.run(sql, params, local_callback);
      });
   }

   /**
    * Returns true if the user exists in the system.
    * @param {String} user_name 
    * @returns {Promise} Resolves with true if the user exists, and false if not. 
    */
   exists(user_name){
      const sql = "SELECT * FROM users WHERE email = $email LIMIT 1";
      const params = { $email: user_name};
      return new Promise((resolve, reject) => {
         this.db.get(sql, params, (err, row) => {
            if (err === null && row !== undefined) {
               resolve(true);
            }
            else {
               reject(false);
            }
         });
      });
   }

   /**
    * Hashes the supplied password.  By convention, salt should be the user's email.
    * @param {String} password The supplied password.
    * @param {*} salt Salt for hashing password. 
    * @returns {String} The hashed password. 
    */
   hash_password(password, salt) {
      let hasher = crypto.createHash(this.crypto_method);
      password += this.hash_salt + salt;
      hasher.update(password);
      password = hasher.digest('hex');
      return password;
   }

   /** 
    * Selects information from users table for requested user.
    * @param {String} email The requested user's email.
    * @returns {Promise} Resolves with the user if the user exists and there are no errors;
    *    rejects otherwise. 
    */
   userRow(email) {
      const sql = "SELECT * FROM users WHERE email = $email LIMIT 1"; 
      const params = {$email: email};
      return new Promise((resolve, reject) => {
         this.db.get(sql, params, (err, row) => {
            if(err === null && row !== undefined) {
               resolve(row); 
            }
            else {
               reject(err); 
            }
         });
      });
   }
}

/**
 * Contains methods to interact with user records in database.
 * @typedef {Object} UsersDb
 */

/**
 * Creates a new UsersDb.
 * @param {Object} db_connection Database connection.
 * @param {String} crypto_method Cryptographic hash method.
 * @returns {UsersDb} Instance of UsersDb.
 */
exports.createUsersDb = function (db_connection, crypto_method) {
   return new UsersDb(db_connection, crypto_method);
}