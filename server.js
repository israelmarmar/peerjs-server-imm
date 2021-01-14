const cors = require('cors');
const fetch = require("node-fetch");
let connected = [];

// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");

const { ExpressPeerServer } = require("peer");

const app = express();

app.use(cors);

// listen for requests :)
const listener = app.listen(process.env.PORT || 9000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// peerjs server
const peerServer = ExpressPeerServer(listener, {
  path: '/myapp',
  debug: true,
  key: "peerjs"
});

peerServer.on('connection', function (client) {
  var idx = connected.indexOf(client.id); // only add id if it's not in the list yet
  if (idx === -1) {connected.push(client.id);}
});

peerServer.on('disconnect', function (client) {
  var idx = connected.indexOf(client.id); // only attempt to remove id if it's in the list
  if (idx !== -1) {connected.splice(idx, 1);}
});

app.get('/', function(req, res) {
  res.json(connected);
});

app.get('/chunkeds', async function(req, res) {

  if(req.query.urls){
  const chunkeds = JSON.parse(req.query.urls);

  const scripts = await Promise.all(chunkeds.map(u=>fetch(u))).then(responses =>
    Promise.all(responses.map(res => res.text()))
  );

  res.json(scripts);
  }else
  res.json([]);
});

app.use('/peerjs', peerServer);
