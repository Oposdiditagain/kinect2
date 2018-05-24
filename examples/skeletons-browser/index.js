var Kinect2 = require('../../lib/kinect2'),
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

var kinect = new Kinect2();

app.use(express.static('public'));
if(kinect.open()) {
	server.listen(8011);
	console.log('Server listening on port 8011');
	console.log('Point your browser to http://localhost:8011');

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});

	kinect.on('bodyFrame', function(bodyFrame){
		io.sockets.emit('bodyFrame', bodyFrame);

			for(var i = 0; i < bodyFrame.bodies.length; i++){
				if(bodyFrame.bodies[i].tracked === true){

					var body = bodyFrame.bodies[i];
					var coorsInfo = {
						"coorsX": body.joints[11].depthX*1920,
						"coorsY": body.joints[11].depthY*1080,
					}
					var handStateInfo = {
						"leftHandState": body.leftHandState,
						"rightHandState":body.rightHandState
					}
					if(coorsInfo.coorsX !== null && coorsInfo.coorsX !== undefined && coorsInfo.coorsY !== null && coorsInfo.coorsY !== undefined){
						// console.log("coorsInfo: " + coorsInfo);
						io.sockets.emit('getPersonCoors',coorsInfo);
					}
					if(handStateInfo.leftHandState !== null && handStateInfo.leftHandState !== undefined && handStateInfo.rightHandState !== null && handStateInfo.rightHandState !== undefined){
						// console.log("handStateInfo: " + handStateInfo);
						io.sockets.emit('getPersonHandState',handStateInfo);
					
					}
					// console.log(bodyFrame);
				}
			}
		

	});

	kinect.openBodyReader();
}
