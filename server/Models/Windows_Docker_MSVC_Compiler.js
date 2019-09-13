const fs = require('fs');
const { exec, execFile, spawn, onExit } = require('child_process');
const path = require("path");

/**
 * Constructor for Windows MSVC compiler, using Docker. 
 * @param {Object} db Database connection.
 * @param {String} workspace_path Path to directory containing files to compile and run. 
 * @param {Number} assignment_id This code's assignment's ID number (integer). 
 * @param {Number} student_id ID number of the user to whom this code belongs.
 * @param {String} tools_setup_cmd Command for setting up build tools. 
 * @param {String} compile_cmd Command for compiling this code. 
 * @param {String} stdin Input stream to be entered into code. 
 * @param {Number} [timeout=15000] 
 */
class Compiler {
   constructor(db, workspace_path, assignment_id, student_id, tools_setup_cmd, compile_cmd, stdin, timeout = 15000) {
      this.db = db;
      this.workspace_path = workspace_path;
      this.assignment_id = assignment_id;
      this.student_id = student_id;
      this.tools_setup_cmd = tools_setup_cmd;
      this.compile_cmd = compile_cmd;
      this.assignment_workspace = this.workspace_path + "/" + assignment_id;
      this.student_workspace = this.assignment_workspace + "/" + student_id;
      this.stdin = stdin;
      this.timeout = timeout;

      this.begin = this.begin.bind(this);
      this.loadFiles = this.loadFiles.bind(this);
      this.compileFiles = this.compileFiles.bind(this);
      this.createDockerFile = this.createDockerFile.bind(this);
      this.createRunFile = this.createRunFile.bind(this);
      this.createDockerBuildFile = this.createDockerBuildFile.bind(this);
      this.createDockerRunFile = this.createDockerRunFile.bind(this);
      this.buildDockerContainer = this.buildDockerContainer.bind(this); 
      this.runDockerContainer = this.runDockerContainer.bind(this);
      this.canRunFiles = this.canRunFiles.bind(this); 
   }

   /**
    * Start the process of compiling and running code.
    * @returns {Promise} Represents whether the code successfully compiled and ran. 
    *    Resolves with output from running code if successful, rejects with error 
    *    message otherwise. 
    */
   begin() {
      return new Promise((resolve, reject) => {
         this.loadFiles()
            .then(files => this.compileFiles())
            .then(result => this.createRunFile())
            .then(result => this.createDockerFile())
            .then(result => this.createDockerBuildFile())
            .then(result => this.createDockerRunFile())
            .then(result => this.buildDockerContainer())
            .then(result => this.runDockerContainer())
            .then(result => {
               resolve(result);
            })
            .catch(err => {
               reject(err);
            });
      });
   }

   /**
    * Step #1: Load files stored in DB onto local file system
    * @returns {Promise} Resolves with all files in addition to stdin.txt if 
    *    files were successfully loaded onto local file system. Rejects with
    *    error otherwise. 
    */
   loadFiles() {

      return new Promise((resolve, reject) => {

         //grab all files from the DB
         this.db.AssignmentFiles.all(this.assignment_id, this.student_id)
            .then(files => {
               if (files.length === 0) {
                  reject("No files found");
               }

               //add stdin as a file
               files.push({ file_name: "stdin.txt", contents: this.stdin });

               //and throw them into a temp workspace
               let write_counter = 0;

               if (fs.existsSync(this.assignment_workspace) === false) {
                  fs.mkdirSync(this.assignment_workspace);
               }
               if (fs.existsSync(this.student_workspace) === false) {
                  fs.mkdirSync(this.student_workspace);
               }
               for (let file of files) {
                  const file_path = this.student_workspace + "/" + file.file_name;
                  file.path = file_path;
                  fs.writeFile(file_path, file.contents, { encoding: "utf8" }, (err) => {
                     if (!err) {
                        write_counter++;
                        if (write_counter === files.length) {
                           resolve(files);
                        }
                     }
                     else {
                        reject(err);
                     }
                  });
               }
            })
            .catch(err => {
               reject(err); 
            });
      });
   }

   /**
    * Step #2: compile files after loading from the DB.
    * @returns {Promise} Resolves with output from compiler if successful; 
    *    rejects with error otherwise.
    */
   compileFiles() {
      return new Promise((resolve, reject) => {
         //create BATCH file
         const absolute_path = path.resolve(this.student_workspace);
         const bat_path = absolute_path + "/compile.bat";
         const bat_commands = "@ECHO OFF\r\n" +
            "CALL " + this.tools_setup_cmd + "\r\n" + //AC Note: had to remove escaped quotes on work PC.  Needed for home PC?
            "CD \"" + absolute_path + "\"\r\n" +
            this.compile_cmd;

         fs.writeFile(bat_path, bat_commands, { encoding: "utf8" }, (err) => {
            if (!err) {
               exec(bat_path, (err, stdout, stderr) => {
                  if (!err) {
                     resolve(stdout);
                  }
                  else {
                     reject(err);
                  }
               });
            }
            else {
               reject(err);
            }
         });
      });
   }

   /** 
    * Creates docker file that will run the untrusted code.
    * @returns {Promise} Resolves with true if the docker file was successfully created.
    *    Rejects with error otherwise. 
    */
   createDockerFile() {
      return new Promise((resolve, reject) => {
         const absolute_path = path.resolve(this.student_workspace);

         const docker_file_contents = "FROM microsoft/nanoserver:1903\r\n" +
            'SHELL ["cmd", "/S", "/C"]\r\n' +
            "WORKDIR /TEMP\r\n" +
            "COPY . /TEMP\r\n" +
            'CMD ["run.bat"]';
         const docker_file_path = absolute_path + '/Dockerfile';
         fs.writeFile(docker_file_path, docker_file_contents, { encoding: "utf8" }, (err) => {

            if (!err) {
               resolve(true);
            }
            else {
               reject(err);
            }
         });
      });
   }

   /** 
    * Creates the run.bat file that will be responsible for running the user's code on the supplied stdin.
    * @returns {Promise} Resolves with true if the .bat file was successfully created.
    *    Rejects with error otherwise. 
    */
   createRunFile() {

      return new Promise((resolve, reject) => {
         //create BATCH that will run in docker container file
         const absolute_path = path.resolve(this.student_workspace);
         const bat_path = absolute_path + "/run.bat";
         const bat_commands = "@ECHO OFF\r\n" +
            "CD /TEMP\r\n" +
            "main.exe < stdin.txt";

         fs.writeFile(bat_path, bat_commands, { encoding: "utf8" }, (err) => {
            if (!err) {
               resolve(true);
            }
            else {
               reject(err);
            }
         });
      });
   }

   /** 
    * Create BATCH file that will build the docker container.
    * @returns {Promise} Resolves with the name of the docker image if successful.
    *    Rejects with error otherwise. 
    */
   createDockerBuildFile() {
      return new Promise((resolve, reject) => {

         const absolute_path = path.resolve(this.student_workspace);
         const build_bat_path = absolute_path + "/docker_build.bat";
         const image_name = "cpp_" + this.assignment_id + "_" + this.student_id;
         const build_commands = "@ECHO OFF\r\n" +
            "CD \"" + absolute_path + "\"\r\n" +
            "docker build -t " + image_name + " .";

         fs.writeFile(build_bat_path, build_commands, { encoding: "utf8" }, (err) => {
            if (!err) {
               resolve(image_name);
            }
            else {
               reject(err);
            }
         });
      });
   }

   /** 
    * Create BATCH file that will run the docker container.
    * @returns {Promise} Resolves with the name of the docker image if successful.
    *    Rejects with error otherwise. 
    */
   createDockerRunFile() {
      return new Promise((resolve, reject) => {

         const absolute_path = path.resolve(this.student_workspace);
         const bat_path = absolute_path + "/docker_run.bat";
         const image_name = "cpp_" + this.assignment_id + "_" + this.student_id;
         const build_commands = "@ECHO OFF\r\n" +
            "CD \"" + absolute_path + "\"\r\n" +
            "docker run --rm " + image_name;

         fs.writeFile(bat_path, build_commands, { encoding: "utf8" }, (err) => {
            if (!err) {
               resolve(image_name);
            }
            else {
               reject(err);
            }
         });
      });
   }

   /**
    * Builds docker container where code will be run.
    * @returns {Promise} Resolves with output from building docker container if successful.
    *    Rejects with error otherwise. 
    */
   buildDockerContainer() {
      return new Promise((resolve, reject) => {

         const absolute_path = path.resolve(this.student_workspace);
         const bat_path = absolute_path + "/docker_build.bat";
         exec(bat_path, { timeout: this.timeout }, (err, stdout, stderr) => {
            if (!err) {
               resolve(stdout);
            }
            else {
               reject(err);
            }
         });
      });
   }

   /**
    * Runs docker container with untrusted code. 
    * @returns {Promise} Resolves with the result of running container with 
    *    untrusted code if successful. Rejects with error otherwise. 
    */
   runDockerContainer() {
      return new Promise((resolve, reject) => {

         //create BATCH file
         const absolute_path = path.resolve(this.student_workspace);
         const bat_path = absolute_path + "/docker_run.bat";

         exec(bat_path, { timeout: this.timeout }, (err, stdout, stderr) => {
            if (!err) {
               resolve(stdout);
            }
            else {
               reject(err);
            }
         });
      });
   }

   /**
    * If we're just testing the same program against multiple tests, it's wasteful to always
    * compile.  This function tells us if we can run an existing program without a compile
    * by checking to see if the necessasry files already exist (i.e. main.exe)
    * @returns {Promise} Resolves with true if the necessary files to run this program already 
    *    exist. Otherwise, if the necessary files don't already exist, we can't run this 
    *    program, so it rejects with error. 
    */
   canRunFiles() {
      return new Promise((resolve, reject) => {
         const exe_path = this.student_workspace + "/main.exe";
         fs.access(exe_path, fs.constants.F_OK, (err) => {
            if (!err) {
               //create new testing file
               const file_path = this.student_workspace + "/stdin.txt";
               fs.writeFile(file_path, this.stdin, { encoding: "utf8" }, (err) => {
                  if (!err) {
                     resolve(true);
                  }
                  else {
                     reject(err);
                  }
               });
            }
            else {
               reject("main.exe does not exist");
            }
         });
      });
   }
}

/**
 * Contains methods for compiling and running C++ code in Windows using Docker.
 * @typedef {Object} Compiler 
 */

/**
 * Creates an instance of the Windows MSVC compiler. 
 * @param {Object} db Database connection.
 * @param {String} workspace_path Path to directory containing files to compile and run. 
 * @param {Number} assignment_id This code's assignment's ID number (integer). 
 * @param {Number} student_id ID number of the user to whom this code belongs.
 * @param {String} tools_setup_cmd Command for setting up build tools. 
 * @param {String} compile_cmd Command for compiling this code. 
 * @param {String} stdin Input stream to be entered into code. 
 * @returns {Compiler} Windows MSVC compiler using Docker.
 */
exports.createCompiler = function (db, workspace_path, assignment_id, student_id, tools_setup_cmd, compile_cmd, stdin) {
   return new Compiler(db, workspace_path, assignment_id, student_id, tools_setup_cmd, compile_cmd, stdin);
}