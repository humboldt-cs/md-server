 /** 
  * Creates new user.
  * @param {Object} req HTTP request object. 
  * @param {Object} res HTTP response object. 
  * @param {Object} db Database connection. 
  * @returns {Object} JSON response with the newly created user object, or 
  *   with an error message if unsuccessful. 
  */
 exports.createUser = function(req, res, db) {
    const user = { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password };
    if (user.first_name !== undefined && user.first_name.length > 0) {
       if (user.last_name !== undefined && user.last_name.length > 0) {
          if (user.email !== undefined && user.email.length > 0) {
             if (user.password !== undefined && user.password.length > 0) {
                db.Users.create(user)
                  .then(result => {
                      user.id = result;
                      delete user.password;
                      res.json({ response: user });
                  })
                  .catch(err => {
                     res.json({ response: err });
                  });
               return; 
             }
          }
       }
    }
    res.json({ response: "missing required parameters" });
 }

/** 
 * Returns information on currently logged in user.
 * @param {Object} req HTTP request object. 
 * @param {Object} res HTTP response object. 
 * @returns {Object} JSON response containing information on logged-in user. 
 */
exports.info = function(req, res) {
    res.json({ response: req.session.user });
}

/**  
 * Logs in a user with given credentials.
 * @param {Object} req HTTP request object. 
 * @param {Object} res HTTP response object. 
 * @param {Object} db Database connection. 
 * @returns {Object} JSON response with information on logged-in user if successful, 
 *    or with error message if authentication fails. 
 */
exports.login = function(req, res, db){
   db.Users.authenticate(req.body.email, req.body.password)
   .then(result => {
      delete result.password;
      req.session.user = result;
      res.json({ response: result });
   })
   .catch(err => {
      res.json({ response: err });
   });
}
 
/** 
 * Logs out user.
 * @param {Object} req HTTP request object. 
 * @param {Object} res HTTP response object. 
 * @returns {Object} JSON response. Should be null if logout was successful. 
 */
exports.logout = function(req, res) {
    req.session.user = null;
    res.json({ response: req.session.user });
}