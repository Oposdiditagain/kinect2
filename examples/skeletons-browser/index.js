var Kinect2 = require('../../lib/kinect2'),
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var zlib = require('zlib');

// var colorFrame = require('./self_module/colorFrame');

var kinect = new Kinect2();

app.use(express.static('public'));
if(kinect.open()) {
	server.listen(8011);
	console.log('Server listening on port 8011');
	console.log('Point your browser to http://localhost:8011');

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});
	app.get('/kinect-skeleton.html', function(req, res) {
		res.sendFile(__dirname + '/public_kinect/index.html');
	});
// ------------------------- colorFrame ----------------------------
	var compression = 6;

	var origWidth = 1920;
	var origHeight = 1080;
	var origLength = 4 * origWidth * origHeight;
	var compressedWidth = origWidth / compression;
	var compressedHeight = origHeight / compression;
	var resizedLength = 4 * compressedWidth * compressedHeight;
	//we will send a smaller image (1 / 10th size) over the network
	var resizedBuffer = new Buffer(resizedLength);
	var compressing = false;
	kinect.on('colorFrame', function(data){
		//compress the depth data using zlib
		if(!compressing) {
			compressing = true;
			//data is HD bitmap image, which is a bit too heavy to handle in our browser
			//only send every x pixels over to the browser
			var y2 = 0;
			for(var y = 0; y < origHeight; y+=compression) {
				y2++;
				var x2 = 0;
				for(var x = 0; x < origWidth; x+=compression) {
					var i = 4 * (y * origWidth + x);
					var j = 4 * (y2 * compressedWidth + x2);
					resizedBuffer[j] = data[i];
					resizedBuffer[j+1] = data[i+1];
					resizedBuffer[j+2] = data[i+2];
					resizedBuffer[j+3] = data[i+3];
					x2++;
				}
			}

			zlib.deflate(resizedBuffer, function(err, result){
				if(!err) {
					var buffer = result.toString('base64');
					io.sockets.sockets.forEach(function(socket){
						socket.volatile.emit('colorFrame', buffer);
					});
				}
				compressing = false;
			});
		}
	});

// ------------------------- colorFrame ----------------------------

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
						io.sockets.emit('getPersonCoors',coorsInfo);
					}
					if(handStateInfo.leftHandState !== null && handStateInfo.leftHandState !== undefined && handStateInfo.rightHandState !== null && handStateInfo.rightHandState !== undefined){
						io.sockets.emit('getPersonHandState',handStateInfo);

					}
				}
			}


	});

	kinect.openColorReader();

	kinect.openBodyReader();
}
