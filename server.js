const cors = require('cors')

// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");

const { ExpressPeerServer } = require("peer");

const app = express();
app.use(cors())

// listen for requests :)
const listener = app.listen(process.env.PORT || 9000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// peerjs server
const peerServer = ExpressPeerServer(listener, {
  debug: true,
  path: '/myapp',
  allow_discovery: true
});

app.use('/peerjs', peerServer);
