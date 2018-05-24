		var socket = io.connect('/');
			// console.log(socket);

		var canvas = document.getElementById('view');
		var ctx = canvas.getContext('2d');
		var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

		// handstate circle size
		var HANDSIZE = 20;

		// closed hand state color
		var HANDCLOSEDCOLOR = "red";

		// open hand state color
		var HANDOPENCOLOR = "green";

		// lasso hand state color
		var HANDLASSOCOLOR = "blue";

		function updateHandState(handState, jointPoint) {
			// console.log("handstate");
			switch (handState) {
				case 3:
					drawHand(jointPoint, HANDCLOSEDCOLOR);
				break;

				case 2:
					drawHand(jointPoint, HANDOPENCOLOR);
				break;

				case 4:
					drawHand(jointPoint, HANDLASSOCOLOR);
				break;
			}
		}

		function drawHand(jointPoint, handColor) {
			// draw semi transparent hand cicles
			// console.log("handColor");

			ctx.globalAlpha = 0.75;
			ctx.beginPath();
			ctx.fillStyle = handColor;
			ctx.arc(jointPoint.depthX * 512, jointPoint.depthY * 484, HANDSIZE, 0, Math.PI * 2, true);
			// console.log("jointPoint: " + jointPoint + " x: " + jointPoint.depthX * 512 + " y: " + jointPoint.depthY * 484);
			ctx.fill();
			ctx.closePath();
			ctx.globalAlpha = 1;
		}

		function updatePerson(joints){
			// console.log(joints);
			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.lineWidth = 5;
			ctx.lineTo(joints[0].depthX * 512,joints[0].depthY * 484);
			ctx.lineTo(joints[1].depthX * 512,joints[1].depthY * 484);
			ctx.lineTo(joints[20].depthX * 512,joints[20].depthY * 484);
			ctx.lineTo(joints[2].depthX * 512,joints[2].depthY * 484);
			ctx.lineTo(joints[3].depthX * 512,joints[3].depthY * 484);
			ctx.moveTo(joints[20].depthX * 512,joints[20].depthY * 484);
			ctx.lineTo(joints[8].depthX * 512,joints[8].depthY * 484);
			ctx.lineTo(joints[9].depthX * 512,joints[9].depthY * 484);
			ctx.lineTo(joints[10].depthX * 512,joints[10].depthY * 484);
			ctx.lineTo(joints[11].depthX * 512,joints[11].depthY * 484);
			ctx.lineTo(joints[24].depthX * 512,joints[24].depthY * 484);
			ctx.moveTo(joints[11].depthX * 512,joints[11].depthY * 484);
			ctx.lineTo(joints[23].depthX * 512,joints[23].depthY * 484);
			ctx.moveTo(joints[20].depthX * 512,joints[20].depthY * 484);
			ctx.lineTo(joints[4].depthX * 512,joints[4].depthY * 484);
			ctx.lineTo(joints[5].depthX * 512,joints[5].depthY * 484);
			ctx.lineTo(joints[6].depthX * 512,joints[6].depthY * 484);
			ctx.lineTo(joints[7].depthX * 512,joints[7].depthY * 484);
			ctx.lineTo(joints[21].depthX * 512,joints[21].depthY * 484);
			ctx.moveTo(joints[7].depthX * 512,joints[7].depthY * 484);
			ctx.lineTo(joints[22].depthX * 512,joints[22].depthY * 484);
			ctx.moveTo(joints[0].depthX * 512,joints[0].depthY * 484);
			ctx.lineTo(joints[16].depthX * 512,joints[16].depthY * 484);
			ctx.lineTo(joints[17].depthX * 512,joints[17].depthY * 484);
			ctx.lineTo(joints[18].depthX * 512,joints[18].depthY * 484);
			ctx.lineTo(joints[19].depthX * 512,joints[19].depthY * 484);
			ctx.moveTo(joints[0].depthX * 512,joints[0].depthY * 484);
			ctx.lineTo(joints[12].depthX * 512,joints[12].depthY * 484);
			ctx.lineTo(joints[13].depthX * 512,joints[13].depthY * 484);
			ctx.lineTo(joints[14].depthX * 512,joints[14].depthY * 484);
			ctx.lineTo(joints[15].depthX * 512,joints[15].depthY * 484);
			ctx.stroke();
		}

		socket.on('bodyFrame', function(bodyFrame){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			var index = 0;
			bodyFrame.bodies.forEach(function(body){
				if(body.tracked) {
					// console.log(body.joints);
					// updatePerson(body.joints);
					for(var jointType in body.joints) {
						// console.log(jointType);
						var joint = body.joints[jointType];
						ctx.fillStyle = colors[index];
						// if(jointType == 0 || jointType == 20 || jointType == 3) {
						// 	ctx.fillRect(joint.depthX * 512, joint.depthY * 484, 15, 15);
						// }else{
						// 	ctx.fillRect(joint.depthX * 512, joint.depthY * 484, 10, 10);
						// }
						
					}
					//draw hand states
					updateHandState(body.leftHandState, body.joints[7]);
					updateHandState(body.rightHandState, body.joints[11]);
					index++;
				}
			});
		});