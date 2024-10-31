// main.js
const { spawn } = require("child_process");
const path = require("path");

const child = spawn("node", [path.join(__dirname, "index.js")]);

// Capture standard output
child.stdout.on("data", (data) => {
  console.log(`STDOUT: ${data.toString()}`);
});

// Capture standard error
child.stderr.on("data", (data) => {
  console.error(`STDERR: ${data.toString()}`);
});

// Handle process exit
child.on("exit", (code, signal) => {
  if (signal) {
    console.log(`Child process was killed by signal: ${signal}`);
  } else {
    console.log(`Child process exited with code: ${code}`);
  }
});
// Handle errors
child.on("error", (error) => {
  console.error(`Failed to start subprocess: ${error}`);
});

// Kill the child process after 5 seconds
setTimeout(() => {
  console.log("Killing child process...");
  child.kill(); // Sends SIGTERM by default
}, 5000);
