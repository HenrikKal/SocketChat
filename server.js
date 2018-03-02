const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;
const assert = require('assert');


// Connection URL
const url = 'mongodb://127.0.0.1/mongo';

const dbName = 'SocketChat';

// Connect to mongodb
mongo.connect(url, function(err, client){
  assert.equal(null, err);

  console.log('MongDB connected...');



});
