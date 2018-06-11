// -----------------------------------------------------------------------
// Inspired by KinectWorker-1.8.0.js from the 1.8 Microsoft SDK.
// -----------------------------------------------------------------------

(function(){

    importScripts('/scripts/kinectColor/pako.inflate.min.js'); 

    var imageData;

    function init() {
        addEventListener('message', function (event) {
            switch (event.data.message) {
                case "setImageData":
                    imageData = event.data.imageData;
                    break;
                case "processImageData":
                    processImageData(event.data.imageBuffer);
                    break;
            }
        });
    }

    function processImageData(compressedData) {
        var imageBuffer = pako.inflate(atob(compressedData));
        var pixelArray = imageData.data;
        // console.log(imageData);
        var newPixelData = new Uint8Array(imageBuffer);
        var imageDataSize = imageData.data.length;
        // console.log(newPixelData);

        for (var i = 0; i < imageDataSize; i++) {
                imageData.data[i] = newPixelData[i];
        }
        self.postMessage({ "message": "imageReady", "imageData": imageData });
    }

    init();
})();