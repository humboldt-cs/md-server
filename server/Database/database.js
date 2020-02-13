const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./Database/md-server.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to database.');
  });

db.serialize(function() {
    
  // db.run("DROP TABLE users;");
  // db.run("CREATE TABLE users (email VARCHAR(100) PRIMARY KEY UNIQUE, password VARCHAR(100))");

  //   var stmt = db.prepare("INSERT INTO users VALUES (?,?)");
  //   for (var i = 0; i < 1; i++) {
  //       var email = "hi@there.com";
  //       var password = "bigsecure";
  //       stmt.run(email, password);
  //   }
  //   stmt.finalize();

    db.each("SELECT email, password FROM users", function(err, row) {
        console.log("Email: " + row.email + " Password: " + row.password);
    });
});

db.close();