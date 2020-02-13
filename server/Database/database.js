const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./md-server.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to database.');
  });

db.serialize(function() {

    // var stmt = db.prepare("INSERT INTO users VALUES (?,?)");
    // for (var i = 0; i < 10; i++) {
    //     var email = "hi@there.com";
    //     var password = "bigsecure";
    //     stmt.run(email, password);
    // }
    // stmt.finalize();

    db.each("SELECT email, password FROM users", function(err, row) {
        console.log("Email: " + row.email + " Password: " + row.password);
    });
});

db.close();