var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

var nicknames = []; 

server.listen(3001);
console.log("Chat Server listening at 3001..");

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection',function(socket){
	console.log("received connection");

   socket.on('new_user',function(data, callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}else{
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			io.sockets.emit('user_list_modified', nicknames);
		}
      //  io.sockets.emit('usernames',data);

      //sockets.broadcast.emit('new_message',data)
	});

	socket.on('send_message',function(data){
		console.log("received send_message");
        io.sockets.emit('new_message',{"user": socket.nickname, "data":data});
         // sockets.broadcast.emit('new_message',data)
	});

	socket.on('disconnect',function(data){
		if(!socket.nickname) return;

		nicknames.splice(nicknames.indexOf(socket.nickname),1);
        io.sockets.emit('user_list_modified', nicknames);
      //sockets.broadcast.emit('new_message',data)
	});
});