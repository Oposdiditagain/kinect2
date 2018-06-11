var socket = io.connect('/');
		var canvas = document.getElementById('bodyCanvas');
		var ctx = document.getElementById('bodyCanvas').getContext('2d');

		var colorProcessing = false;
		var colorWorkerThread = new Worker("/scripts/kinectColor/colorWorker.js");
		
		colorWorkerThread.addEventListener("message", function (event) {
			if(event.data.message === 'imageReady') {
				// console.log(event.data.imageData);			
				// console.log(document.getElementById('bodyCanvas').getContext('2d'));	
                document.getElementById('bodyCanvas').getContext('2d').putImageData(event.data.imageData, 0, 0);
                colorProcessing = false;
			}
		});

		colorWorkerThread.postMessage({
			"message": "setImageData",
			"imageData": ctx.createImageData(canvas.width, canvas.height)
		});

		socket.on('colorFrame', function(imageBuffer){
			if(!colorProcessing) {
				colorProcessing = true;
				colorWorkerThread.postMessage({ "message": "processImageData", "imageBuffer": imageBuffer });
			}
		});