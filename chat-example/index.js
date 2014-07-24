var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

//通过io.of('/XXX')定义不同的命名空间，在不同的命名空间下各操作互不影响
var gattio = io.of('/gatt.io.test');
gattio.on('connection',function(socket){

  console.log(socket.id + "is connected! in gattio");

  socket.on('request',function(request){
	console.log('request:' + JSON.stringify(request));
	request.room = socket.id;
	gattio.emit("request",request);	
  });
	
  socket.on('response',function(response){
  	console.log('response',JSON.stringify(response));
	gattio.to(response.room).emit("response",response);
  });
});

var gattio2 = io.of('/gatt.yes');
gattio2.on('connection',function(socket2){
	console.log(socket2.id+"is connected, in gattio2");
	
	socket2.on('request',function(request){
		console.log('request2:' + JSON.stringify(request));
		request.room = socket2.id;
		gattio2.emit("request",request);	
	});
});

http.listen(3333, function(){
  console.log('listening on *:3333');
});
