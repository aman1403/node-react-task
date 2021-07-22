import http from 'http';
import { router } from './routes';
import cors from 'cors';

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://localhost:27017/db", 
    { useNewUrlParser: true, 
      useUnifiedTopology: true 
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log(`Connection failed due to ${err.message}`);
    });

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  console.log("Running on http://localhost:5000");
};

const port = normalizePort(process.env.PORT || "5000");
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
})

server.on('request', (req, res) => {
  // the same kind of magic happens here!
  let reqUrl = new URL(req.url, 'http://127.0.0.1/');
  let redirectedFunc = router[req.method + reqUrl.pathname] || router['default'];
  redirectedFunc(req, res);
});

server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
