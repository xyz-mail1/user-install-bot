const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;
let child;
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
});

// Middleware to serve static files and parse JSON
app.use(express.static("public"));
app.use(express.json());

// Serve index.html at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the child process
app.post("/start", (req, res) => {
  if (child) {
    return res.status(400).json({ message: "Process is already running." });
  }

  child = spawn("node", [path.join(__dirname, "index.js")]);

  child.stdout.on("data", (data) => {
    const message = `STDOUT: ${data.toString()}`;
    console.log(message);
    broadcast(message);
  });

  child.stderr.on("data", (data) => {
    const message = `STDERR: ${data.toString()}`;
    console.error(message);
    broadcast(message);
  });

  child.on("exit", (code) => {
    console.log(`Child process exited with code: ${code}`);
    broadcast(`Child process exited with code: ${code}`);
    child = null; // Reset child reference when process exits
  });

  res.json({ message: "Process started." });
});

// Stop the child process
app.post("/stop", (req, res) => {
  if (!child) {
    return res.status(400).json({ message: "No process is running." });
  }

  child.kill();
  child = null; // Reset child reference
  res.json({ message: "Process stopped." });
});

// Restart the child process
app.post("/restart", (req, res) => {
  if (child) {
    child.kill();
  }

  child = spawn("node", [path.join(__dirname, "index.js")]);

  child.stdout.on("data", (data) => {
    const message = `STDOUT: ${data.toString()}`;
    console.log(message);
    broadcast(message);
  });

  child.stderr.on("data", (data) => {
    const message = `STDERR: ${data.toString()}`;
    console.error(message);
    broadcast(message);
  });

  child.on("exit", (code) => {
    console.log(`Child process exited with code: ${code}`);
    broadcast(`Child process exited with code: ${code}`);
    child = null; // Reset child reference
  });

  res.json({ message: "Process restarted." });
});

// Deploy the script
app.post("/deploy", (req, res) => {
  const deployProcess = spawn("node", [path.join(__dirname, "deploy.js")]);

  deployProcess.stdout.on("data", (data) => {
    const message = `DEPLOY STDOUT: ${data.toString()}`;
    console.log(message);
    broadcast(message);
  });

  deployProcess.stderr.on("data", (data) => {
    const message = `DEPLOY STDERR: ${data.toString()}`;
    console.error(message);
    broadcast(message);
  });

  deployProcess.on("exit", (code) => {
    console.log(`Deploy process exited with code: ${code}`);
    broadcast(`Deploy process exited with code: ${code}`);
  });

  res.json({ message: "Deploy script is running." });
});

// Broadcast message to all connected clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const url = "https://user-install-bot.onrender.com/";

function keepAlive() {
  fetch(url)
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toISOString()}:`,
        error.message
      );
    });
}

setInterval(keepAlive, 30000);
