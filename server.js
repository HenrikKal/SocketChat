const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;
const assert = require('assert');


// Connection URL
const url = 'mongodb://127.0.0.1/socketchat';

const dbName = 'SocketChat';

// Connect to mongodb
mongo.connect(url, function(err, db){
  assert.equal(null, err);

  console.log('MongDB connected...');

  // Connect to Socket.io
  client.on('connection', function(socket){
      console.log("onConnection");
      // Create a collection called 'chats' in mongodb
      let chat = db.db('socketchat').collection('chats');

      // Create function to send status to client from Server
      sendStatus = function(s){
        console.log('statusing');
        socket.emit('status', s); // pass from server to client
      }

      // Query chats from mongo collection
      chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
        assert.equal(null, err);

        // Send query results to socket
        console.log('outputting');
        socket.emit('output', res);


      });

  // Handle input events
  socket.on('input', function(data){
    let name = data.name;
    let message = data.message;

    // Check for name and message
    if (name == '' || message == ''){
      // Send error sendStatus
      sendStatus('Please enter a nanme and message');
    } else {
      //Insert messages
      chat.insert({name: name, message: message}, function(){
        client.emit('output', [data]);

        // Send status object
        sendStatus({
          message: 'Message sent',
          clear: true
        });
      });
    }
  });

  // Handle clera
  socket.on('clear', function(){
    // Remove all chats from collection
    chat.remove({}, function(){
      // Emit cleared
      socket.emit('cleared');
    });
  });

});



});
