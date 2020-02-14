# md-server

Allows users to create, edit, and view markdown files.

Users can create an account and view documents they've created. They can also edit and delete them. This was designed with the intent that the URL would closely reflect the file structure. Users can create directories and navigate them from the UI and the URL as they prefer.

If anyone would like to build on this project, it could use the following features:
 * The ability to make a file public, allowing people without an account to view it.
 * File sharing. Users could send a file to another user with optional edit permissions.

# Setup

1. Clone directory
2. Run `npm install` in client and server directories
3. Create a .env file in the server directory with a SECRET variable. This is used for Json Web Token creation and verification.
4. Uncomment the CREATE TABLE line in database.js to initialize a user table. This can be commented out again after it runs once.
6. Create a directory in the server directory named `MarkdownFiles`.
5. In the client directory, run `npm run dev`
